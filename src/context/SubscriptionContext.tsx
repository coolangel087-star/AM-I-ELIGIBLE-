import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  DeadlineSubscription,
  SubscriptionAlertPreferences,
  SubscriptionCreateRequest,
} from '../types.ts';

interface SubscriptionContextType {
  userEmail: string;
  setUserEmail: (email: string) => void;
  subscriptions: DeadlineSubscription[];
  subscribedSlugs: Set<string>;
  isSubscribed: (slug: string) => boolean;
  loading: boolean;
  subscribe: (
    email: string,
    opportunitySlugs: string[],
    preferences?: Partial<SubscriptionAlertPreferences>
  ) => Promise<{ success: boolean; message: string; count?: number }>;
  unsubscribe: (
    email: string,
    slug?: string
  ) => Promise<{ success: boolean; message: string }>;
  refreshSubscriptions: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const LOCAL_STORAGE_EMAIL_KEY = 'am_i_eligible_subscribed_email';
const LOCAL_STORAGE_SUBS_KEY = 'am_i_eligible_local_subscriptions_v1';

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userEmail, setUserEmailState] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_EMAIL_KEY) || '';
    } catch {
      return '';
    }
  });

  const [subscriptions, setSubscriptions] = useState<DeadlineSubscription[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SUBS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  const setUserEmail = useCallback((email: string) => {
    const trimmed = email.trim().toLowerCase();
    setUserEmailState(trimmed);
    try {
      localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, trimmed);
    } catch (e) {
      console.warn('Failed to save email to localStorage:', e);
    }
  }, []);

  const refreshSubscriptions = useCallback(async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.subscriptions) {
          setSubscriptions(data.subscriptions);
          try {
            localStorage.setItem(LOCAL_STORAGE_SUBS_KEY, JSON.stringify(data.subscriptions));
          } catch (e) {
            console.warn('Failed to save subscriptions cache:', e);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      refreshSubscriptions();
    }
  }, [userEmail, refreshSubscriptions]);

  const subscribedSlugs = useMemo(() => {
    return new Set(subscriptions.map((s) => s.opportunitySlug));
  }, [subscriptions]);

  const isSubscribed = useCallback(
    (slug: string) => {
      return subscribedSlugs.has(slug);
    },
    [subscribedSlugs]
  );

  const subscribe = useCallback(
    async (
      email: string,
      opportunitySlugs: string[],
      preferences?: Partial<SubscriptionAlertPreferences>
    ) => {
      const trimmedEmail = email.trim().toLowerCase();
      setUserEmail(trimmedEmail);

      try {
        const payload: SubscriptionCreateRequest = {
          email: trimmedEmail,
          opportunitySlugs,
          preferences,
        };

        const res = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to activate deadline subscriptions.');
        }

        // Merge updated subscriptions into local state
        setSubscriptions((prev) => {
          const map = new Map<string, DeadlineSubscription>();
          prev.forEach((s) => map.set(s.opportunitySlug, s));
          if (data.subscriptions && Array.isArray(data.subscriptions)) {
            data.subscriptions.forEach((s: DeadlineSubscription) => map.set(s.opportunitySlug, s));
          }
          const updated = Array.from(map.values());
          try {
            localStorage.setItem(LOCAL_STORAGE_SUBS_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        return {
          success: true,
          message: data.message || 'Subscriptions successfully activated!',
          count: data.count,
        };
      } catch (err: any) {
        return {
          success: false,
          message: err.message || 'Unable to subscribe right now. Please try again.',
        };
      }
    },
    [setUserEmail]
  );

  const unsubscribe = useCallback(
    async (email: string, slug?: string) => {
      const trimmedEmail = email.trim().toLowerCase();
      try {
        const res = await fetch('/api/subscriptions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, opportunitySlug: slug }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to unsubscribe.');
        }

        setSubscriptions((prev) => {
          let updated: DeadlineSubscription[];
          if (slug) {
            updated = prev.filter((s) => s.opportunitySlug !== slug);
          } else {
            updated = [];
          }
          try {
            localStorage.setItem(LOCAL_STORAGE_SUBS_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        return {
          success: true,
          message: data.message || 'Successfully unsubscribed from alerts.',
        };
      } catch (err: any) {
        return {
          success: false,
          message: err.message || 'Could not process unsubscribe request.',
        };
      }
    },
    []
  );

  return (
    <SubscriptionContext.Provider
      value={{
        userEmail,
        setUserEmail,
        subscriptions,
        subscribedSlugs,
        isSubscribed,
        loading,
        subscribe,
        unsubscribe,
        refreshSubscriptions,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};
