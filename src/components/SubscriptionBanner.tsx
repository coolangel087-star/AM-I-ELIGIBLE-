import React, { useState } from 'react';
import { Opportunity } from '../types.ts';
import { useSubscriptions } from '../context/SubscriptionContext.tsx';
import {
  Bell,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Clock,
  Sparkles,
  Settings,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface Props {
  savedOpportunities: Opportunity[];
  onOpenSubscribeModal: (slugs?: string[]) => void;
}

export const SubscriptionBanner: React.FC<Props> = ({
  savedOpportunities,
  onOpenSubscribeModal,
}) => {
  const { userEmail, subscriptions, subscribedSlugs, unsubscribe } = useSubscriptions();
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [showManage, setShowManage] = useState(false);

  const activeSavedSubs = savedOpportunities.filter((o) => subscribedSlugs.has(o.slug));
  const hasSubscribedAny = subscriptions.length > 0;

  const handleUnsubscribeAll = async () => {
    if (!userEmail) return;
    if (window.confirm(`Unsubscribe ${userEmail} from all deadline notifications?`)) {
      setUnsubscribing(true);
      await unsubscribe(userEmail);
      setUnsubscribing(false);
    }
  };

  const handleUnsubscribeSingle = async (slug: string) => {
    if (!userEmail) return;
    setUnsubscribing(true);
    await unsubscribe(userEmail, slug);
    setUnsubscribing(false);
  };

  if (savedOpportunities.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-indigo-800/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Application Window &amp; Deadline Email Alerts</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Never Miss an Application Window</span>
              {hasSubscribedAny && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
                  Active Alerts ({subscriptions.length})
                </span>
              )}
            </h3>

            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              {hasSubscribedAny ? (
                <>
                  Active alerts sent to <strong className="text-white">{userEmail}</strong> when official application portals open and 3 days before final closing dates.
                </>
              ) : (
                <>
                  Get verified alerts sent directly to your inbox when official notifications open and 3 days prior to registration closing dates for your saved opportunities.
                </>
              )}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
            {hasSubscribedAny ? (
              <>
                <button
                  onClick={() => setShowManage(!showManage)}
                  className="px-4 py-2.5 bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-500/30 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{showManage ? 'Hide Alert Settings' : 'Manage Subscriptions'}</span>
                </button>
                {activeSavedSubs.length < savedOpportunities.length && (
                  <button
                    onClick={() =>
                      onOpenSubscribeModal(
                        savedOpportunities.map((o) => o.slug)
                      )
                    }
                    className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-300" />
                    <span>Subscribe All Saved ({savedOpportunities.length})</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() =>
                  onOpenSubscribeModal(savedOpportunities.map((o) => o.slug))
                }
                className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4 text-amber-300" />
                <span>Subscribe to Alerts for Saved ({savedOpportunities.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded Subscription Manager Section */}
        {hasSubscribedAny && showManage && (
          <div className="pt-4 border-t border-indigo-800/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-indigo-200">
              <span className="font-semibold">
                Your Subscribed Opportunities ({subscriptions.length})
              </span>
              <button
                onClick={handleUnsubscribeAll}
                disabled={unsubscribing}
                className="text-rose-400 hover:text-rose-300 text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Unsubscribe All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-start justify-between gap-2 text-slate-200"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-bold text-white text-xs truncate">
                      {sub.opportunityShortName || sub.opportunityName}
                    </p>
                    <span className="text-[10px] text-indigo-300 px-1.5 py-0.2 bg-indigo-500/20 rounded">
                      {sub.category}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Subscribed: {new Date(sub.subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnsubscribeSingle(sub.opportunitySlug)}
                    disabled={unsubscribing}
                    title="Remove alert for this opportunity"
                    className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
