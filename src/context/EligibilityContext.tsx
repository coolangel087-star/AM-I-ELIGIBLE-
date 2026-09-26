import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, EligibilityResponse } from '../types.ts';

interface EligibilityContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  results: EligibilityResponse | null;
  setResults: (res: EligibilityResponse | null) => void;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  dob: '2004-05-15',
  gender: 'male',
  citizenship: 'indian',
  state: 'Delhi',
  domicileState: 'Delhi',
  category: 'General',
  isPwBD: false,
  currentEducation: 'graduate',
  class10Percentage: 85,
  class12Status: 'passed',
  class12Percentage: 82,
  subjects: {
    maths: true,
    physics: true,
    chemistry: true,
    biology: false,
    english: true,
  },
  graduationStatus: 'passed',
  graduationDegree: 'B.Tech / B.E',
  graduationSpecialization: 'Computer Science',
  graduationPercentage: 74,
};

const EligibilityContext = createContext<EligibilityContextType>({
  profile: DEFAULT_PROFILE,
  setProfile: () => {},
  results: null,
  setResults: () => {},
  resetProfile: () => {},
});

export const EligibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = sessionStorage.getItem('user_profile_cache');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROFILE;
  });

  const [results, setResultsState] = useState<EligibilityResponse | null>(() => {
    try {
      const saved = sessionStorage.getItem('eligibility_results_cache');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const setResults = (res: EligibilityResponse | null) => {
    setResultsState(res);
    try {
      if (res) {
        sessionStorage.setItem('eligibility_results_cache', JSON.stringify(res));
      } else {
        sessionStorage.removeItem('eligibility_results_cache');
      }
    } catch {}
  };

  useEffect(() => {
    try {
      sessionStorage.setItem('user_profile_cache', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    setResults(null);
  };

  return (
    <EligibilityContext.Provider value={{ profile, setProfile, results, setResults, resetProfile }}>
      {children}
    </EligibilityContext.Provider>
  );
};

export const useEligibility = () => useContext(EligibilityContext);
