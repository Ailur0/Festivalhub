import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { signIn } from '../../utils/auth';
import AuthCard from './components/AuthCard';
import SocialProof from './components/SocialProof';
import LanguageSelector from './components/LanguageSelector';
import FestivalBackground from './components/FestivalBackground';

// mode is 'login' (/login-registration) or 'register' (/signup)
const LoginRegistration = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleAuthSuccess = (userData) => {
    signIn(userData);

    // Show success toast
    setShowSuccessToast(true);

    // Return to the page that required sign-in, or the dashboard
    setTimeout(() => {
      navigate(location?.state?.from?.pathname || '/user-dashboard', { replace: true });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-20 bg-card/95 backdrop-blur-sm border-b border-border festival-shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Calendar" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-heading">
                  FestivalHub
                </h1>
                <p className="text-xs text-muted-foreground">
                  Festival Management Platform
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="lg:grid lg:grid-cols-2 lg:min-h-[calc(100vh-80px)]">
          {/* Left Side - Background (Desktop Only) */}
          <FestivalBackground />

          {/* Right Side - Authentication Form */}
          <div className="flex flex-col justify-center px-4 py-8 lg:px-8 lg:py-12">
            <div className="w-full max-w-md mx-auto space-y-8">
              {/* Welcome Text */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground font-heading">
                  {mode === 'login' ? 'Welcome to FestivalHub' : 'Create your FestivalHub account'}
                </h2>
                <p className="text-muted-foreground">
                  {mode === 'login'
                    ? 'Streamline your festival planning and management'
                    : 'Plan festivals, share costs and find vendors with your community'}
                </p>
              </div>

              {/* Authentication Card: keyed so switching pages starts a fresh form */}
              <AuthCard key={mode} mode={mode} onAuthSuccess={handleAuthSuccess} />

              {/* Social Proof - Mobile/Tablet Only */}
              <div className="lg:hidden">
                <SocialProof />
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof - Desktop Only */}
        <div className="hidden lg:block bg-muted/30 border-t border-border">
          <div className="container mx-auto px-8 py-12">
            <div className="max-w-4xl mx-auto">
              <SocialProof />
            </div>
          </div>
        </div>
      </main>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-100 animate-slide-down">
          <div className="bg-success text-success-foreground px-6 py-3 rounded-lg festival-shadow-lg flex items-center space-x-3">
            <Icon name="CheckCircle" size={20} />
            <span className="font-medium">
              {mode === 'login' ? 'Signed in! Redirecting...' : 'Account created! Redirecting...'}
            </span>
          </div>
        </div>
      )}

      {/* Loading Overlay (if needed) */}
      <div className="fixed inset-0 bg-black/5 pointer-events-none" />
    </div>
  );
};

export default LoginRegistration;