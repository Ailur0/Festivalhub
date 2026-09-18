import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import RequireAuth from "components/RequireAuth";
import NotFound from "pages/NotFound";
import GroupManagement from './pages/group-management';
import LoginRegistration from './pages/login-registration';
import UserDashboard from './pages/user-dashboard';
import FinancialDashboard from './pages/financial-dashboard';
import CommunityMarketplace from './pages/community-marketplace';
import GroupSettingsPrivacy from './pages/group-settings-privacy';

const Routes = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CommunityMarketplace />} />
        <Route path="/group-management" element={<RequireAuth><GroupManagement /></RequireAuth>} />
        <Route path="/login-registration" element={<LoginRegistration />} />
        <Route path="/signup" element={<LoginRegistration mode="register" />} />
        <Route path="/user-dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
        <Route path="/financial-dashboard" element={<RequireAuth><FinancialDashboard /></RequireAuth>} />
        <Route path="/community-marketplace" element={<CommunityMarketplace />} />
        <Route path="/group-settings-privacy" element={<RequireAuth><GroupSettingsPrivacy /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
