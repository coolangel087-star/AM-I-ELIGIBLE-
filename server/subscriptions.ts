import fs from 'node:fs';
import path from 'node:path';
import {
  DeadlineSubscription,
  SubscriptionAlertPreferences,
  Opportunity,
} from '../shared/types.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');

const DEFAULT_PREFERENCES: SubscriptionAlertPreferences = {
  applicationWindowOpening: true,
  deadlineClosingReminder: true,
  admitCardAndExamDates: true,
  eligibilityRuleChanges: true,
};

export class SubscriptionsDatabase {
  private subscriptions: DeadlineSubscription[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
      try {
        const raw = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8');
        this.subscriptions = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading subscriptions.json, initializing empty:', err);
        this.subscriptions = [];
        this.save();
      }
    } else {
      this.subscriptions = [];
      this.save();
    }
  }

  private save() {
    try {
      const tempPath = `${SUBSCRIPTIONS_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.subscriptions, null, 2), 'utf-8');
      fs.renameSync(tempPath, SUBSCRIPTIONS_FILE);
    } catch (err) {
      console.error('Failed to write subscriptions file:', err);
    }
  }

  public subscribe(
    email: string,
    opp: Opportunity,
    customPreferences?: Partial<SubscriptionAlertPreferences>
  ): DeadlineSubscription {
    const normalizedEmail = email.trim().toLowerCase();
    const existingIndex = this.subscriptions.findIndex(
      (s) => s.email.toLowerCase() === normalizedEmail && s.opportunitySlug === opp.slug
    );

    const preferences: SubscriptionAlertPreferences = {
      ...DEFAULT_PREFERENCES,
      ...(customPreferences || {}),
    };

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // Update existing subscription
      this.subscriptions[existingIndex] = {
        ...this.subscriptions[existingIndex],
        preferences,
        active: true,
        opportunityName: opp.name,
        opportunityShortName: opp.shortName,
        category: opp.category,
      };
      this.save();
      return this.subscriptions[existingIndex];
    }

    // New subscription
    const newSub: DeadlineSubscription = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      email: normalizedEmail,
      opportunitySlug: opp.slug,
      opportunityName: opp.name,
      opportunityShortName: opp.shortName,
      category: opp.category,
      preferences,
      subscribedAt: now,
      active: true,
    };

    this.subscriptions.push(newSub);
    this.save();
    return newSub;
  }

  public getByEmail(email: string): DeadlineSubscription[] {
    const normalizedEmail = email.trim().toLowerCase();
    return this.subscriptions.filter(
      (s) => s.email.toLowerCase() === normalizedEmail && s.active
    );
  }

  public getBySlug(slug: string): DeadlineSubscription[] {
    return this.subscriptions.filter(
      (s) => s.opportunitySlug === slug && s.active
    );
  }

  public getAll(): DeadlineSubscription[] {
    return [...this.subscriptions];
  }

  public unsubscribe(email: string, slug?: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    let changed = false;

    if (slug) {
      const idx = this.subscriptions.findIndex(
        (s) => s.email.toLowerCase() === normalizedEmail && s.opportunitySlug === slug
      );
      if (idx >= 0) {
        this.subscriptions.splice(idx, 1);
        changed = true;
      }
    } else {
      const beforeLen = this.subscriptions.length;
      this.subscriptions = this.subscriptions.filter(
        (s) => s.email.toLowerCase() !== normalizedEmail
      );
      changed = this.subscriptions.length !== beforeLen;
    }

    if (changed) {
      this.save();
    }
    return changed;
  }

  public count(): number {
    return this.subscriptions.filter((s) => s.active).length;
  }
}

export const subscriptionsDb = new SubscriptionsDatabase();
