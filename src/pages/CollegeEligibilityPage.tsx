import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { postCollegeEligibility } from '../services/api.ts';
import { CollegeCourseOption, Category } from '../types.ts';
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  School,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const CollegeEligibilityPage: React.FC = () => {
  const { navigate } = useRouter();

  const [class12Marks, setClass12Marks] = useState<number>(78);
  const [category, setCategory] = useState<Category>('General');
  const [state, setState] = useState<string>('Delhi');
  const [subjects, setSubjects] = useState({
    maths: true,
    physics: true,
    chemistry: true,
    biology: false,
    english: true,
  });

  const [courses, setCourses] = useState<CollegeCourseOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await postCollegeEligibility({
        courseName: 'All',
        class12Percentage: Number(class12Marks),
        subjects,
        category,
        state,
      });
      setCourses(data.courses);
      setHasEvaluated(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Undergraduate Course Eligibility Checker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          College &amp; Course Eligibility
        </h1>
        <p className="text-sm text-slate-600">
          Enter your 10+2 stream, marks, and subjects to see which undergraduate degree programs and entrance test routes you are eligible to apply for.
        </p>
      </div>

      {/* Critical Disclaimer: Eligible to Apply vs Likely to receive admission */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-5 shadow-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-950 space-y-1">
          <p className="font-bold">
            Crucial Distinction: &ldquo;Eligible to Apply&rdquo; &ne; &ldquo;Guaranteed Admission&rdquo;
          </p>
          <p className="leading-relaxed">
            Meeting the eligibility threshold confirms that you satisfy the criteria to register for the entrance examination or participate in centralized counselling (such as JoSAA, MCC, or CUET CSAS). Final admission depends on competitive cutoff ranks, seat availability, and reservation rosters. We do not predict or guarantee admissions.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Class 12 Marks Percentage (%)
            </label>
            <input
              type="number"
              min="35"
              max="100"
              required
              value={class12Marks}
              onChange={(e) => setClass12Marks(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Reservation Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            >
              <option value="General">General (UR)</option>
              <option value="OBC">OBC (Non-Creamy)</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Home State (For Domicile Quota)
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              placeholder="e.g. Maharashtra, Uttar Pradesh"
            />
          </div>
        </div>

        {/* Subjects Checklist */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Subjects Studied in Class 12
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {[
              { key: 'maths', label: 'Mathematics' },
              { key: 'physics', label: 'Physics' },
              { key: 'chemistry', label: 'Chemistry' },
              { key: 'biology', label: 'Biology / Biotechnology' },
              { key: 'english', label: 'English' },
            ].map((sub) => {
              const checked = (subjects as any)[sub.key];
              return (
                <label
                  key={sub.key}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    checked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setSubjects({ ...subjects, [sub.key]: e.target.checked })
                    }
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>{sub.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="text-right pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-100 transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>{loading ? 'Checking Criteria...' : 'Check Eligible College Courses'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Results List */}
      {hasEvaluated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Evaluated Courses &amp; Degree Programs ({courses.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Based on Class 12 score ({class12Marks}%) &amp; selected subjects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => {
              const isEligible = course.eligibleToApply;
              return (
                <div
                  key={course.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isEligible
                      ? 'bg-white border-emerald-200 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200'
                  } space-y-3 flex flex-col justify-between`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {course.stream}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          isEligible
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {course.eligibilityVerdict}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {course.courseTitle}
                    </h3>

                    <div className="text-xs space-y-1 text-slate-600">
                      <p>
                        <strong className="text-slate-700">Subject Requirement: </strong>
                        {course.subjectCondition}
                      </p>
                      <p>
                        <strong className="text-slate-700">Min Qualifying Marks: </strong>
                        {course.minMarksRequired}% in 10+2
                      </p>
                      <p>
                        <strong className="text-slate-700">Accepted Entrance: </strong>
                        {course.entranceExamAccepted}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                    <p className="italic text-[11px] leading-relaxed">{course.notes}</p>
                    <p className="text-[11px] text-slate-400">
                      Sample Colleges: {course.typicalInstitutions.join(', ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
