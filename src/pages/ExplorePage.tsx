import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { useSavedOpportunities } from '../context/SavedOpportunitiesContext.tsx';
import { getOpportunities, getSearchSuggestions, SearchSuggestionItem } from '../services/api.ts';
import { Opportunity, OpportunityCategory } from '../types.ts';
import { OpportunityCard } from '../components/OpportunityCard.tsx';
import {
  Search,
  Filter,
  Compass,
  Building,
  GraduationCap,
  Layers,
  Sparkles,
  RotateCcw,
  Tag,
  BookOpen,
  ArrowRight,
  X,
  Bookmark,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { navigate, path } = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState<number>(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Parse initial query params from window location
  const getSearchParam = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
  };

  const [searchTerm, setSearchTerm] = useState(getSearchParam('search'));
  const [selectedCategory, setSelectedCategory] = useState(getSearchParam('category') || 'All');
  const [selectedEducation, setSelectedEducation] = useState(getSearchParam('educationLevel') || 'All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const { savedCount, isSaved } = useSavedOpportunities();

  // Real-time autosuggest effect as the user types
  useEffect(() => {
    const query = searchTerm.trim();
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIdx(-1);
      return;
    }

    let isSubscribed = true;
    const timeout = setTimeout(() => {
      getSearchSuggestions(query)
        .then((items) => {
          if (isSubscribed) {
            setSuggestions(items);
            setShowSuggestions(items.length > 0);
            setActiveSuggestionIdx(-1);
          }
        })
        .catch(() => {
          if (isSubscribed) setSuggestions([]);
        });
    }, 120); // Fast debounce

    return () => {
      isSubscribed = false;
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  // Keep active suggestion in view while navigating with arrow keys
  useEffect(() => {
    if (activeSuggestionIdx >= 0 && itemRefs.current[activeSuggestionIdx]) {
      itemRefs.current[activeSuggestionIdx]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activeSuggestionIdx]);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLoading(true);
    getOpportunities({
      search: searchTerm,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      educationLevel: selectedEducation !== 'All' ? selectedEducation : undefined,
    })
      .then((res) => {
        setOpportunities(res.opportunities);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [searchTerm, selectedCategory, selectedEducation]);

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

  const educationLevels = [
    { id: 'All', label: 'All Qualifications' },
    { id: 'class10', label: 'After Class 10' },
    { id: 'class12', label: 'After Class 12' },
    { id: 'diploma', label: 'After Diploma' },
    { id: 'graduate', label: 'After Graduation' },
    { id: 'postgraduate', label: 'After Postgrad' },
  ];

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedEducation('All');
    setShowSavedOnly(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIdx(-1);
  };

  const handleSelectSuggestion = (item: SearchSuggestionItem) => {
    if (item.type === 'category') {
      setSelectedCategory(item.category as OpportunityCategory);
      setSearchTerm('');
      setShowSuggestions(false);
      setActiveSuggestionIdx(-1);
    } else {
      setSearchTerm(item.matchText || item.title);
      setShowSuggestions(false);
      setActiveSuggestionIdx(-1);
      if (item.slug) {
        navigate(`/opportunities/${item.slug}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If suggestions are closed, ArrowDown reopens them
    if (e.key === 'ArrowDown' && !showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      setShowSuggestions(true);
      setActiveSuggestionIdx(0);
      return;
    }

    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIdx >= 0 && activeSuggestionIdx < suggestions.length) {
        handleSelectSuggestion(suggestions[activeSuggestionIdx]);
      } else if (suggestions.length > 0) {
        // Default to first suggestion when Enter is pressed
        handleSelectSuggestion(suggestions[0]);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === 'Tab') {
      if (activeSuggestionIdx >= 0 && activeSuggestionIdx < suggestions.length) {
        handleSelectSuggestion(suggestions[activeSuggestionIdx]);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
      setActiveSuggestionIdx(-1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>India Opportunity &amp; Examination Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore All Exams &amp; Opportunities
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Search across Defence entries, UPSC civil services, SSC recruitment, Banking PO/Clerk, Railways, Engineering, Medical, Law, Maritime, and central university admissions.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Input with Real-time Autosuggest Dropdown */}
        <div className="relative" ref={searchContainerRef}>
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search by exam name or category (e.g. NDA, SSC CGL, NEET, Merchant Navy, UPSC, Banking)..."
            className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all"
            autoComplete="off"
            spellCheck="false"
            role="combobox"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="autosuggest-listbox"
            aria-activedescendant={
              activeSuggestionIdx >= 0 ? `autosuggest-item-${activeSuggestionIdx}` : undefined
            }
          />

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute right-3.5 top-3.5 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autosuggest Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Suggestions</span>
                <span className="text-[10px] text-slate-400 font-normal">Use &uarr;&darr; to navigate, Enter to select</span>
              </div>
              <div id="autosuggest-listbox" role="listbox" className="max-h-72 overflow-y-auto">
                {suggestions.map((item, idx) => {
                  const isSelected = activeSuggestionIdx === idx;
                  const isCategory = item.type === 'category';

                  return (
                    <button
                      key={`${item.type}-${item.title}-${idx}`}
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      id={`autosuggest-item-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      onMouseEnter={() => setActiveSuggestionIdx(idx)}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/80 text-indigo-950 font-semibold ring-1 ring-inset ring-indigo-200'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isCategory
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {isCategory ? (
                            <Tag className="w-3.5 h-3.5" />
                          ) : (
                            <BookOpen className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {isCategory && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                Category
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-medium text-slate-400">
                          {item.category}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Education Level Quick Filters */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Education Level
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {educationLevels.map((edu) => (
              <button
                key={edu.id}
                onClick={() => setSelectedEducation(edu.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedEducation === edu.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {edu.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Sector / Category
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {/* Saved Opportunities Quick Filter */}
            {savedCount > 0 && (
              <button
                type="button"
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  showSavedOnly
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current' : 'text-amber-600'}`} />
                <span>Saved Bookmarks ({savedCount})</span>
              </button>
            )}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50/70 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters count & reset */}
        {(searchTerm || selectedCategory !== 'All' || selectedEducation !== 'All' || showSavedOnly) && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing filtered results ({
                (showSavedOnly ? opportunities.filter((o) => isSaved(o.slug)) : opportunities).length
              } found)
              {showSavedOnly && ' • Filtered to saved bookmarks'}
            </span>
            <button
              onClick={resetFilters}
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : (showSavedOnly ? opportunities.filter((o) => isSaved(o.slug)) : opportunities).length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <p className="text-slate-600 font-medium">
            {showSavedOnly
              ? 'No saved bookmarks match the current category or search filters.'
              : 'No opportunities match your current search.'}
          </p>
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-indigo-600 underline cursor-pointer"
          >
            Clear filters and browse all
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showSavedOnly ? opportunities.filter((o) => isSaved(o.slug)) : opportunities).map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={(slug) => navigate(`/opportunities/${slug}`)}
            />
          ))}
        </div>
      )}

      {/* Database Expansion Note */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center leading-relaxed">
        <p>
          <strong>Notice:</strong> We do not claim the initial database contains every single Indian exam or local vacancy. Our verified opportunity database is continuously audited and expanded directly from official gazettes and notifications.
        </p>
      </div>
    </div>
  );
};
