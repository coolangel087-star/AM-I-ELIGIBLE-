import React, { createContext, useContext, useState, useEffect } from 'react';
import { Opportunity } from '../types.ts';

export interface SavedOpportunityItem {
  slug: string;
  opportunity: Opportunity;
  savedAt: string; // ISO string
  notes?: string;
}

interface SavedOpportunitiesContextType {
  savedItems: SavedOpportunityItem[];
  savedCount: number;
  isSaved: (slug: string) => boolean;
  saveOpportunity: (opp: Opportunity, notes?: string) => void;
  removeOpportunity: (slug: string) => void;
  toggleSave: (opp: Opportunity) => boolean; // returns true if saved, false if removed
  updateNotes: (slug: string, notes: string) => void;
  clearAllSaved: () => void;
}

const STORAGE_KEY = 'am_i_eligible_saved_opportunities_v1';

const SavedOpportunitiesContext = createContext<SavedOpportunitiesContextType | undefined>(
  undefined
);

export const SavedOpportunitiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [savedItems, setSavedItems] = useState<SavedOpportunityItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to read saved opportunities from localStorage', err);
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
    } catch (err) {
      console.error('Failed to write saved opportunities to localStorage', err);
    }
  }, [savedItems]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setSavedItems(parsed);
          }
        } catch {
          // ignore parse errors
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isSaved = (slug: string): boolean => {
    return savedItems.some((item) => item.slug === slug);
  };

  const saveOpportunity = (opp: Opportunity, notes?: string) => {
    setSavedItems((prev) => {
      if (prev.some((item) => item.slug === opp.slug)) {
        // Update existing item
        return prev.map((item) =>
          item.slug === opp.slug
            ? { ...item, opportunity: opp, notes: notes !== undefined ? notes : item.notes }
            : item
        );
      }
      return [
        {
          slug: opp.slug,
          opportunity: opp,
          savedAt: new Date().toISOString(),
          notes: notes || '',
        },
        ...prev,
      ];
    });
  };

  const removeOpportunity = (slug: string) => {
    setSavedItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const toggleSave = (opp: Opportunity): boolean => {
    const alreadySaved = savedItems.some((item) => item.slug === opp.slug);
    if (alreadySaved) {
      removeOpportunity(opp.slug);
      return false;
    } else {
      saveOpportunity(opp);
      return true;
    }
  };

  const updateNotes = (slug: string, notes: string) => {
    setSavedItems((prev) =>
      prev.map((item) => (item.slug === slug ? { ...item, notes } : item))
    );
  };

  const clearAllSaved = () => {
    setSavedItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <SavedOpportunitiesContext.Provider
      value={{
        savedItems,
        savedCount: savedItems.length,
        isSaved,
        saveOpportunity,
        removeOpportunity,
        toggleSave,
        updateNotes,
        clearAllSaved,
      }}
    >
      {children}
    </SavedOpportunitiesContext.Provider>
  );
};

export const useSavedOpportunities = () => {
  const context = useContext(SavedOpportunitiesContext);
  if (!context) {
    throw new Error('useSavedOpportunities must be used within a SavedOpportunitiesProvider');
  }
  return context;
};
