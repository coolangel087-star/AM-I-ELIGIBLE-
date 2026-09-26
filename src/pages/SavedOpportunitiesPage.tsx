import React, { useState, useMemo } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { useSavedOpportunities } from '../context/SavedOpportunitiesContext.tsx';
import { useSubscriptions } from '../context/SubscriptionContext.tsx';
import { OpportunityCard } from '../components/OpportunityCard.tsx';
import { SubscriptionBanner } from '../components/SubscriptionBanner.tsx';
import { SubscribeModal } from '../components/SubscribeModal.tsx';
import { OpportunityCategory } from '../types.ts';
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Trash2,
  Download,
  Sparkles,
  ArrowRight,
  Compass,
  FileText,
  Calendar,
  Building,
  ExternalLink,
  Edit3,
  Check,
  X,
  AlertCircle,
  Bell,
  BellRing,
} from 'lucide-react';

export const SavedOpportunitiesPage: React.FC = () => {
  const { navigate } = useRouter();
  const { savedItems, savedCount, removeOpportunity, updateNotes, clearAllSaved } =
    useSavedOpportunities();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OpportunityCategory | 'All'>('All');
  const [editingNotesSlug, setEditingNotesSlug] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const categories: (OpportunityCategory | 'All')[] = [
    'All',
    'Defence',
    'UPSC',
    'SSC',
    'Banking & Finance',
    'Railways',
    'Engineering',
    'Medical',
    'Law',
    'Management',
    'College & University Admissions',
    'Maritime',
  ];

  const filteredItems = useMemo(() => {
    return savedItems.filter((item) => {
      const opp = item.opportunity;
      const matchesSearch =
        !searchTerm ||
        opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.conductingOrg.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat =
        selectedCategory === 'All' || opp.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [savedItems, searchTerm, selectedCategory]);

  const handleStartEditNote = (slug: string, currentNote?: string) => {
    setEditingNotesSlug(slug);
    setTempNote(currentNote || '');
  };

  const handleSaveNote = (slug: string) => {
    updateNotes(slug, tempNote.trim());
    setEditingNotesSlug(null);
  };

  const handleExport = () => {
    if (savedItems.length === 0) return;
    const exportData = {
      exportedAt: new Date().toISOString(),
      platform: 'Am I Eligible? (India Universal Opportunity Checker)',
      totalSaved: savedItems.length,
      opportunities: savedItems.map((item) => ({
        name: item.opportunity.name,
        shortName: item.opportunity.shortName,
        category: item.opportunity.category,
        conductingOrg: item.opportunity.conductingOrg,
        minEducation: item.opportunity.minEducationLevel,
        currentCycle: item.opportunity.currentCycle.cycleName,
        applicationPeriod: item.opportunity.currentCycle.applicationPeriod,
        officialSourceUrl: item.opportunity.currentCycle.officialSourceUrl,
        savedOn: item.savedAt,
        personalNotes: item.notes || '',
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `am-i-eligible-saved-opportunities-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Saved in Browser Local Storage (No Login Needed)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>My Saved Opportunities</span>
            <span className="text-sm font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
              {savedCount}
            </span>
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Quickly track exams, college admissions, and recruitment cycles you are interested in. Everything is stored locally on this device.
          </p>
        </div>

        {savedCount > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/check-eligibility')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Check Eligibility For My Profile</span>
            </button>
            <button
              onClick={handleExport}
              title="Download your bookmarked opportunities as JSON"
              className="px-3.5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setConfirmClearOpen(true)}
              title="Clear all saved opportunities"
              className="p-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Confirmation modal for clearing */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Clear All Saved Items?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will remove all {savedCount} bookmarked opportunities and personal notes from your local storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllSaved();
                  setConfirmClearOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {savedCount === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200 text-center max-w-2xl mx-auto shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">No saved opportunities yet</h2>
            <p className="text-sm text-slate-600">
              Bookmark exams and recruitment opportunities across Defence, UPSC, SSC, Banking, Engineering, and Medical as you browse. They will appear here for instant reference.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/explore')}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Opportunities</span>
            </button>
            <button
              onClick={() => navigate('/check-eligibility')}
              className="w-full sm:w-auto px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Check My Eligibility</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search among saved items or your personal notes..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* View toggle */}
              <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  List &amp; Notes
                </button>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === 'All'
                    ? savedItems.length
                    : savedItems.filter((i) => i.opportunity.category === cat).length;
                if (cat !== 'All' && count === 0) return null;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Display */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                No saved items match &ldquo;{searchTerm}&rdquo;
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="text-xs text-indigo-600 underline font-semibold"
              >
                Clear search and filters
              </button>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.slug} className="flex flex-col space-y-2">
                  <OpportunityCard
                    opportunity={item.opportunity}
                    onSelect={(slug) => navigate(`/opportunities/${slug}`)}
                  />

                  {/* Personal Note bar beneath card */}
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-900 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>My Personal Note</span>
                      </span>
                      {editingNotesSlug !== item.slug && (
                        <button
                          onClick={() => handleStartEditNote(item.slug, item.notes)}
                          className="text-[11px] text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 hover:underline"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{item.notes ? 'Edit' : 'Add Note'}</span>
                        </button>
                      )}
                    </div>

                    {editingNotesSlug === item.slug ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          placeholder="e.g., Application opens in Dec, need 60% in degree..."
                          rows={2}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingNotesSlug(null)}
                            className="px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-200 rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(item.slug)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-md flex items-center gap-1 shadow-2xs"
                          >
                            <Check className="w-3 h-3" />
                            <span>Save Note</span>
                          </button>
                        </div>
                      </div>
                    ) : item.notes ? (
                      <p className="text-amber-950 font-medium leading-relaxed italic">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    ) : (
                      <p className="text-amber-700/70 text-[11px]">
                        No personal note added yet. Click &ldquo;Add Note&rdquo; to jot down deadlines or thoughts.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table/List View */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Opportunity</th>
                      <th className="px-4 py-3">Category &amp; Org</th>
                      <th className="px-4 py-3">Cycle &amp; Deadline</th>
                      <th className="px-4 py-3">My Notes</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const opp = item.opportunity;
                      return (
                        <tr key={item.slug} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => navigate(`/opportunities/${opp.slug}`)}
                              className="font-bold text-slate-900 hover:text-indigo-600 text-left block"
                            >
                              {opp.name}
                            </button>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {opp.shortName}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-slate-700 block">
                              {opp.category}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {opp.conductingOrg}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-medium text-slate-800 block">
                              {opp.currentCycle.cycleName}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {opp.currentCycle.applicationPeriod || 'Official portal'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 max-w-xs">
                            {editingNotesSlug === item.slug ? (
                              <div className="space-y-1.5">
                                <input
                                  type="text"
                                  value={tempNote}
                                  onChange={(e) => setTempNote(e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                                />
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleSaveNote(item.slug)}
                                    className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingNotesSlug(null)}
                                    className="px-2 py-0.5 text-slate-600 rounded text-[10px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => handleStartEditNote(item.slug, item.notes)}
                                className="cursor-pointer hover:bg-amber-50 p-1 rounded transition-colors group"
                                title="Click to edit notes"
                              >
                                {item.notes ? (
                                  <span className="text-slate-800 italic group-hover:text-indigo-700">
                                    {item.notes}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                                    <Edit3 className="w-3 h-3" /> Add note...
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => navigate(`/opportunities/${opp.slug}`)}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-semibold"
                            >
                              View
                            </button>
                            <a
                              href={opp.currentCycle.officialSourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg inline-block align-middle"
                              title="Official Website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => removeOpportunity(item.slug)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg inline-block align-middle"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
