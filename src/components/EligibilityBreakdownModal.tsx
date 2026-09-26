import React from 'react';
import { EligibilityResult } from '../types.ts';
import { STATUS_STYLE_CONFIG } from '../utils/statusStyles.ts';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Calendar,
  Building,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface Props {
  result: EligibilityResult;
  onClose: () => void;
  onViewOpportunity: (slug: string) => void;
}

export const EligibilityBreakdownModal: React.FC<Props> = ({
  result,
  onClose,
  onViewOpportunity,
}) => {
  const { opportunity, overallStatus, statusHeadline, criteriaBreakdown, whyExplanation, attemptsInfo } =
    result;

  const statusConfig = STATUS_STYLE_CONFIG[overallStatus];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                {opportunity.category}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                {opportunity.conductingOrg}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {opportunity.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Alert Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3.5 ${statusConfig.badgeClass}`}
          >
            <StatusIcon className={`w-5 h-5 mt-0.5 shrink-0 ${statusConfig.iconColorClass}`} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-current">
                  {statusConfig.colorName}: {statusConfig.label}
                </span>
              </div>
              <p className="font-bold text-sm sm:text-base">{statusHeadline}</p>
              <p className="text-xs sm:text-sm leading-relaxed">{whyExplanation}</p>
            </div>
          </div>

          {/* Criteria Evaluation Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>Detailed Evaluation by Rule</span>
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              {criteriaBreakdown.map((crit) => {
                let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                let Icon = Info;
                let iconColor = 'text-slate-500';

                if (crit.status === 'pass') {
                  badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  Icon = CheckCircle2;
                  iconColor = 'text-emerald-600';
                } else if (crit.status === 'fail') {
                  badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                  Icon = XCircle;
                  iconColor = 'text-rose-600';
                } else if (crit.status === 'needs_verification') {
                  badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                  Icon = AlertTriangle;
                  iconColor = 'text-amber-600';
                }

                return (
                  <div key={crit.id} className="p-3.5 bg-white space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                        <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
                        {crit.criterion}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}
                      >
                        {crit.status === 'pass'
                          ? 'Passed'
                          : crit.status === 'fail'
                          ? 'Criteria Not Met'
                          : 'Needs Verification'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      {crit.message}
                    </p>
                    {(crit.userValue || crit.requiredValue) && (
                      <div className="pl-6 grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                        <div>
                          <span className="text-slate-400">Your profile: </span>
                          <span className="font-medium text-slate-700">{crit.userValue}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Requirement: </span>
                          <span className="font-medium text-slate-700">{crit.requiredValue}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attempts vs Opportunities Section */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Official Attempts &amp; Potential Opportunities</span>
            </h4>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p className="font-medium text-slate-900">{attemptsInfo.attemptRuleSummary}</p>
              {attemptsInfo.estimatedUpcomingCycles !== null && (
                <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg text-indigo-900 font-medium">
                  {attemptsInfo.cycleEstimateNote}
                </div>
              )}
              <p className="text-[11px] text-slate-400 italic">
                *Note: Future cycles and exact age cutoff rules are subject to the notification released by the conducting authority.
              </p>
            </div>
          </div>

          {/* Verified Official Source & Cycle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-200">
            <div>
              <span className="text-slate-400">Applicable Cycle: </span>
              <span className="font-semibold text-slate-800">
                {opportunity.currentCycle.cycleName}
              </span>
              <span className="text-slate-400 ml-2">
                (Verified: {opportunity.currentCycle.lastVerifiedDate})
              </span>
            </div>
            <a
              href={opportunity.currentCycle.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>{opportunity.currentCycle.officialSourceOrg}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onViewOpportunity(opportunity.slug);
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
          >
            View Full Opportunity Page
          </button>
        </div>
      </div>
    </div>
  );
};
