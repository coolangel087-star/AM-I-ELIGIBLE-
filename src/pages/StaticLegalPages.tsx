import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import {
  ShieldCheck,
  AlertCircle,
  FileText,
  Mail,
  HelpCircle,
  CheckCircle2,
  Building,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
          Our Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">About &ldquo;Am I Eligible?&rdquo;</h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Am I Eligible? is India’s independent, universal eligibility and opportunity intelligence platform designed specifically for students, graduates, and competitive exam aspirants.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">The Problem We Solve</h2>
        <p>
          Every year, millions of Indian youth miss critical examination deadlines or apply for recruitment routes only to be rejected during document verification due to nuanced age cutoff dates, subject restrictions (such as 10+2 Mathematics for certain Defence or Maritime wings), category-specific age relaxations, or hidden attempt limits.
        </p>
        <p>
          Instead of wading through dozens of 80-page PDF notifications from UPSC, SSC, IBPS, NTA, and State Boards, <em>Am I Eligible?</em> allows candidates to enter their basic details once and receive transparent, rules-based evaluations for every major career and educational opportunity.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">Our Fundamental Principle</h2>
        <p className="font-semibold text-slate-900">
          Accuracy &gt; Number of Opportunities.
        </p>
        <p>
          We do not guess, hallucinate, or predict admissions. We strictly map each candidate against the exact qualification criteria, dates of birth, and reservation relaxations stated in the latest official gazettes and notifications.
        </p>

        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
          <span className="font-semibold text-indigo-950">Ready to test your profile?</span>
          <button
            onClick={() => navigate('/check-eligibility')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs"
          >
            Check My Eligibility
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditorialPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          Trust &amp; Accuracy Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Editorial &amp; Verification Policy</h1>
        <p className="text-base text-slate-600">
          How we source, audit, and maintain our verified database of Indian examinations and admission routes.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">1. Primary Official Sources Only</h2>
        <p>
          We only verify eligibility rules from primary source documents, including:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
          <li>Gazettes and official notifications issued by the Union Public Service Commission (UPSC).</li>
          <li>Official notices from the Staff Selection Commission (SSC).</li>
          <li>Information bulletins published by the National Testing Agency (NTA) for NEET and JEE.</li>
          <li>Recruitment notifications from the Indian Armed Forces (Army, Navy, Air Force, Coast Guard).</li>
          <li>Centralized notifications from the Institute of Banking Personnel Selection (IBPS) and SBI.</li>
          <li>Official university admission prospectuses and Bar Council of India guidelines.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-2">2. Cycle-Specific Information</h2>
        <p>
          Eligibility criteria are never treated as permanent constants. Each opportunity in our system explicitly displays its recruitment/admission cycle (e.g. <em>NDA &amp; NA (I) 2026</em>), notification reference, and the date it was last verified by our editorial team.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">3. Zero-Fabrication Rule</h2>
        <p>
          If an official body has not yet published the dates or rules for an upcoming cycle, our platform states: <em>&ldquo;Future eligibility depends on the official notification for each cycle&rdquo;</em> rather than guessing or publishing speculative clickbait.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">4. Error Reporting &amp; Correction</h2>
        <p>
          If you identify any discrepancy with the latest published government gazette, our team investigates and corrects the database within 24 hours of notification.
        </p>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Legal &amp; Information Notice
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Statutory Disclaimer</h1>
        <p className="text-base text-slate-600">
          Please review this notice carefully before using the Am I Eligible? platform.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <div className="p-5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 font-medium">
          &ldquo;This website provides eligibility information for educational and informational purposes. Eligibility criteria, age limits, dates, reservation rules, vacancies, cutoffs and other requirements may change between recruitment/admission cycles. Always verify the latest official notification or admission information before applying.&rdquo;
        </div>

        <h2 className="text-lg font-bold text-slate-900">Non-Affiliation with Government Bodies</h2>
        <p>
          Am I Eligible? is an independent online tool. It is neither affiliated with, nor endorsed by, nor authorized by the Government of India, any State Government, Union Public Service Commission (UPSC), Staff Selection Commission (SSC), National Testing Agency (NTA), Railway Recruitment Boards (RRB), Ministry of Defence, or any educational university.
        </p>

        <h2 className="text-lg font-bold text-slate-900">No Guarantee of Selection or Admission</h2>
        <p>
          Receiving an &ldquo;Eligible based on available criteria&rdquo; result indicates solely that your entered profile parameters satisfy the published baseline rules for that entry route. It does not imply or guarantee job selection, clearance of written tests, medical fitness clearance, reservation certificate validity, or college seat allotment.
        </p>

        <h2 className="text-lg font-bold text-slate-900">Limitation of Liability</h2>
        <p>
          Users are advised to thoroughly cross-verify all eligibility rules against the respective conducting authority&rsquo;s official portal prior to paying application fees or booking examination slots.
        </p>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
          User Privacy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-base text-slate-600">
          We respect student privacy. We do not collect unnecessary personal information.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">1. Information Processed</h2>
        <p>
          When you use our eligibility checker, you input your Date of Birth, gender, state, category, educational level, marks, and subject choices. This information is processed in transient memory for the single purpose of running the eligibility logic.
        </p>

        <h2 className="text-lg font-bold text-slate-900">2. No Personal Identifiers Required</h2>
        <p>
          We do not require users to create an account, register their phone number, email address, or government Aadhaar identity to check eligibility.
        </p>

        <h2 className="text-lg font-bold text-slate-900">3. Non-Disclosure &amp; Zero Spam</h2>
        <p>
          Because we do not harvest mobile numbers or email lists, you will never receive promotional telemarketing calls, spam SMS, or unsolicited commercial messages through this website.
        </p>

        <h2 className="text-lg font-bold text-slate-900">4. Cookies &amp; Advertising Readiness</h2>
        <p>
          Standard non-identifying technical cookies may be utilized for session maintenance and to deliver relevant, privacy-compliant advertisements through Google AdSense. Third-party advertising vendors, including Google, use cookies to serve ads based on prior visits.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          Terms &amp; Conditions
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms of Service</h1>
        <p className="text-base text-slate-600">
          Terms governing the use of the Am I Eligible? website.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you accept and agree to be bound by these terms, our statutory disclaimer, and our privacy policy.
        </p>

        <h2 className="text-lg font-bold text-slate-900">2. Permitted Use</h2>
        <p>
          The service is provided free of charge for Indian students, job seekers, educators, and parents. Automated scraping, malicious querying, or denial-of-service attempts are strictly prohibited.
        </p>

        <h2 className="text-lg font-bold text-slate-900">3. Accuracy of User Information</h2>
        <p>
          The accuracy of eligibility results depends entirely on the accuracy of the user&rsquo;s inputs (Date of Birth, category, marks, subjects). The platform bears no responsibility for discrepancies caused by incorrect user entries.
        </p>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3 text-center">
        <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Contact &amp; Error Reporting</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Have an inquiry, noticed an update in an official recruitment gazette, or want to suggest an examination to add to our database?
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-emerald-900">Message Received</h3>
            <p className="text-xs text-emerald-700">
              Thank you for reaching out. Our editorial team will review the submitted information against the latest gazette.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Aspirant Name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="aspirant@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Topic</label>
              <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm">
                <option>Report Eligibility Rule Correction / Official Gazette Update</option>
                <option>Suggest a New Exam / Admission Route to Add</option>
                <option>General Feedback &amp; Suggestions</option>
                <option>Partnership / Editorial Inquiry</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Details &amp; Official Gazette Link</label>
              <textarea
                rows={4}
                required
                placeholder="Please describe the correction or suggestion and include the official notification link if available..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
