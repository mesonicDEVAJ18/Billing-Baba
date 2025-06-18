import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, User, Mail, ArrowRight, Check, RotateCcw, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { sendOtp, register } from '../api';

// Phone input component
const PhoneInput = ({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled?: boolean }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(cleaned);
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    
    if (!match) return phoneNumber;
    
    const parts = match.slice(1).filter(Boolean);
    return parts.join('-');
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Phone className="h-5 w-5 text-gray-400" />
      </div>
      <div className="absolute inset-y-0 left-11 flex items-center pointer-events-none">
        <span className="text-gray-500 font-medium">+91</span>
      </div>
      <input
        type="tel"
        className="block w-full pl-24 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
        placeholder="Enter your phone number"
        value={formatPhoneNumber(value)}
        onChange={handleChange}
        disabled={disabled}
        required
      />
    </div>
  );
};

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpId, setOtpId] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  
  const otpInputRefs = Array(6).fill(0).map(() => useRef<HTMLInputElement>(null));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.phone.replace(/\D/g, '').length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await sendOtp(formData.phone);
      if (response.data.success) {
        setOtpId(response.data.otp_id);
        setShowOtpInput(true);
        toast.success('OTP sent successfully!');
        if (otpInputRefs[0].current) {
          otpInputRefs[0].current.focus();
        }
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value !== '' && index < 5 && otpInputRefs[index + 1].current) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      const lastIndex = Math.min(pastedData.length, 5);
      otpInputRefs[lastIndex].current?.focus();
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await sendOtp(formData.phone);
      if (response.data.success) {
        setOtpId(response.data.otp_id);
        toast.success('OTP resent successfully!');
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: otpValue,
        otp_id: otpId
      });
      
      if (response.data.success) {
        const { user, tokens } = response.data;
        login(user, tokens);
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        toast.error(response.data.message || 'Failed to create account');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transition-all duration-300 animate-fadeIn">
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mr-3">
            <Briefcase className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
              Billing Baba
            </h1>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join Billing Baba to manage your business</p>
        </div>

        {!showOtpInput ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number
              </label>
              <PhoneInput 
                value={formData.phone}
                onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-amber-500 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Send OTP <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="animate-fadeIn">
            <div className="mb-6">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Verify OTP
                </label>
                <span className="text-sm text-gray-500">
                  Sent to: {formData.phone.replace(/(\d{3})(\d{3})(\d{4})/, '+91 $1-$2-$3')}
                </span>
              </div>
              
              <div className="flex justify-between mb-2 gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpInputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-full h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                ))}
              </div>
              
              <button
                type="button"
                disabled={isLoading}
                className="text-red-600 text-sm hover:text-red-700 flex items-center disabled:text-gray-400"
                onClick={handleResendOtp}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-amber-500 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Create Account <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:text-red-800 font-medium transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;