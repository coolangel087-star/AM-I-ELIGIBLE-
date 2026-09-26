import React from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { AlertCircle, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Prominent Mandatory Legal Disclaimer Box */}
        <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 shadow-inner">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-amber-300 uppercase tracking-wider text-xs">
                Official Disclaimer &amp; Notice to Aspirants
              </p>
              <p>
                This website provides eligibility information for educational and informational
                purposes. Eligibility criteria, age limits, dates, reservation rules, vacancies,
                cutoffs and other requirements may change between recruitment/admission cycles.
                Always verify the latest official notification or admission prospectus before
                applying. We are an independent educational information platform and are not
                affiliated with or endorsed by UPSC, SSC, NTA, Armed Forces, or any government body.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
              <span>Am I Eligible?</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              India’s universal eligibility checker for competitive exams, defence entries, government jobs, and higher education admissions.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/check-eligibility')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Check My Eligibility
              </button>
            </div>
          </div>

          {/* Col 2: By Qualification */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">
              By Qualification
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/explore?educationLevel=class10')}
                  className="hover:text-white transition-colors"
                >
                  After Class 10 Opportunities
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/explore?educationLevel=class12')}
                  className="hover:text-white transition-colors"
                >
                  After Class 12 (Science / Arts / Commerce)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/explore?educationLevel=diploma')}
                  className="hover:text-white transition-colors"
                >
                  After Polytechnic Diploma
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/explore?educationLevel=graduate')}
                  className="hover:text-white transition-colors"
                >
                  After Graduation (Any Degree)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/college-eligibility')}
                  className="hover:text-white transition-colors"
                >
                  College &amp; Course Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/saved')}
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
                >
                  <span>My Saved Opportunities</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Entries */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">
              Popular Routes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/opportunities/nda-eligibility')}
                  className="hover:text-white transition-colors"
                >
                  NDA &amp; NA Eligibility
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/opportunities/upsc-cse-eligibility')}
                  className="hover:text-white transition-colors"
                >
                  UPSC Civil Services (IAS/IPS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/opportunities/ssc-cgl-eligibility')}
                  className="hover:text-white transition-colors"
                >
                  SSC CGL Graduate Recruitment
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/opportunities/cds-eligibility')}
                  className="hover:text-white transition-colors"
                >
                  CDS Defence Officer Entry
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/opportunities/neet-ug-eligibility')}
                  className="hover:text-white transition-colors"
                >
                  NEET UG Medical Admissions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/opportunities/merchant-navy-eligibility')}
                  className="hover:text-white transition-colors"
                >
                  Merchant Navy (IMU-CET DNS)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">
              Policies &amp; Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/editorial-policy')}
                  className="hover:text-white transition-colors"
                >
                  Editorial &amp; Verification Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/disclaimer')}
                  className="hover:text-white transition-colors"
                >
                  Full Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact &amp; Error Reporting
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            &copy; {new Date().getFullYear()} Am I Eligible? (India). All rights reserved. Built for Indian students and aspirants.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Database continuously updated from official gazettes</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
