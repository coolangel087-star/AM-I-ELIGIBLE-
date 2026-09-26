import {
  UserProfile,
  Opportunity,
  EligibilityResponse,
  CollegeCourseEligibilityInput,
  CollegeCourseOption,
} from '../types.ts';

const BASE_URL = '';

export async function getOpportunities(params?: {
  search?: string;
  category?: string;
  educationLevel?: string;
}): Promise<{ total: number; opportunities: Opportunity[] }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);
  if (params?.educationLevel) query.set('educationLevel', params.educationLevel);

  const res = await fetch(`${BASE_URL}/api/opportunities?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch opportunities');
  return res.json();
}

export interface SearchSuggestionItem {
  type: 'exam' | 'category';
  title: string;
  subtitle: string;
  category: string;
  slug?: string;
  matchText: string;
}

export async function getSearchSuggestions(queryText: string): Promise<SearchSuggestionItem[]> {
  if (!queryText.trim()) return [];
  const res = await fetch(`${BASE_URL}/api/opportunities/suggestions?q=${encodeURIComponent(queryText.trim())}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.suggestions || [];
}

export async function getOpportunityBySlug(slug: string): Promise<Opportunity> {
  const res = await fetch(`${BASE_URL}/api/opportunities/${slug}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Opportunity not found');
    throw new Error('Failed to load opportunity details');
  }
  return res.json();
}

export interface LiveNotificationUpdate {
  success: boolean;
  opportunityName: string;
  summary: string;
  sources: Array<{ title: string; url: string }>;
  webSearchQueries?: string[];
  lastChecked: string;
}

export async function fetchLiveNotificationCheck(
  opportunityName: string,
  conductingOrg?: string
): Promise<LiveNotificationUpdate> {
  const res = await fetch(`${BASE_URL}/api/ai/live-notification-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ opportunityName, conductingOrg }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch live updates from Google Search Grounding');
  }
  return res.json();
}

export async function postCheckEligibility(profile: UserProfile): Promise<EligibilityResponse> {
  const res = await fetch(`${BASE_URL}/api/check-eligibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to evaluate eligibility');
  }
  return res.json();
}

export async function postCollegeEligibility(
  input: CollegeCourseEligibilityInput
): Promise<{ courses: CollegeCourseOption[] }> {
  const res = await fetch(`${BASE_URL}/api/college-eligibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to check college course eligibility');
  }
  return res.json();
}

export async function getCategories(): Promise<{
  categories: Record<string, number>;
  totalOpportunities: number;
}> {
  const res = await fetch(`${BASE_URL}/api/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

// Admin APIs
export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Invalid credentials');
  }
  const data = await res.json();
  return data.token;
}

export async function adminGetOpportunities(token: string): Promise<Opportunity[]> {
  const res = await fetch(`${BASE_URL}/api/admin/opportunities`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Unauthorized or failed to fetch admin opportunities');
  const data = await res.json();
  return data.opportunities;
}

export async function adminCreateOpportunity(token: string, opp: Partial<Opportunity>): Promise<Opportunity> {
  const res = await fetch(`${BASE_URL}/api/admin/opportunities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(opp),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create opportunity');
  }
  return res.json();
}

export async function adminUpdateOpportunity(
  token: string,
  id: string,
  updates: Partial<Opportunity>
): Promise<Opportunity> {
  const res = await fetch(`${BASE_URL}/api/admin/opportunities/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update opportunity');
  }
  return res.json();
}

export async function adminDeleteOpportunity(token: string, id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/admin/opportunities/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete opportunity');
  return true;
}

export async function adminResetDatabase(token: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/admin/reset-db`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to reset database');
  return true;
}
