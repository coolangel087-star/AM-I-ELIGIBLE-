import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { useEligibility } from '../context/EligibilityContext.tsx';
import { EligibilityResult } from '../types.ts';
import { OpportunityCard } from '../components/OpportunityCard.tsx';
import { EligibilityBreakdownModal } from '../components/EligibilityBreakdownModal.tsx';
import { StatusLegend } from '../components/StatusLegend.tsx';
import { STATUS_STYLE_CONFIG } from '../utils/statusStyles.ts';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  SlidersHorizontal,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Info,
  GraduationCap,
  Layers,
  Filter,
} from 'lucide-react';

export const ResultsDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const { results, profile } = useEligibility();

  const [activeTab, setActiveTab] = useState<'all' | 'eligible' | 'potentially_eligible' | 'not_eligible'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBreakdown, setSelectedBreakdown] = useState<EligibilityResult | null>(null);

  if (!results) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Active Evaluation</h2>
        <p className="text-sm text-slate-600">
          Please complete the profile evaluator to view your personalized eligibility dashboard.
        </p>
        <button
          onClick={() => navigate('/check-eligibility')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Check My Eligibility
        </button>
      </div>
    );
  }

  // Filter results
  let filtered = results.results;
  if (activeTab !== 'all') {
    filtered = filtered.filter((r) => r.overallStatus === activeTab);
  }
  if (selectedCategory !== 'All') {
    filtered = filtered.filter((r) => r.opportunity.category === selectedCategory);
  }

  // Unique categories in results
  const categoriesInResults = Array.from(new Set(results.results.map((r) => r.opportunity.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner / Summary */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Personalized Results
            </span>
            <button
              onClick={() => navigate('/check-eligibility')}
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify Details</span>
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              You are eligible or potentially eligible for {results.eligibleCount + results.potentiallyEligibleCount} opportunities
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              Evaluated for: <span className="font-semibold text-white">{results.calculatedAge} Years Old</span> &bull;{' '}
              <span className="font-semibold text-white">{profile.category} Category</span> &bull;{' '}
              <span className="font-semibold text-white">{profile.currentEducation.toUpperCase()}</span>
            </p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
            <button
              onClick={() => setActiveTab('eligible')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTab === 'eligible'
                  ? 'bg-emerald-500/20 border-emerald-400'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Eligible</span>
              </div>
              <p className="text-2xl font-black mt-0.5">{results.eligibleCount}</p>
            </button>

            <button
              onClick={() => setActiveTab('potentially_eligible')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTab === 'potentially_eligible'
                  ? 'bg-amber-500/20 border-amber-400'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Verify Condition</span>
              </div>
              <p className="text-2xl font-black mt-0.5">{results.potentiallyEligibleCount}</p>
            </button>

            <button
              onClick={() => setActiveTab('not_eligible')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTab === 'not_eligible'
                  ? 'bg-rose-500/20 border-rose-400'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                <XCircle className="w-4 h-4" />
                <span>Not Eligible</span>
              </div>
              <p className="text-2xl font-black mt-0.5">{results.ineligibleCount}</p>
            </button>
          </div>
        </div>
      </div>

      {/* Color-Coded Status Legend & Quick Filter Guide */}
      <StatusLegend
        counts={{
          eligible: results.eligibleCount,
          potentially_eligible: results.potentiallyEligibleCount,
          not_eligible: results.ineligibleCount,
          total: results.totalChecked,
        }}
        activeFilter={activeTab}
        onSelectFilter={(st) => setActiveTab(st)}
      />

      {/* Filter and Tab Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Status Tabs with Consistent Color Badging */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
          {[
            {
              id: 'all',
              label: 'All Checked',
              count: results.totalChecked,
              activeCls: 'bg-indigo-600 text-white shadow-xs',
              inactiveCls: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              icon: null,
            },
            {
              id: 'eligible',
              label: 'Green: Eligible',
              count: results.eligibleCount,
              activeCls: 'bg-emerald-600 text-white shadow-xs',
              inactiveCls: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200',
              icon: CheckCircle2,
            },
            {
              id: 'potentially_eligible',
              label: 'Yellow: Potentially',
              count: results.potentiallyEligibleCount,
              activeCls: 'bg-amber-600 text-white shadow-xs',
              inactiveCls: 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200',
              icon: AlertTriangle,
            },
            {
              id: 'not_eligible',
              label: 'Red: Ineligible',
              count: results.ineligibleCount,
              activeCls: 'bg-rose-600 text-white shadow-xs',
              inactiveCls: 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200',
              icon: XCircle,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive ? tab.activeCls : tab.inactiveCls
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-black/5 text-inherit'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Categories ({results.totalChecked})</option>
            {categoriesInResults.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2 flex-wrap">
          <span>Showing:</span>
          {activeTab === 'all' ? (
            <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              All Opportunities ({filtered.length})
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full border ${
                STATUS_STYLE_CONFIG[activeTab].badgeClass
              }`}
            >
              {activeTab === 'eligible' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {activeTab === 'potentially_eligible' && <AlertTriangle className="w-3.5 h-3.5" />}
              {activeTab === 'not_eligible' && <XCircle className="w-3.5 h-3.5" />}
              <span>
                {STATUS_STYLE_CONFIG[activeTab].colorName}: {STATUS_STYLE_CONFIG[activeTab].label} ({filtered.length})
              </span>
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-medium">
              Category: {selectedCategory}
            </span>
          )}
        </div>

        {(activeTab !== 'all' || selectedCategory !== 'All') && (
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedCategory('All');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <p className="text-slate-600 text-sm">No opportunities match your current filter selection.</p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedCategory('All');
            }}
            className="text-xs text-indigo-600 font-semibold underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <OpportunityCard
              key={res.opportunity.id}
              result={res}
              onSelect={(slug) => navigate(`/opportunities/${slug}`)}
              onOpenBreakdown={(r) => setSelectedBreakdown(r)}
            />
          ))}
        </div>
      )}

      {/* College Admissions Banner */}
      <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Interested in College &amp; Course Admissions?</span>
          </h3>
          <p className="text-xs text-slate-600">
            Check courses you are eligible to apply for based on your 12th stream, percentage, and entrance scores.
          </p>
        </div>
        <button
          onClick={() => navigate('/college-eligibility')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-xs transition-colors cursor-pointer"
        >
          Check College Eligibility
        </button>
      </div>

      {/* Detailed Modal Breakdown if selected */}
      {selectedBreakdown && (
        <EligibilityBreakdownModal
          result={selectedBreakdown}
          onClose={() => setSelectedBreakdown(null)}
          onViewOpportunity={(slug) => navigate(`/opportunities/${slug}`)}
        />
      )}
    </div>
  );
};
