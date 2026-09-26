import React, { useState, useEffect } from 'react';
import { Opportunity, SubscriptionAlertPreferences } from '../types.ts';
import { useSubscriptions } from '../context/SubscriptionContext.tsx';
import {
  Bell,
  Mail,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Eye,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetOpportunities: Opportunity[];
  initialSelectedSlugs?: string[];
  onSuccess?: () => void;
}

export const SubscribeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetOpportunities,
  initialSelectedSlugs,
  onSuccess,
}) => {
  const { userEmail, subscribe } = useSubscriptions();

  const [email, setEmail] = useState(userEmail || '');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<SubscriptionAlertPreferences>({
    applicationWindowOpening: true,
    deadlineClosingReminder: true,
    admitCardAndExamDates: true,
    eligibilityRuleChanges: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    count: number;
    email: string;
    message: string;
  } | null>(null);

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessResult(null);
      if (userEmail) {
        setEmail(userEmail);
      }
      if (initialSelectedSlugs && initialSelectedSlugs.length > 0) {
        setSelectedSlugs(initialSelectedSlugs);
      } else {
        setSelectedSlugs(targetOpportunities.map((o) => o.slug));
      }
    }
  }, [isOpen, userEmail, initialSelectedSlugs, targetOpportunities]);

  if (!isOpen) return null;

  const handleToggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSelectAll = () => {
    if (selectedSlugs.length === targetOpportunities.length) {
      setSelectedSlugs([]);
    } else {
      setSelectedSlugs(targetOpportunities.map((o) => o.slug));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please provide a valid email address (e.g. name@example.com).');
      return;
    }

    if (selectedSlugs.length === 0) {
      setError('Please select at least one opportunity to subscribe to.');
      return;
    }

    setLoading(true);
    const result = await subscribe(trimmed, selectedSlugs, preferences);
    setLoading(false);

    if (result.success) {
      setSuccessResult({
        count: result.count || selectedSlugs.length,
        email: trimmed,
        message: result.message,
      });
      if (onSuccess) onSuccess();
    } else {
      setError(result.message);
    }
  };

  // Target preview opportunity (first selected or first target)
  const previewOpp =
    targetOpportunities.find((o) => selectedSlugs.includes(o.slug)) ||
    targetOpportunities[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Application Alerts</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Application Window &amp; Deadline Updates
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/90 mt-1 max-w-md">
            Never miss registration start dates or final deadline closures for your saved opportunities.
          </p>
        </div>

        {/* Modal Content */}
        {successResult ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">
                Alerts Activated!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                We have registered <strong className="text-slate-900">{successResult.email}</strong> to receive application window reminders and deadline alerts for{' '}
                <strong className="text-indigo-600 font-bold">{successResult.count} opportunity(ies)</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2 text-left">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>What to expect:</span>
              </div>
              <ul className="space-y-1 text-slate-600 pl-6 list-disc">
                <li>Alert when official notification brochure is released by conducting org.</li>
                <li>Reminder notification 3 days prior to registration portal closure.</li>
                <li>Verified links directly to official government portals. No spam or ads.</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Got It, Thank You
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Used strictly for official application window notices and critical deadline reminders.
              </p>
            </div>

            {/* Opportunity Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Opportunities ({selectedSlugs.length} of {targetOpportunities.length})
                </label>
                {targetOpportunities.length > 1 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    {selectedSlugs.length === targetOpportunities.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                )}
              </div>

              <div className="max-h-44 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-xl p-2.5 bg-slate-50/50">
                {targetOpportunities.length === 0 ? (
                  <p className="text-xs text-slate-500 p-2 text-center">
                    No opportunities selected.
                  </p>
                ) : (
                  targetOpportunities.map((opp) => {
                    const isChecked = selectedSlugs.includes(opp.slug);
                    return (
                      <label
                        key={opp.slug}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white border-indigo-300 shadow-2xs'
                            : 'bg-slate-100/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSlug(opp.slug)}
                          className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded">
                              {opp.category}
                            </span>
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {opp.shortName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {opp.currentCycle.cycleName} &bull; Window: {opp.currentCycle.applicationPeriod}
                          </p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Notification Types
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/60">
                  <input
                    type="checkbox"
                    checked={preferences.applicationWindowOpening}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        applicationWindowOpening: e.target.checked,
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Opening Dates</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/60">
                  <input
                    type="checkbox"
                    checked={preferences.deadlineClosingReminder}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        deadlineClosingReminder: e.target.checked,
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">3-Day Closing Reminder</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/60">
                  <input
                    type="checkbox"
                    checked={preferences.admitCardAndExamDates}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        admitCardAndExamDates: e.target.checked,
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Admit Card / Exam Schedule</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/60">
                  <input
                    type="checkbox"
                    checked={preferences.eligibilityRuleChanges}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        eligibilityRuleChanges: e.target.checked,
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Age Cutoff &amp; Rule Updates</span>
                </label>
              </div>
            </div>

            {/* Email Sample Preview Accordion */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-700 font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preview Sample Alert Email</span>
                </div>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </span>
              </button>

              {showPreview && previewOpp && (
                <div className="p-4 bg-slate-900 text-slate-200 space-y-3 font-sans text-xs">
                  <div className="border-b border-slate-800 pb-2 space-y-1 text-[11px] text-slate-400">
                    <p>
                      <strong>From:</strong> alerts@amieligible.in (Official Notification Watch)
                    </p>
                    <p>
                      <strong>To:</strong> {email || 'aspirant@example.com'}
                    </p>
                    <p className="text-amber-300 font-bold">
                      <strong>Subject:</strong> [Deadline Alert] {previewOpp.shortName} application window closes in 3 days!
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>Registration Window Closing Soon</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Dear Aspirant, the online application submission for{' '}
                      <strong className="text-white">{previewOpp.name}</strong> ({previewOpp.currentCycle.cycleName}) is scheduled to close on{' '}
                      <span className="text-amber-300 font-semibold">{previewOpp.currentCycle.applicationPeriod}</span>.
                    </p>
                    <div className="pt-1">
                      <span className="inline-block px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                        Apply at {previewOpp.currentCycle.officialSourceOrg} Portal &rarr;
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    *Verified against official notification gazette. You can manage or unsubscribe from these alerts at any time.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedSlugs.length === 0}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Activating Alerts...</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Activate Email Alerts ({selectedSlugs.length})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
