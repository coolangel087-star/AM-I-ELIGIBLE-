import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { getOpportunities, getCategories } from '../services/api.ts';
import { Opportunity } from '../types.ts';
import { OpportunityCard } from '../components/OpportunityCard.tsx';
import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Building,
  GraduationCap,
  Sparkles,
  Search,
  Check,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [popularOpps, setPopularOpps] = useState<Opportunity[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    Promise.all([getOpportunities(), getCategories()])
      .then(([oppsData, catsData]) => {
        setPopularOpps(oppsData.opportunities.slice(0, 6));
        setCategoryCounts(catsData.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/explore?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const categories = [
    { name: 'Defence', desc: 'NDA, CDS, AFCAT, Coast Guard, Agniveer', count: categoryCounts['Defence'] || 4 },
    { name: 'UPSC', desc: 'Civil Services (IAS/IPS), Forest Service, CAPF', count: categoryCounts['UPSC'] || 3 },
    { name: 'SSC', desc: 'SSC CGL, CHSL, MTS, CPO, Stenographer', count: categoryCounts['SSC'] || 3 },
    { name: 'Banking & Finance', desc: 'IBPS PO, SBI PO, RBI Grade B, Clerk', count: categoryCounts['Banking & Finance'] || 2 },
    { name: 'Railways', desc: 'RRB NTPC, ALP, Technician, Group D', count: categoryCounts['Railways'] || 1 },
    { name: 'Engineering', desc: 'JEE Main, JEE Advanced, GATE', count: categoryCounts['Engineering'] || 1 },
    { name: 'Medical', desc: 'NEET UG, Allied Health, Nursing', count: categoryCounts['Medical'] || 1 },
    { name: 'Maritime', desc: 'IMU-CET, Merchant Navy, DNS', count: categoryCounts['Maritime'] || 1 },
    { name: 'Law', desc: 'CLAT UG/PG, AILET, 5-Year Integrated LLB', count: categoryCounts['Law'] || 1 },
    { name: 'Management', desc: 'CAT, IPMAT (IIM Indore/Rohtak)', count: categoryCounts['Management'] || 1 },
    { name: 'College & University Admissions', desc: 'CUET UG (DU, BHU, JNU, Central Univs)', count: categoryCounts['College & University Admissions'] || 1 },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-100/80 border border-indigo-200 text-indigo-800 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Independent Rules-Based Engine &bull; Strictly Official Notification Criteria</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Am I Eligible?
            </h1>
            <p className="text-lg sm:text-2xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Check exams, colleges, courses and career opportunities you may be eligible for — all in one place.
            </p>
          </div>

          {/* Key Value Prop Notice */}
          <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 sm:p-5 max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 shadow-sm text-left flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-900 font-semibold">Enter your details once.</strong>{' '}
              Instantly check your eligibility across Defence (NDA/CDS/AFCAT), Civil Services (UPSC), Staff Selection (SSC), Banking, Railways, Engineering, Medical, Law, and 250+ university admissions.
            </p>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => navigate('/check-eligibility')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Check My Eligibility</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Explore Exams &amp; Opportunities</span>
            </button>
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-4">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Search NDA, SSC CGL, NEET, Merchant Navy, CUET, IBPS..."
                className="w-full pl-12 pr-28 py-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Education Level Navigation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Check By Your Current Stage
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Available opportunities change dramatically based on your education level. Choose your current qualification to explore.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {[
            { level: 'class10', title: 'After Class 10', subtitle: 'SSC MTS, Agniveer, ITI & Apprentice', color: 'from-amber-500/10 to-amber-500/5 text-amber-900 border-amber-200' },
            { level: 'class12', title: 'After Class 12', subtitle: 'NDA, JEE, NEET, CUET, CHSL, Navy', color: 'from-blue-500/10 to-blue-500/5 text-blue-900 border-blue-200' },
            { level: 'diploma', title: 'After Diploma', subtitle: 'Lateral Entry B.Tech, RRB JE, PSUs', color: 'from-emerald-500/10 to-emerald-500/5 text-emerald-900 border-emerald-200' },
            { level: 'graduate', title: 'After Graduation', subtitle: 'UPSC CSE, SSC CGL, CDS, Bank PO, CAT', color: 'from-indigo-500/10 to-indigo-500/5 text-indigo-900 border-indigo-200' },
            { level: 'postgraduate', title: 'After Postgrad', subtitle: 'UGC NET, Specialist Officer, Lecturer', color: 'from-purple-500/10 to-purple-500/5 text-purple-900 border-purple-200' },
          ].map((item) => (
            <button
              key={item.level}
              onClick={() => navigate(`/explore?educationLevel=${item.level}`)}
              className={`p-4 sm:p-5 rounded-xl border bg-gradient-to-br ${item.color} text-left transition-all hover:scale-102 hover:shadow-md cursor-pointer`}
            >
              <h3 className="font-bold text-base sm:text-lg">{item.title}</h3>
              <p className="text-xs opacity-80 mt-1 line-clamp-2 leading-relaxed">{item.subtitle}</p>
              <span className="inline-block mt-3 text-xs font-semibold underline">
                Browse routes &rarr;
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* How it Works / Transparency Promise */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Objective Information Only
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How the Universal Eligibility Engine Works
            </h2>
            <p className="text-sm text-slate-600">
              This is strictly an eligibility-information platform, not a career recommendation engine. We never push careers — we present transparent, verified eligibility criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Enter Details Once</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your Date of Birth, category (General, OBC, SC, ST, EWS), highest education, marks, and Class 12 subjects (PCM, Biology, etc.). No account creation or mobile number required.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Deterministic Rules Evaluation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our engine compares your profile against exact DOB cutoff windows, category age relaxations (+3 yrs OBC, +5 yrs SC/ST), minimum qualifying percentages, and mandatory subjects.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Transparent &ldquo;Why?&rdquo; Explanations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every result is clearly labeled (Eligible, Potentially Eligible, Not Eligible) with item-by-item checkmarks. We clearly distinguish official attempt limits from estimated age headroom cycles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore By Sector / Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category &amp; Sector
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Continuously expanding verified database of Indian examinations and recruitment routes.
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/explore?category=${encodeURIComponent(cat.name)}`)}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all text-left group flex items-start justify-between cursor-pointer"
            >
              <div className="space-y-1 pr-3">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 shrink-0">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured / Popular Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Indian Recruitment &amp; Admission Routes
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              High-accuracy records verified against latest UPSC, SSC, NTA, and Ministry gazettes.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularOpps.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onSelect={(slug) => navigate(`/opportunities/${slug}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Common questions about Indian recruitment rules, reservation age relaxations, and notifications.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does the system distinguish official attempt limits from remaining opportunities?',
              a: 'Some examinations enforce an explicit cap on attempts (e.g. UPSC CSE allows 6 for General, 9 for OBC, unlimited for SC/ST; JEE Advanced allows 2 consecutive attempts). Where no fixed limit is stated (e.g. SSC CGL, NDA, CDS, IBPS), we clearly calculate estimated upcoming cycles based on your age headroom and exam frequency, and explicitly state that future eligibility depends on the notification for each cycle.',
            },
            {
              q: 'Is category age relaxation applicable to all exams?',
              a: 'No. While Civil Services and SSC offer 3 years for OBC and 5 years for SC/ST, defence academy entries like NDA and CDS (IMA/INA/AFA) do NOT provide any age relaxation for reserved categories under Ministry of Defence regulations.',
            },
            {
              q: 'Can final-year college students apply for graduate-level exams?',
              a: 'Yes, for most premier exams including UPSC CSE, CDS, and SSC CGL, candidates appearing in their final year can apply, provided they produce proof of having passed the degree by the date stipulated in the notification.',
            },
            {
              q: 'Are official sources and notification dates verified?',
              a: 'Yes. Every opportunity stored in our database includes the conducting body, exact notification reference cycle, last verified date, and a direct link to the official government or testing agency portal.',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span>{item.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-7 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prominent Statutory Disclaimer Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm sm:text-base">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Important Statutory Disclaimer</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            &ldquo;This website provides eligibility information for educational and informational purposes. Eligibility criteria, age limits, dates, reservation rules, vacancies, cutoffs and other requirements may change between recruitment/admission cycles. Always verify the latest official notification or admission information before applying.&rdquo;
          </p>
          <div className="pt-2 text-xs text-slate-500">
            Am I Eligible? is an independent information tool and does not represent or act on behalf of any government department or recruitment commission.
          </div>
        </div>
      </section>
    </div>
  );
};
