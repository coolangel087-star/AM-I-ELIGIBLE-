/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext.tsx';
import { EligibilityProvider } from './context/EligibilityContext.tsx';
import { SavedOpportunitiesProvider } from './context/SavedOpportunitiesContext.tsx';
import { SubscriptionProvider } from './context/SubscriptionContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { CheckEligibilityPage } from './pages/CheckEligibilityPage.tsx';
import { ResultsDashboardPage } from './pages/ResultsDashboardPage.tsx';
import { ExplorePage } from './pages/ExplorePage.tsx';
import { SavedOpportunitiesPage } from './pages/SavedOpportunitiesPage.tsx';
import { OpportunityDetailPage } from './pages/OpportunityDetailPage.tsx';
import { CollegeEligibilityPage } from './pages/CollegeEligibilityPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import {
  AboutPage,
  EditorialPolicyPage,
  DisclaimerPage,
  PrivacyPolicyPage,
  TermsPage,
  ContactPage,
} from './pages/StaticLegalPages.tsx';

function MainRouter() {
  const { path } = useRouter();

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('admin_token_cache');
    } catch {
      return null;
    }
  });

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    try {
      sessionStorage.setItem('admin_token_cache', token);
    } catch {}
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    try {
      sessionStorage.removeItem('admin_token_cache');
    } catch {}
  };

  // Route matching
  const renderPage = () => {
    const cleanPath = path.split('?')[0].split('#')[0];

    if (cleanPath === '/' || cleanPath === '') {
      return <HomePage />;
    }
    if (cleanPath === '/check-eligibility') {
      return <CheckEligibilityPage />;
    }
    if (cleanPath === '/results') {
      return <ResultsDashboardPage />;
    }
    if (cleanPath === '/explore') {
      return <ExplorePage />;
    }
    if (cleanPath === '/saved' || cleanPath === '/saved-opportunities') {
      return <SavedOpportunitiesPage />;
    }
    if (cleanPath.startsWith('/opportunities/')) {
      return <OpportunityDetailPage />;
    }
    if (cleanPath === '/college-eligibility') {
      return <CollegeEligibilityPage />;
    }
    if (cleanPath === '/admin') {
      if (adminToken) {
        return <AdminDashboardPage adminToken={adminToken} onLogout={handleAdminLogout} />;
      }
      return <AdminLoginPage onLoginSuccess={handleAdminLogin} />;
    }
    if (cleanPath === '/about') {
      return <AboutPage />;
    }
    if (cleanPath === '/editorial-policy') {
      return <EditorialPolicyPage />;
    }
    if (cleanPath === '/disclaimer') {
      return <DisclaimerPage />;
    }
    if (cleanPath === '/privacy-policy') {
      return <PrivacyPolicyPage />;
    }
    if (cleanPath === '/terms') {
      return <TermsPage />;
    }
    if (cleanPath === '/contact') {
      return <ContactPage />;
    }

    // Fallback
    return <HomePage />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <EligibilityProvider>
        <SavedOpportunitiesProvider>
          <SubscriptionProvider>
            <MainRouter />
          </SubscriptionProvider>
        </SavedOpportunitiesProvider>
      </EligibilityProvider>
    </RouterProvider>
  );
}
