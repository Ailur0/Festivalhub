import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuthCard = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpData, setOtpData] = useState({
    method: '',
    contact: '',
    code: ''
  });

  const mockCredentials = {
    email: "admin@festivalhub.com",
    password: "Festival@123",
    phone: "+1-555-0123",
    otp: "123456"
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === 'login') {
      if (!formData?.email && !formData?.phone) {
        newErrors.email = 'Email or phone is required';
      }
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      }
    } else {
      if (!formData?.username) {
        newErrors.username = 'Username is required';
      }
      if (!formData?.email) {
        newErrors.email = 'Email is required';
      }
      if (!formData?.password) {
        newErrors.password = 'Password is required';
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
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (activeTab === 'login') {
        const isValidEmail = formData?.email === mockCredentials?.email;
        const isValidPassword = formData?.password === mockCredentials?.password;
        const isValidPhone = formData?.phone === mockCredentials?.phone;

        if ((isValidEmail || isValidPhone) && isValidPassword) {
          onAuthSuccess({
            name: 'Festival Admin',
            email: mockCredentials?.email,
            phone: mockCredentials?.phone,
            role: 'admin'
          });
        } else {
          setErrors({
            general: `Invalid credentials. Use email: ${mockCredentials?.email}, password: ${mockCredentials?.password} or phone: ${mockCredentials?.phone}`
          });
        }
      } else {
        onAuthSuccess({
          name: formData?.username,
          email: formData?.email,
          phone: formData?.phone || '+1-555-0124',
          role: 'member'
        });
      }
    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpRequest = (method) => {
    const contact = method === 'email' ? formData?.email : formData?.phone;
    if (!contact) {
      setErrors({
        [method]: `${method === 'email' ? 'Email' : 'Phone'} is required for OTP verification`
      });
      return;
    }

    setOtpData({
      method,
      contact,
      code: ''
    });
    setShowOtpModal(true);
  };

  const handleOtpVerification = async () => {
    if (otpData?.code === mockCredentials?.otp) {
      setShowOtpModal(false);
      onAuthSuccess({
        name: 'Festival User',
        email: formData?.email || 'user@festivalhub.com',
        phone: formData?.phone || mockCredentials?.phone,
        role: 'member'
      });
    } else {
      setErrors({
        otp: `Invalid OTP. Use: ${mockCredentials?.otp}`
      });
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto bg-card rounded-xl festival-shadow-lg border border-border overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-micro ${
              activeTab === 'login' ?'text-primary border-b-2 border-primary bg-accent/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name="LogIn" size={16} className="inline mr-2" />
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-micro ${
              activeTab === 'register' ?'text-primary border-b-2 border-primary bg-accent/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name="UserPlus" size={16} className="inline mr-2" />
            Register
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {errors?.general && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
              <p className="text-sm text-error">{errors?.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'login' ? (
              <>
                <Input
                  label="Email or Phone"
                  type="text"
                  placeholder="Enter your email or phone number"
                  value={formData?.email || formData?.phone}
                  onChange={(e) => {
                    const value = e?.target?.value;
                    if (value?.includes('@')) {
                      handleInputChange('email', value);
                      handleInputChange('phone', '');
                    } else {
                      handleInputChange('phone', value);
                      handleInputChange('email', '');
                    }
                  }}
                  error={errors?.email}
                  required
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData?.password}
                    onChange={(e) => handleInputChange('password', e?.target?.value)}
                    error={errors?.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
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

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOtpRequest('email')}
                    iconName="Mail"
                    iconPosition="left"
                  >
                    Email OTP
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOtpRequest('phone')}
                    iconName="Phone"
                    iconPosition="left"
                  >
                    SMS OTP
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Input
                  label="Username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData?.username}
                  onChange={(e) => handleInputChange('username', e?.target?.value)}
                  error={errors?.username}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  required
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData?.password}
                    onChange={(e) => handleInputChange('password', e?.target?.value)}
                    error={errors?.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
                  >
                    <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData?.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
                    error={errors?.confirmPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
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

          {activeTab === 'login' && (
            <div className="mt-4 text-center">
              <button className="text-sm text-primary hover:text-primary/80 transition-micro">
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </div>
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4">
          <div className="bg-card rounded-lg festival-shadow-xl border border-border w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground font-heading">
                  Verify OTP
                </h3>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-micro"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                We've sent a verification code to {otpData?.contact}
              </p>

              <Input
                label="Verification Code"
                type="text"
                placeholder="Enter 6-digit code"
                value={otpData?.code}
                onChange={(e) => setOtpData(prev => ({ ...prev, code: e?.target?.value }))}
                error={errors?.otp}
                maxLength={6}
              />

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowOtpModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  onClick={handleOtpVerification}
                  iconName="Check"
                  iconPosition="left"
                >
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthCard;