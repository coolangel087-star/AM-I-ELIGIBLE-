import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db, checkCollegeEligibility } from './server/db.js';
import { evaluateEligibility, calculateAge } from './server/eligibilityEngine.js';
import { subscriptionsDb } from './server/subscriptions.js';
import { UserProfile, Opportunity, EligibilityResponse, SubscriptionAlertPreferences } from './shared/types.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Initialize Gemini SDK
const ai = new GoogleGenAI();

// Security: Disable X-Powered-By
app.disable('x-powered-by');

// Security Headers Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '0');
  next();
});

// In-memory admin session storage with TTL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@AmIEligible2026';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const activeAdminTokens = new Map<string, { createdAt: number }>();

// Brute force protection tracker: IP -> { failedAttempts, lockoutUntil }
const loginAttemptTracker = new Map<string, { failedAttempts: number; lockoutUntil: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of activeAdminTokens.entries()) {
    if (now - data.createdAt > TOKEN_TTL_MS) {
      activeAdminTokens.delete(token);
    }
  }
  for (const [ip, record] of loginAttemptTracker.entries()) {
    if (now > record.lockoutUntil && record.failedAttempts === 0) {
      loginAttemptTracker.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

// Helper: Timing-safe password verification
function verifyAdminPassword(input: string): boolean {
  if (typeof input !== 'string') return false;
  const inputHash = crypto.createHash('sha256').update(input).digest();
  const actualHash = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest();
  return crypto.timingSafeEqual(inputHash, actualHash);
}

app.use(express.json({ limit: '10mb' }));

// Helper: Admin authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const tokenData = activeAdminTokens.get(token);
  if (!tokenData || Date.now() - tokenData.createdAt > TOKEN_TTL_MS) {
    if (tokenData) activeAdminTokens.delete(token);
    res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    return;
  }
  next();
}

// ----------------------------------------------------
// PUBLIC API ENDPOINTS
// ----------------------------------------------------

// 0. System Health & Security Metrics
app.get('/api/health', (_req: Request, res: Response) => {
  const memory = process.memoryUsage();
  const allOpps = db.getAll(false);
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: '1.0.0',
    environment: isProd ? 'production' : 'development',
    database: {
      totalOpportunities: allOpps.length,
      verifiedCycles: allOpps.filter(o => o.currentCycle.isVerified).length,
      publishedOpportunities: allOpps.filter(o => o.isPublished).length,
      activeSubscriptions: subscriptionsDb.count(),
      status: 'connected',
    },
    system: {
      memoryUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      memoryTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
      nodeVersion: process.version,
    },
    security: {
      rateLimiting: 'active',
      timingSafeAuth: 'active',
      tokenTtlMinutes: TOKEN_TTL_MS / 60000,
      securityHeaders: 'active',
    },
  });
});

// 1. Get opportunities (with filtering & search)
app.get('/api/opportunities', (req: Request, res: Response) => {
  const { search, category, educationLevel } = req.query;
  let list = db.getAll(false);

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter(o => o.category.toLowerCase() === category.toLowerCase());
  }

  if (educationLevel && typeof educationLevel === 'string' && educationLevel !== 'All') {
    list = list.filter(o =>
      o.minEducationLevel.toLowerCase() === educationLevel.toLowerCase() ||
      o.allowedEducationLevels.some(l => l.toLowerCase() === educationLevel.toLowerCase())
    );
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.shortName.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q) ||
      o.conductingOrg.toLowerCase().includes(q) ||
      o.summary.toLowerCase().includes(q)
    );
  }

  res.json({
    total: list.length,
    opportunities: list,
  });
});

// 1b. Search suggestions endpoint (fast autosuggest from DB index)
app.get('/api/opportunities/suggestions', (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  if (!q) {
    res.json({ suggestions: [] });
    return;
  }

  const all = db.getAll(false);
  const examSuggestions: Array<{
    type: 'exam';
    title: string;
    subtitle: string;
    category: string;
    slug: string;
    matchText: string;
  }> = [];

  const matchedCategories = new Set<string>();

  for (const opp of all) {
    // Check category match
    if (opp.category.toLowerCase().includes(q)) {
      matchedCategories.add(opp.category);
    }

    // Check exam match
    const nameMatch = opp.name.toLowerCase().includes(q);
    const shortNameMatch = opp.shortName.toLowerCase().includes(q);
    const orgMatch = opp.conductingOrg.toLowerCase().includes(q);

    if (nameMatch || shortNameMatch || orgMatch) {
      examSuggestions.push({
        type: 'exam',
        title: opp.shortName || opp.name,
        subtitle: opp.name !== opp.shortName ? opp.name : opp.conductingOrg,
        category: opp.category,
        slug: opp.slug,
        matchText: opp.shortName,
      });
    }
  }

  const categorySuggestions = Array.from(matchedCategories).map(cat => ({
    type: 'category' as const,
    title: cat,
    subtitle: 'Browse sector category',
    category: cat,
    matchText: cat,
  }));

  // Limit suggestions for fast response
  const suggestions = [
    ...categorySuggestions.slice(0, 3),
    ...examSuggestions.slice(0, 6),
  ];

  res.json({ suggestions });
});

// 2. Get single opportunity by slug
app.get('/api/opportunities/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const opp = db.getBySlug(slug);
  if (!opp) {
    res.status(404).json({ error: 'Opportunity not found' });
    return;
  }
  res.json(opp);
});

