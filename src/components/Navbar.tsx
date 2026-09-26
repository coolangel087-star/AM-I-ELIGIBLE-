import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { useSavedOpportunities } from '../context/SavedOpportunitiesContext.tsx';
import {
  Compass,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Menu,
  X,
  Lock,
  Search,
  Bookmark,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { path, navigate } = useRouter();
  const { savedCount } = useSavedOpportunities();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Check Eligibility', href: '/check-eligibility', icon: CheckCircle2, highlight: true },
    { label: 'Explore Exams', href: '/explore', icon: Compass },
    { label: 'College & Courses', href: '/college-eligibility', icon: GraduationCap },
    { label: 'About & Policy', href: '/about', icon: BookOpen },
  ];

  const handleNav = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Am I Eligible?
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">
                  India
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Universal Opportunity &amp; Exam Checker
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = path === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : link.highlight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight && !isActive ? 'text-white' : ''}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* Saved Opportunities Button */}
            <button
              onClick={() => handleNav('/saved')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                path === '/saved'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Saved Opportunities (Bookmarks)"
            >
              <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="bg-amber-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('/admin')}
              title="Admin Portal"
              className={`p-2 rounded-lg transition-colors ml-1 ${
                path.startsWith('/admin')
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Lock className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile navigation actions */}
          <div className="flex items-center md:hidden gap-1.5">
            <button
              onClick={() => handleNav('/saved')}
              className="p-2 text-slate-600 hover:text-slate-900 relative rounded-lg border border-slate-200"
              title="Saved Opportunities"
              aria-label="Saved Opportunities"
            >
              <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('/check-eligibility')}
              className="bg-indigo-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm"
            >
              Check Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = path === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5 text-indigo-600" />
                <span>{link.label}</span>
              </button>
            );
          })}
          {/* Saved Opportunities in mobile menu */}
          <button
            onClick={() => handleNav('/saved')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-medium ${
              path === '/saved'
                ? 'bg-amber-50 text-amber-900 font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-5 h-5 text-amber-600" />
              <span>Saved Opportunities</span>
            </div>
            {savedCount > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => handleNav('/explore?educationLevel=class10')}
              className="text-slate-600 hover:underline"
            >
              After 10th
            </button>
            <button
              onClick={() => handleNav('/explore?educationLevel=class12')}
              className="text-slate-600 hover:underline"
            >
              After 12th
            </button>
            <button
              onClick={() => handleNav('/explore?educationLevel=graduate')}
              className="text-slate-600 hover:underline"
            >
              After Degree
            </button>
            <button
              onClick={() => handleNav('/admin')}
              className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
            >
              <Lock className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
