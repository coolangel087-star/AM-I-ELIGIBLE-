import React, { useState, useMemo } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { useEligibility } from '../context/EligibilityContext.tsx';
import { postCheckEligibility } from '../services/api.ts';
import { Category, EducationLevel, Gender } from '../types.ts';
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Shield,
  AlertCircle,
  HelpCircle,
  BookOpen,
  User,
  Sparkles,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Other UT'
];

export const CheckEligibilityPage: React.FC = () => {
  const { navigate } = useRouter();
  const { profile, setProfile, setResults } = useEligibility();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-calculated age
  const calculatedAge = useMemo(() => {
    if (!profile.dob) return null;
    const dob = new Date(profile.dob);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }, [profile.dob]);

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!profile.dob) {
        setErrorMsg('Please enter your date of birth.');
        return;
      }
      if (calculatedAge === null || calculatedAge < 13 || calculatedAge > 70) {
        setErrorMsg('Please enter a valid date of birth between 13 and 70 years.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await postCheckEligibility(profile);
      setResults(response);
      navigate('/results');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to check eligibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          Multi-Step Profile Evaluator
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Check My Eligibility
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Enter your details once. We only ask questions relevant to exam rules, reservation categories, and admission criteria.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs font-semibold">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            1
          </span>
          <span className="hidden sm:inline">Age &amp; Identity</span>
        </div>
        <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            2
          </span>
          <span className="hidden sm:inline">Current Education</span>
        </div>
        <div className={`h-0.5 flex-1 mx-3 ${step === 3 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        <div className={`flex items-center gap-2 ${step === 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            3
          </span>
          <span className="hidden sm:inline">Subjects &amp; Marks</span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Wizard Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* STEP 1: Age & Identity */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span>Age, Category &amp; Domicile</span>
              </h2>
              <p className="text-xs text-slate-500">
                Reservation categories and exact age windows determine which relaxations apply.
              </p>
            </div>

            {/* Date of Birth & Live Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={profile.dob}
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Calculated Age
                </label>
                <div className="w-full px-3.5 py-2.5 bg-indigo-50/60 border border-indigo-200 rounded-xl text-sm font-semibold text-indigo-900 flex items-center justify-between">
                  <span>{calculatedAge !== null ? `${calculatedAge} years old` : 'Enter DOB'}</span>
                  <span className="text-[11px] font-normal text-indigo-600">Auto-calculated</span>
                </div>
              </div>
            </div>

            {/* Category & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Reservation Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value as Category })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="General">General / Unreserved (UR)</option>
                  <option value="OBC">OBC (Non-Creamy Layer)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  OBC (+3 yrs), SC/ST (+5 yrs) age relaxation in civil exams.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Gender (Where applicable) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as Gender })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Transgender</option>
                </select>
              </div>
            </div>

            {/* Domicile State & PwBD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  State / Domicile
                </label>
                <select
                  value={profile.state}
                  onChange={(e) =>
                    setProfile({ ...profile, state: e.target.value, domicileState: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={profile.isPwBD}
                    onChange={(e) => setProfile({ ...profile, isPwBD: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800">Person with Benchmark Disability (PwBD)</span>
                    <span className="block text-[11px] text-slate-500">Eligible for +10 yrs age relaxation in UPSC/SSC</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Current Education Level */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>Highest Current Education</span>
              </h2>
              <p className="text-xs text-slate-500">
                Select your highest completed or currently pursuing educational level.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'class10', title: 'Class 10 (Matriculation)', desc: 'Eligible for SSC MTS, Agniveer GD, Apprentices' },
                { id: 'class12', title: 'Class 12 (Intermediate / 10+2)', desc: 'Eligible for NDA, JEE, NEET, CUET, SSC CHSL' },
                { id: 'diploma', title: 'Polytechnic Diploma', desc: 'Eligible for RRB JE, Lateral Entry Engineering, Technical posts' },
                { id: 'undergraduate', title: 'College Undergraduate (Pursuing)', desc: 'Currently studying bachelor’s degree' },
                { id: 'graduate', title: 'Graduate (Bachelor’s Degree Completed)', desc: 'Eligible for UPSC CSE, SSC CGL, CDS, Bank PO, CAT' },
                { id: 'postgraduate', title: 'Postgraduate (Master’s Degree)', desc: 'Eligible for UGC NET, Specialist Officers, State PSCs' },
              ].map((item) => {
                const isSelected = profile.currentEducation === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      setProfile({ ...profile, currentEducation: item.id as EducationLevel })
                    }
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{item.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Conditional Details (Subjects & Marks) */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Marks &amp; Subjects Relevant to Eligibility</span>
              </h2>
              <p className="text-xs text-slate-500">
                Certain opportunities require specific marks (e.g., 60% for Merchant Navy) or subject combinations (e.g., Physics &amp; Maths for Air Force/Navy).
              </p>
            </div>

            {/* If Graduate or Postgraduate */}
            {['graduate', 'undergraduate', 'postgraduate'].includes(profile.currentEducation) && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Graduation Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Degree</label>
                    <select
                      value={profile.graduationDegree || 'B.Tech / B.E'}
                      onChange={(e) =>
                        setProfile({ ...profile, graduationDegree: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="B.Tech / B.E">B.Tech / B.E (Engineering)</option>
                      <option value="B.Sc">B.Sc (Bachelor of Science)</option>
                      <option value="B.Com">B.Com (Commerce)</option>
                      <option value="B.A">B.A (Arts / Humanities)</option>
                      <option value="MBBS / BDS">MBBS / BDS / Medical</option>
                      <option value="LLB">Law (LL.B)</option>
                      <option value="Other Bachelor">Other Bachelor’s Degree</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Graduation Status</label>
                    <select
                      value={profile.graduationStatus || 'passed'}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          graduationStatus: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="passed">Passed / Degree Awarded</option>
                      <option value="final_year">Final Year (Awaiting Results)</option>
                      <option value="pursuing">Pursuing 1st/2nd/3rd Year</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Graduation % / CGPA</label>
                    <input
                      type="number"
                      min="35"
                      max="100"
                      value={profile.graduationPercentage ?? 70}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          graduationPercentage: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      placeholder="e.g. 68"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Class 12 Marks & Subjects */}
            {profile.currentEducation !== 'class10' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Class 12 Marks Percentage
                    </label>
                    <input
                      type="number"
                      min="33"
                      max="100"
                      value={profile.class12Percentage ?? 75}
                      onChange={(e) =>
                        setProfile({ ...profile, class12Percentage: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      placeholder="e.g. 78"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Class 12 Status
                    </label>
                    <select
                      value={profile.class12Status || 'passed'}
                      onChange={(e) =>
                        setProfile({ ...profile, class12Status: e.target.value as any })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    >
                      <option value="passed">Passed</option>
                      <option value="appearing">Appearing / Awaiting Results</option>
                    </select>
                  </div>
                </div>

                {/* Subjects Studied Checklist */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Subjects Studied in Class 12
                    </label>
                    <span className="text-[11px] text-slate-400">Select all that apply</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { key: 'maths', label: 'Mathematics' },
                      { key: 'physics', label: 'Physics' },
                      { key: 'chemistry', label: 'Chemistry' },
                      { key: 'biology', label: 'Biology / Biotech' },
                      { key: 'english', label: 'English' },
                      { key: 'commerce', label: 'Commerce / Accountancy' },
                    ].map((sub) => {
                      const isChecked = !!(profile.subjects as any)[sub.key];
                      return (
                        <label
                          key={sub.key}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                subjects: {
                                  ...profile.subjects,
                                  [sub.key]: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span>{sub.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Class 10 Marks */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Class 10 (Matriculation) Marks Percentage
              </label>
              <input
                type="number"
                min="33"
                max="100"
                value={profile.class10Percentage ?? 80}
                onChange={(e) =>
                  setProfile({ ...profile, class10Percentage: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm max-w-xs"
                placeholder="e.g. 85"
              />
            </div>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200 cursor-pointer"
            >
              {loading ? (
                <span>Evaluating Criteria...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Find My Opportunities</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Privacy Guarantee Note */}
      <div className="text-center text-xs text-slate-500 space-y-1">
        <p className="flex items-center justify-center gap-1.5 font-medium text-slate-600">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Zero-tracking guarantee: Your profile is processed for calculating eligibility without storing contact info.</span>
        </p>
        <p>No phone number required. No third-party data sharing.</p>
      </div>
    </div>
  );
};
