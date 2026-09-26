import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { useSavedOpportunities } from '../context/SavedOpportunitiesContext.tsx';
import { getOpportunityBySlug, fetchLiveNotificationCheck, LiveNotificationUpdate } from '../services/api.ts';
import { Opportunity } from '../types.ts';
import {
  Calendar,
  Building,
  CheckCircle2,
  ExternalLink,
  Shield,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  FileText,
  UserCheck,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  Globe,
  RefreshCw,
  Search,
  Bookmark,
} from 'lucide-react';

export const OpportunityDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.slug;

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isSaved, toggleSave } = useSavedOpportunities();
  const saved = opp ? isSaved(opp.slug) : false;

  // Google Search Grounding state
  const [liveData, setLiveData] = useState<LiveNotificationUpdate | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState('');

  const checkLiveStatus = async (opportunityName: string, conductingOrg?: string) => {
    setLiveLoading(true);
    setLiveError('');
    try {
      const res = await fetchLiveNotificationCheck(opportunityName, conductingOrg);
      setLiveData(res);
    } catch (err: any) {
      setLiveError(err.message || 'Unable to fetch live updates from Google Search');
    } finally {
      setLiveLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getOpportunityBySlug(slug)
      .then((data) => {
        setOpp(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Opportunity not found');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-12 bg-slate-200 rounded w-3/4" />
          <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Opportunity Not Found</h2>
        <p className="text-sm text-slate-600">{error || 'The requested opportunity record does not exist.'}</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
        >
          Explore All Opportunities
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-1.5 font-medium hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
        <div className="flex items-center gap-2">
          <span>{opp.category}</span>
          <span>&bull;</span>
          <span className="font-semibold text-slate-700">{opp.shortName}</span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            {opp.category}
          </span>
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-md">
            <Building className="w-3.5 h-3.5" />
            {opp.conductingOrg}
          </span>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            Verified: {opp.currentCycle.lastVerifiedDate}
          </span>
          {saved && (
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Bookmark className="w-3 h-3 fill-amber-500 text-amber-600" />
              <span>Saved in your browser</span>
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {opp.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {opp.summary}
          </p>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-slate-400 font-medium">Min Qualification:</span>
            <p className="font-bold text-slate-900 capitalize">{opp.minEducationLevel.replace('class', 'Class ')}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-slate-400 font-medium">Age Requirement:</span>
            <p className="font-bold text-slate-900">
              {opp.ageRule.minAge !== undefined
                ? `${opp.ageRule.minAge} to ${opp.ageRule.maxAge ?? 'No upper limit'} yrs`
                : 'See DOB cutoff'}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-slate-400 font-medium">Frequency:</span>
            <p className="font-bold text-slate-900">{opp.attemptsRule.cyclesPerYear} time(s) / year</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-slate-400 font-medium">Attempt Limit:</span>
            <p className="font-bold text-slate-900">
              {opp.attemptsRule.hasFixedAttemptLimit ? 'Official Limit' : 'No Fixed Limit'}
            </p>
          </div>
        </div>

        {/* Direct Action: Check Your Eligibility & Bookmark */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate('/check-eligibility')}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Check If You Are Eligible For This</span>
          </button>
          <button
            onClick={() => toggleSave(opp)}
            className={`w-full sm:w-auto px-5 py-3 border text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              saved
                ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 shadow-2xs'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
            <span>{saved ? 'Saved in Bookmarks' : 'Save Opportunity'}</span>
          </button>
          <a
            href={opp.currentCycle.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Official Notification Portal</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Verification Notice:</strong> Eligibility criteria, cutoffs, and age boundaries can change between recruitment cycles. Always verify the latest official notification published by {opp.conductingOrg} before registering.
        </p>
      </div>

      {/* Google Search Grounded Live Notification & Dates Card */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-indigo-700/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-700/50">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-indigo-300" />
              <span>Google Search Grounded Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Live Official Notification &amp; Dates</span>
            </h2>
            <p className="text-xs text-indigo-200/80">
              Real-time notification dates, application windows, and official press releases retrieved directly via Google Search.
            </p>
          </div>

          <button
            onClick={() => checkLiveStatus(opp.name, opp.conductingOrg)}
            disabled={liveLoading}
            className="self-start sm:self-auto px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            {liveLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Checking Google Search...</span>
              </>
            ) : liveData ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Live Search</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Check Live Notification &amp; Dates</span>
              </>
            )}
          </button>
        </div>

        {liveLoading && (
          <div className="p-6 bg-white/5 rounded-2xl border border-indigo-500/20 text-center space-y-3 animate-pulse">
            <Globe className="w-8 h-8 text-indigo-300 mx-auto animate-spin" />
            <p className="text-sm font-semibold text-indigo-100">
              Querying Google Search for latest official {opp.shortName} notices...
            </p>
            <p className="text-xs text-indigo-300/70">
              Grounding data from official portals ({opp.conductingOrg}), government press bureaus, and current year exam calendars.
            </p>
          </div>
        )}

        {liveError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Unable to fetch live search update</p>
              <p className="text-rose-300/80">{liveError}</p>
            </div>
            <button
              onClick={() => checkLiveStatus(opp.name, opp.conductingOrg)}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-rose-100 font-bold text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {!liveData && !liveLoading && !liveError && (
          <div className="p-5 bg-white/5 rounded-2xl border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-indigo-200">
            <div className="space-y-1">
              <p className="font-semibold text-white text-sm">
                Need the latest 2025/2026 application start date or official notification release status?
              </p>
              <p className="text-indigo-200/70">
                Click &ldquo;Check Live Notification &amp; Dates&rdquo; to run a search-grounded check against recent official notifications and announcements.
              </p>
            </div>
            <button
              onClick={() => checkLiveStatus(opp.name, opp.conductingOrg)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-indigo-300" />
              <span>Verify Now</span>
            </button>
          </div>
        )}

        {liveData && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Formatted summary */}
            <div className="p-5 bg-slate-950/60 rounded-2xl border border-indigo-500/30 text-xs sm:text-sm text-slate-200 space-y-3 leading-relaxed whitespace-pre-line font-sans">
              {liveData.summary}
            </div>

            {/* Grounded Web Sources */}
            {liveData.sources && liveData.sources.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Google Search Sources &amp; Official References:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {liveData.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 hover:bg-white/10 border border-indigo-500/20 rounded-xl flex items-center justify-between gap-2 text-xs text-indigo-100 hover:text-white transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-[12px] group-hover:underline">
                          {src.title}
                        </p>
                        <p className="text-[10px] text-indigo-300/70 truncate">{src.url}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-indigo-300/60 pt-2 border-t border-indigo-700/30">
              <span>Last checked: {new Date(liveData.lastChecked).toLocaleTimeString()}</span>
              <span>Grounding provided via Google Search</span>
            </div>
          </div>
        )}
      </section>

      {/* Section 1: Detailed Overview */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Overview &amp; Purpose</h2>
        <p className="text-sm text-slate-700 leading-relaxed">{opp.description}</p>
      </section>

      {/* Section 2: Age Eligibility & Exact DOB Window */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Age Limits &amp; Date of Birth Windows</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Cycle: {opp.currentCycle.cycleName}
          </span>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
          {opp.ageRule.dobMin && opp.ageRule.dobMax ? (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">Official Date of Birth Cutoff Range:</p>
              <div className="p-3 bg-white border border-indigo-200 rounded-lg font-mono text-indigo-900 font-bold text-sm">
                Candidates must be born between {opp.ageRule.dobMin} and {opp.ageRule.dobMax} (inclusive).
              </div>
              <p className="text-xs text-slate-500 pt-1">{opp.ageRule.cutoffReferenceText}</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">General Age Limits:</p>
              <p>
                Minimum Age: <span className="font-bold">{opp.ageRule.minAge ?? 'None'} years</span> &bull; Maximum Age:{' '}
                <span className="font-bold">{opp.ageRule.maxAge ?? 'No upper age limit'} years</span>
              </p>
              <p className="text-xs text-slate-500">{opp.ageRule.cutoffReferenceText}</p>
            </div>
          )}

          {opp.ageRule.allowFinalYearAppearing && (
            <p className="text-xs text-emerald-700 font-semibold pt-1">
              ✓ Candidates appearing in final qualifying examination are eligible to apply.
            </p>
          )}
        </div>

        {/* Category Age Relaxation Table */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Category-Based Upper Age Relaxations
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold text-slate-700">Category</th>
                  <th className="px-4 py-2.5 text-left font-bold text-slate-700">Relaxation Permitted</th>
                  <th className="px-4 py-2.5 text-left font-bold text-slate-700">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-900">General / EWS</td>
                  <td className="px-4 py-2 text-slate-600">No relaxation (Standard age limit applies)</td>
                  <td className="px-4 py-2 text-slate-500">Unreserved criteria</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-900">OBC (Non-Creamy Layer)</td>
                  <td className="px-4 py-2 font-semibold text-indigo-700">
                    {opp.categoryAgeRelaxation.OBC ? `+${opp.categoryAgeRelaxation.OBC} Years` : 'No relaxation (0 Years)'}
                  </td>
                  <td className="px-4 py-2 text-slate-500">Subject to central OBC certificate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-900">SC / ST</td>
                  <td className="px-4 py-2 font-semibold text-indigo-700">
                    {opp.categoryAgeRelaxation.SC ? `+${opp.categoryAgeRelaxation.SC} Years` : 'No relaxation (0 Years)'}
                  </td>
                  <td className="px-4 py-2 text-slate-500">As per standard Government of India roster</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-900">PwBD (Disability)</td>
                  <td className="px-4 py-2 font-semibold text-indigo-700">
                    {opp.categoryAgeRelaxation.PwBD ? `+${opp.categoryAgeRelaxation.PwBD} Years` : 'Check official notification'}
                  </td>
                  <td className="px-4 py-2 text-slate-500">Where bench-mark disability posts exist</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 3: Educational Qualifications & Mandatory Subjects */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Educational Qualification &amp; Subject Requirements</span>
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-semibold text-slate-900">Minimum Baseline Qualification:</span>
            <p className="text-slate-800 font-bold uppercase">{opp.minEducationLevel.replace('class', 'Class ')}</p>
            {opp.allowedDegrees && (
              <p className="text-xs text-slate-600 pt-1">
                <strong>Eligible Degrees: </strong>
                {opp.allowedDegrees.join(', ')}
              </p>
            )}
          </div>

          {opp.subjectRequirements && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-semibold text-slate-900">Subject Combination Rules:</span>
              <p className="text-slate-700 leading-relaxed">{opp.subjectRequirements.notes}</p>
            </div>
          )}

          {opp.minPercentageClass12 ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500">Minimum Marks in Class 12: </span>
              <span className="font-bold text-slate-800">{opp.minPercentageClass12}%</span>
            </div>
          ) : null}

          {opp.minPercentageGraduation ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500">Minimum Marks in Graduation: </span>
              <span className="font-bold text-slate-800">{opp.minPercentageGraduation}%</span>
            </div>
          ) : null}
        </div>
      </section>

      {/* Section 4: Attempts vs Opportunities (Very Important) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Attempt Limits vs Eligible Opportunities</span>
        </h2>

        <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-950">Attempt Rule Distinction:</span>
            <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-indigo-200 text-indigo-900">
              {opp.attemptsRule.hasFixedAttemptLimit ? 'Explicit Attempt Limit' : 'No Fixed Attempt Cap'}
            </span>
          </div>
          <p className="text-slate-800 leading-relaxed">{opp.attemptsRule.officialRuleText}</p>
          <div className="pt-2 text-xs text-slate-500 border-t border-indigo-100 leading-relaxed">
            *Where an examination does not set a hard attempt limit, your remaining opportunities are governed entirely by your age headroom and the cycle schedule. Future eligibility depends on the official notification for each cycle.
          </div>
        </div>
      </section>

      {/* Section 5: Selection Stages */}
      {opp.selectionStages && opp.selectionStages.length > 0 && (
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Selection Stages &amp; Examination Pattern</span>
          </h2>

          <div className="space-y-2">
            {opp.selectionStages.map((stage, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm"
              >
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-800 font-medium leading-relaxed">{stage}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 6: Physical & Medical Standards (if any) */}
      {opp.physicalStandards && (
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <span>Physical &amp; Medical Standards</span>
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
            {opp.physicalStandards.heightMaleCm && (
              <p>
                <strong>Min Height (Male): </strong>
                {opp.physicalStandards.heightMaleCm} cm
              </p>
            )}
            {opp.physicalStandards.heightFemaleCm && (
              <p>
                <strong>Min Height (Female): </strong>
                {opp.physicalStandards.heightFemaleCm} cm
              </p>
            )}
            {opp.physicalStandards.visionStandards && (
              <p>
                <strong>Vision / Eyesight: </strong>
                {opp.physicalStandards.visionStandards}
              </p>
            )}
            {opp.physicalStandards.notes && (
              <p className="text-slate-600 italic">{opp.physicalStandards.notes}</p>
            )}
          </div>
        </section>
      )}

      {/* Section 7: Required Documents */}
      {opp.requiredDocuments && opp.requiredDocuments.length > 0 && (
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Required Documents for Application</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {opp.requiredDocuments.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Section 8: Frequently Asked Questions */}
      {opp.faqs && opp.faqs.length > 0 && (
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-3">
            {opp.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 9: Official Sources & Metadata */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-white">Official Notification &amp; Verification Source</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified against {opp.conductingOrg} gazette and official portal.
            </p>
          </div>
          <a
            href={opp.currentCycle.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 self-start sm:self-auto transition-colors"
          >
            <span>Visit {opp.currentCycle.officialSourceOrg}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">Recruitment Cycle</span>
            <span className="font-medium text-white">{opp.currentCycle.cycleName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Last Audited &amp; Verified</span>
            <span className="font-medium text-white">{opp.currentCycle.lastVerifiedDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Verification Status</span>
            <span className="font-medium text-emerald-400">Verified from Official Source</span>
          </div>
        </div>
      </section>
    </article>
  );
};
