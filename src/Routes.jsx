import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import GroupManagement from './pages/group-management';
import LoginRegistration from './pages/login-registration';
import UserDashboard from './pages/user-dashboard';
import FinancialDashboard from './pages/financial-dashboard';
import CommunityMarketplace from './pages/community-marketplace';
import GroupSettingsPrivacy from './pages/group-settings-privacy';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CommunityMarketplace />} />
        <Route path="/group-management" element={<GroupManagement />} />
        <Route path="/login-registration" element={<LoginRegistration />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/financial-dashboard" element={<FinancialDashboard />} />
        <Route path="/community-marketplace" element={<CommunityMarketplace />} />
        <Route path="/group-settings-privacy" element={<GroupSettingsPrivacy />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
