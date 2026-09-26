import React from 'react';
import { EligibilityStatus } from '../types.ts';
import { STATUS_STYLE_CONFIG } from '../utils/statusStyles.ts';
import { HelpCircle, Filter } from 'lucide-react';

interface Props {
  counts: Record<EligibilityStatus, number> & {
    total: number;
  };
  activeFilter: 'all' | EligibilityStatus;
  onSelectFilter: (status: 'all' | EligibilityStatus) => void;
}

export const StatusLegend: React.FC<Props> = ({ counts, activeFilter, onSelectFilter }) => {
  const legendStatuses: EligibilityStatus[] = ['eligible', 'potentially_eligible', 'not_eligible'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Legend Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-2">
              <span>Status Legend &amp; Color Guide</span>
              <span className="text-[11px] font-normal text-slate-500 hidden sm:inline">
                &mdash; Click any card to filter results
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Clear visual badges to evaluate your opportunities at a glance
            </p>
          </div>
        </div>

        {/* Quick Reset Button if filtered */}
        {activeFilter !== 'all' && (
          <button
            onClick={() => onSelectFilter('all')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Filter className="w-3 h-3" />
            <span>Show All ({counts.total})</span>
          </button>
        )}
      </div>

      {/* 3 Color-Coded Legend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {legendStatuses.map((st) => {
          const config = STATUS_STYLE_CONFIG[st];
          const Icon = config.icon;
          const count = counts[st];
          const isSelected = activeFilter === st;

          return (
            <button
              key={st}
              type="button"
              onClick={() => onSelectFilter(isSelected ? 'all' : st)}
              className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 relative ${
                isSelected
                  ? `${config.borderClass} ${config.accentBgClass} ring-2 ring-indigo-500/20 shadow-xs`
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
              }`}
            >
              {/* Header: Visual Badge & Count */}
              <div className="flex items-center justify-between gap-2 w-full">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${config.badgeClass}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>
                    {config.colorName}: {config.label}
                  </span>
                </span>

                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    isSelected
                      ? `${config.pillBgClass} text-white`
                      : 'bg-slate-100 text-slate-700'
                  }`}
                  title={`${count} opportunities`}
                >
                  {count}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {config.description}
              </p>

              {/* Status Action Hint */}
              <div className="pt-1 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                <span className={`font-semibold ${config.textColorClass}`}>
                  {isSelected ? '✓ Filter Active' : 'Click to filter'}
                </span>
                <span className="text-slate-400 font-medium">
                  {Math.round((count / (counts.total || 1)) * 100)}% of total
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
