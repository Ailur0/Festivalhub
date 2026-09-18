import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { createAccount, findAccount } from '../../../utils/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// mode is 'login' (/login-registration) or 'register' (/signup)
const AuthCard = ({ mode, onAuthSuccess }) => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    username: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors?.[field] || errors?.general) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
        general: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'login') {
      if (!formData?.emailOrPhone?.trim()) {
        newErrors.emailOrPhone = 'Email or phone is required';
      }
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      }
    } else {
      if (!formData?.username?.trim()) {
        newErrors.username = 'Username is required';
      }
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!EMAIL_PATTERN.test(formData?.email?.trim())) {
        newErrors.email = 'Enter a valid email address';
      }
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < MIN_PASSWORD_LENGTH) {
        newErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
      }
      if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData?.acceptTerms) {
        newErrors.acceptTerms = 'Please accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const user = await findAccount(formData?.emailOrPhone, formData?.password);
        if (user) {
          onAuthSuccess(user);
        } else {
          setErrors({
            general: 'No account matches that email/phone and password.'
          });
        }
      } else {
        const user = await createAccount({
          name: formData?.username,
          email: formData?.email,
          phone: formData?.phone,
          password: formData?.password
        });
        onAuthSuccess(user);
      }
    } catch (error) {
      setErrors({ general: error?.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const tabClassName = (tab) => `flex-1 py-4 px-6 text-sm font-medium text-center transition-micro ${
    mode === tab ? 'text-primary border-b-2 border-primary bg-accent/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
  }`;

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-xl festival-shadow-lg border border-border overflow-hidden">
      {/* Tab Headers: keep where the visitor was heading when switching pages */}
      <div className="flex border-b border-border">
        <Link to="/login-registration" state={location?.state} replace className={tabClassName('login')}>
          <Icon name="LogIn" size={16} className="inline mr-2" />
          Sign In
        </Link>
        <Link to="/signup" state={location?.state} replace className={tabClassName('register')}>
          <Icon name="UserPlus" size={16} className="inline mr-2" />
          Sign Up
        </Link>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {errors?.general && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md" role="alert">
            <p className="text-sm text-error">{errors?.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {mode === 'login' ? (
            <>
              <Input
                label="Email or Phone"
                type="text"
                placeholder="Enter your email or phone number"
                autoComplete="username"
                value={formData?.emailOrPhone}
                onChange={(e) => handleInputChange('emailOrPhone', e?.target?.value)}
                error={errors?.emailOrPhone}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData?.password}
                  onChange={(e) => handleInputChange('password', e?.target?.value)}
                  error={errors?.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                iconName="LogIn"
                iconPosition="left"
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              <Input
                label="Username"
                type="text"
                placeholder="Choose a username"
                autoComplete="name"
                value={formData?.username}
                onChange={(e) => handleInputChange('username', e?.target?.value)}
                error={errors?.username}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="Enter your phone number"
                autoComplete="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={`Create a password (${MIN_PASSWORD_LENGTH}+ characters)`}
                  autoComplete="new-password"
                  value={formData?.password}
                  onChange={(e) => handleInputChange('password', e?.target?.value)}
                  error={errors?.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={formData?.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
                  error={errors?.confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>

              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                checked={formData?.acceptTerms}
                onChange={(e) => handleInputChange('acceptTerms', e?.target?.checked)}
                error={errors?.acceptTerms}
                required
              />

              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                iconName="UserPlus"
                iconPosition="left"
              >
                Create Account
              </Button>
            </>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              New to FestivalHub?{' '}
              <Link to="/signup" state={location?.state} replace className="text-primary hover:text-primary/80 transition-micro">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login-registration" state={location?.state} replace className="text-primary hover:text-primary/80 transition-micro">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthCard;