// 2b. Live notification check with Google Search Grounding (gemini-3.5-flash)
app.post('/api/ai/live-notification-check', async (req: Request, res: Response) => {
  try {
    const { opportunityName, conductingOrg } = req.body;
    if (!opportunityName || typeof opportunityName !== 'string') {
      res.status(400).json({ error: 'opportunityName is required' });
      return;
    }

    const currentYear = new Date().getFullYear();
    const prompt = `You are an Indian competitive examination and recruitment intelligence assistant.
Search Google for the latest official notification release date, active application window, exam dates, and eligibility/age cutoff details for "${opportunityName}" conducted by "${conductingOrg || 'official authority'}" for ${currentYear} or ${currentYear + 1}.

Provide a structured, accurate, and concise briefing in Markdown:
### 1. Notification Status
State clearly if the official notification is:
- **RELEASED & ACTIVE** (Application window open)
- **RELEASED & CLOSED** (Awaiting exam or next stage)
- **EXPECTED SOON / AWAITED** (Projected calendar date)

### 2. Key Timeline & Dates
- **Official Notification Release Date**:
- **Application Start Date**:
- **Last Date to Apply**:
- **Admit Card & Exam Date(s)**:

### 3. Eligibility & Age Cutoffs
- **Crucial Date for Age Calculation**:
- **Key Qualifications / Minimum Marks**:
- **Any Recent Age Relaxation or Rule Changes**:

### 4. Official Direct Notice & Advisory
- Name of the official website or portal where aspirants must register.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || 'No live update available at this time.';
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    const sources: Array<{ title: string; url: string }> = [];
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            url: chunk.web.uri,
          });
        }
      }
    }

    res.json({
      success: true,
      opportunityName,
      summary: text,
      sources,
      webSearchQueries: groundingMetadata?.webSearchQueries || [],
      lastChecked: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during Google Search Grounding check:', error);
    res.status(500).json({
      error: 'Failed to fetch live updates via Google Search Grounding',
      details: error?.message || 'Check network or Gemini API key',
    });
  }
});

// 3. Check Eligibility (Engine)
app.post('/api/check-eligibility', (req: Request, res: Response) => {
  const profile: UserProfile = req.body;

  if (!profile || !profile.dob || !profile.currentEducation || !profile.category) {
    res.status(400).json({ error: 'Missing mandatory profile fields (dob, currentEducation, category).' });
    return;
  }

  const allOpportunities = db.getAll(false);
  const calculatedAge = calculateAge(profile.dob);

  const results = allOpportunities.map(opp => evaluateEligibility(profile, opp));

  // Sort results: 'eligible' first, then 'potentially_eligible', then 'not_eligible'
  const priorityOrder = { eligible: 1, potentially_eligible: 2, not_eligible: 3 };
  results.sort((a, b) => priorityOrder[a.overallStatus] - priorityOrder[b.overallStatus]);

  const eligibleCount = results.filter(r => r.overallStatus === 'eligible').length;
  const potentiallyEligibleCount = results.filter(r => r.overallStatus === 'potentially_eligible').length;
  const ineligibleCount = results.filter(r => r.overallStatus === 'not_eligible').length;

  const responsePayload: EligibilityResponse = {
    calculatedAge,
    profileSummary: {
      category: profile.category,
      education: profile.currentEducation,
      dob: profile.dob,
    },
    totalChecked: results.length,
    eligibleCount,
    potentiallyEligibleCount,
    ineligibleCount,
    results,
  };

  res.json(responsePayload);
});

// 4. College Eligibility check
app.post('/api/college-eligibility', (req: Request, res: Response) => {
  const input = req.body;
  if (!input || typeof input.class12Percentage !== 'number') {
    res.status(400).json({ error: 'Valid Class 12 percentage and subject inputs are required.' });
    return;
  }
  const courses = checkCollegeEligibility(input);
  res.json({ courses });
});

// 5. Get Categories and metrics
app.get('/api/categories', (_req: Request, res: Response) => {
  const all = db.getAll(false);
  const catMap: Record<string, number> = {};
  all.forEach(o => {
    catMap[o.category] = (catMap[o.category] || 0) + 1;
  });
  res.json({ categories: catMap, totalOpportunities: all.length });
});

// 6. Subscriptions for Application Windows & Deadlines
app.post('/api/subscriptions', (req: Request, res: Response) => {
  const { email, opportunitySlugs, preferences } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Valid email address is required.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim().toLowerCase();
  if (!emailRegex.test(trimmedEmail)) {
    res.status(400).json({ error: 'Please provide a valid email format (e.g. yourname@example.com).' });
    return;
  }

  if (!Array.isArray(opportunitySlugs) || opportunitySlugs.length === 0) {
    res.status(400).json({ error: 'Please select at least one opportunity to subscribe to alerts.' });
    return;
  }

  const createdSubs = [];
  const notFound = [];

  for (const slug of opportunitySlugs) {
    if (typeof slug !== 'string') continue;
    const opp = db.getBySlug(slug.trim());
    if (!opp) {
      notFound.push(slug);
      continue;
    }
    const sub = subscriptionsDb.subscribe(trimmedEmail, opp, preferences);
    createdSubs.push(sub);
  }

  if (createdSubs.length === 0) {
    res.status(404).json({ error: 'None of the requested opportunities were found.' });
    return;
  }

  res.json({
    success: true,
    email: trimmedEmail,
    count: createdSubs.length,
    subscriptions: createdSubs,
    message: `Alerts activated! You will receive timely application window & deadline updates for ${createdSubs.length} opportunity(ies).`,
  });
});

app.get('/api/subscriptions', (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email query parameter is required.' });
    return;
  }

  const list = subscriptionsDb.getByEmail(email);
  res.json({
    success: true,
    email: email.trim().toLowerCase(),
    count: list.length,
    subscriptions: list,
  });
});

app.delete('/api/subscriptions', (req: Request, res: Response) => {
  const email = (req.body?.email || req.query?.email) as string;
  const slug = (req.body?.opportunitySlug || req.query?.opportunitySlug) as string | undefined;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required to unsubscribe.' });
    return;
  }

  const trimmedEmail = email.trim().toLowerCase();
  const removed = subscriptionsDb.unsubscribe(trimmedEmail, slug);

  res.json({
    success: true,
    email: trimmedEmail,
    opportunitySlug: slug || 'all',
    message: slug
      ? `Unsubscribed from alerts for this opportunity.`
      : `Unsubscribed from all deadline alert notifications for ${trimmedEmail}.`,
    removed,
  });
});

// ----------------------------------------------------
// ADMIN ENDPOINTS
// ----------------------------------------------------

app.post('/api/admin/login', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attemptRecord = loginAttemptTracker.get(clientIp) || { failedAttempts: 0, lockoutUntil: 0 };

  // Check lockout
  if (attemptRecord.lockoutUntil > now) {
    const remainingSecs = Math.ceil((attemptRecord.lockoutUntil - now) / 1000);
    res.status(429).json({
      error: `Too many failed login attempts. Locked out for security. Try again in ${remainingSecs} seconds.`,
      lockedOut: true,
      remainingSecs,
    });
    return;
  }

  const { password } = req.body;
  if (!password || !verifyAdminPassword(password)) {
    attemptRecord.failedAttempts += 1;
    if (attemptRecord.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      attemptRecord.lockoutUntil = now + LOCKOUT_DURATION_MS;
      attemptRecord.failedAttempts = 0;
      loginAttemptTracker.set(clientIp, attemptRecord);
      res.status(429).json({
        error: 'Too many consecutive failed attempts. Admin portal locked for 15 minutes.',
        lockedOut: true,
        remainingSecs: 900,
      });
      return;
    }
    loginAttemptTracker.set(clientIp, attemptRecord);
    res.status(401).json({
      error: 'Invalid admin passphrase.',
      remainingAttempts: MAX_FAILED_ATTEMPTS - attemptRecord.failedAttempts,
    });
    return;
  }

  // Success: Reset failed attempts
  loginAttemptTracker.delete(clientIp);
  const token = crypto.randomBytes(32).toString('hex');
  activeAdminTokens.set(token, { createdAt: now });
  res.json({ success: true, token, expiresInMinutes: TOKEN_TTL_MS / 60000 });
});

app.get('/api/admin/opportunities', requireAdmin, (_req: Request, res: Response) => {
  const list = db.getAll(true);
  res.json({ opportunities: list });
});

app.post('/api/admin/opportunities', requireAdmin, (req: Request, res: Response) => {
  const oppData = req.body;
  if (!oppData.name || !oppData.slug || !oppData.category) {
    res.status(400).json({ error: 'Name, slug, and category are required.' });
    return;
  }
  const created = db.add(oppData);
  res.status(201).json(created);
});

app.put('/api/admin/opportunities/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const updated = db.update(id, updates);
  if (!updated) {
    res.status(404).json({ error: 'Opportunity not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/admin/opportunities/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const ok = db.delete(id);
  if (!ok) {
    res.status(404).json({ error: 'Opportunity not found' });
    return;
  }
  res.json({ success: true });
});

app.post('/api/admin/reset-db', requireAdmin, (_req: Request, res: Response) => {
  db.resetDefaults();
  res.json({ success: true, message: 'Database reset to default verified opportunities.' });
});

app.get('/api/admin/subscriptions', requireAdmin, (_req: Request, res: Response) => {
  const list = subscriptionsDb.getAll();
  res.json({ total: list.length, subscriptions: list });
});

// ----------------------------------------------------
// SEO: Sitemap & Robots.txt
// ----------------------------------------------------
app.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Sitemap: ${reqBaseUrl(_req)}/sitemap.xml
`);
});

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const baseUrl = reqBaseUrl(_req);
  const opps = db.getAll(false);
  const staticUrls = [
    '',
    '/explore',
    '/check-eligibility',
    '/college-eligibility',
    '/saved',
    '/saved-opportunities',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/editorial-policy',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticUrls.forEach(pathUrl => {
    xml += `  <url>\n    <loc>${baseUrl}${pathUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${pathUrl === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  opps.forEach(opp => {
    xml += `  <url>\n    <loc>${baseUrl}/opportunities/${opp.slug}</loc>\n    <lastmod>${opp.updatedAt.slice(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  res.type('application/xml');
  res.send(xml);
});

function reqBaseUrl(req: Request): string {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}`;
}

// ----------------------------------------------------
// FRONTEND SERVER / VITE INTEGRATION
// ----------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Centralized Error Handling Middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled server error:', err);
    if (res.headersSent) {
      return;
    }
    res.status(500).json({
      error: 'An unexpected internal error occurred. Please try again later.',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
