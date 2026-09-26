import React, { useState } from 'react';
import { EligibilityResult, Opportunity } from '../types.ts';
import { useSavedOpportunities } from '../context/SavedOpportunitiesContext.tsx';
import { STATUS_STYLE_CONFIG } from '../utils/statusStyles.ts';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Building,
  Calendar,
  Layers,
  GraduationCap,
  Bookmark,
} from 'lucide-react';

interface Props {
  result?: EligibilityResult;
  opportunity?: Opportunity;
  onSelect: (slug: string) => void;
  onOpenBreakdown?: (result: EligibilityResult) => void;
}

export const OpportunityCard: React.FC<Props> = ({
  result,
  opportunity: propOpp,
  onSelect,
  onOpenBreakdown,
}) => {
  const opp = result ? result.opportunity : propOpp;
  if (!opp) return null;

  const [expandedWhy, setExpandedWhy] = useState(false);
  const { isSaved, toggleSave } = useSavedOpportunities();
  const saved = isSaved(opp.slug);

  const status = result?.overallStatus;
  const currentStatusConfig = status ? STATUS_STYLE_CONFIG[status] : null;
  const StatusIcon = currentStatusConfig?.icon;

  // Find sub-criterion results if evaluated
  const ageCrit = result?.criteriaBreakdown.find((c) => c.id === 'age');
  const eduCrit = result?.criteriaBreakdown.find((c) => c.id === 'education');
  const marksCrit = result?.criteriaBreakdown.find((c) => c.id.startsWith('marks'));
  const subCrit = result?.criteriaBreakdown.find((c) => c.id === 'subjects');

  return (
    <div
      className={`rounded-2xl border ${
        currentStatusConfig
          ? `${currentStatusConfig.borderClass} ${currentStatusConfig.borderLeftClass} ${currentStatusConfig.cardBgClass}`
          : 'border-slate-200 bg-white'
      } shadow-xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              {opp.category}
            </span>
            {currentStatusConfig && StatusIcon && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${currentStatusConfig.badgeClass}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span>
                  <strong className="font-bold">{currentStatusConfig.colorName}:</strong> {currentStatusConfig.label}
                </span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(opp);
            }}
            title={saved ? 'Saved in browser local storage (Click to remove)' : 'Save to browser local storage'}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark opportunity'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              saved
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300'
                : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-600' : ''}`} />
          </button>
        </div>

        {/* Title & Conducting Body */}
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-slate-900 leading-snug group-hover:text-indigo-600">
            {opp.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{opp.conductingOrg}</span>
          </p>
        </div>

        {/* Short Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
          {opp.summary}
        </p>

        {/* Criteria status pills if evaluated */}
        {result && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3.5 my-3 border-y border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Age:</span>
              <span
                className={`font-semibold text-[11px] ${
                  ageCrit?.status === 'pass'
                    ? 'text-emerald-700'
                    : ageCrit?.status === 'fail'
                    ? 'text-rose-700'
                    : 'text-amber-700'
                }`}
              >
                {ageCrit?.status === 'pass' ? '✓ Met' : ageCrit?.status === 'fail' ? '✕ Exceeded' : 'Condition'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Edu:</span>
              <span
                className={`font-semibold text-[11px] ${
                  eduCrit?.status === 'pass'
                    ? 'text-emerald-700'
                    : eduCrit?.status === 'fail'
                    ? 'text-rose-700'
                    : 'text-amber-700'
                }`}
              >
                {eduCrit?.status === 'pass' ? '✓ Met' : eduCrit?.status === 'fail' ? '✕ Short' : 'Appearing'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Marks:</span>
              <span
                className={`font-semibold text-[11px] ${
                  !marksCrit || marksCrit.status === 'pass'
                    ? 'text-emerald-700'
                    : marksCrit.status === 'fail'
                    ? 'text-rose-700'
                    : 'text-amber-700'
                }`}
              >
                {!marksCrit
                  ? '✓ Any'
                  : marksCrit.status === 'pass'
                  ? '✓ Met'
                  : marksCrit.status === 'fail'
                  ? '✕ Below'
                  : 'Check'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Subjects:</span>
              <span
                className={`font-semibold text-[11px] ${
                  !subCrit || subCrit.status === 'pass'
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }`}
              >
                {!subCrit || subCrit.status === 'pass' ? '✓ OK' : '✕ Missing'}
              </span>
            </div>
          </div>
        )}

        {/* Attempts / Opportunities Section */}
        <div className="bg-slate-50 rounded-xl p-3 my-2 border border-slate-100 text-xs space-y-1">
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-500 font-medium">Attempts / Frequency:</span>
            <span className="font-semibold text-slate-800 text-right">
              {opp.attemptsRule.hasFixedAttemptLimit
                ? `Official Limit: ${opp.attemptsRule.maxAttemptsGeneral ?? 'Check Category'} attempts`
                : 'No fixed attempt limit'}
            </span>
          </div>
          {result?.attemptsInfo.estimatedUpcomingCycles !== null && result?.attemptsInfo.estimatedUpcomingCycles !== undefined && (
            <div className="text-[11px] text-indigo-700 font-medium flex items-center justify-between">
              <span>Potential Upcoming Cycles:</span>
              <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                ~{result.attemptsInfo.estimatedUpcomingCycles} cycles
              </span>
            </div>
          )}
          {opp.currentCycle.applicationPeriod && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Cycle: {opp.currentCycle.cycleName}
              </span>
              <span className="text-slate-600 font-medium">{opp.currentCycle.applicationPeriod}</span>
            </div>
          )}
        </div>

        {/* Inline "Why this result?" trigger */}
        {result && (
          <div className="my-2">
            <button
              onClick={() => setExpandedWhy(!expandedWhy)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 focus:outline-none"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{expandedWhy ? 'Hide why this result' : 'Why this result?'}</span>
            </button>
            {expandedWhy && (
              <div className="mt-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs text-slate-700 leading-relaxed">
                <p>{result.whyExplanation}</p>
                {onOpenBreakdown && (
                  <button
                    onClick={() => onOpenBreakdown(result)}
                    className="mt-1.5 text-xs text-indigo-700 underline font-semibold hover:text-indigo-900 block"
                  >
                    View rule-by-rule breakdown &rarr;
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <a
          href={opp.currentCycle.officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 transition-colors"
          title={`Official Source: ${opp.currentCycle.officialSourceOrg}`}
        >
          <span>Official Source</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        <div className="flex items-center gap-1.5">
          {result && onOpenBreakdown && (
            <button
              onClick={() => onOpenBreakdown(result)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
            >
              Rules
            </button>
          )}
          <button
            onClick={() => onSelect(opp.slug)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors inline-flex items-center gap-1 shadow-xs"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
