import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    toast.success('OTP sent successfully!');
    setShowOtpInput(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMethod === 'otp') {
      if (otp.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP');
        return;
      }
    } else {
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }

    login();
    toast.success('Login successful!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-600 mt-2">Login to your Billing Baba account</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              authMethod === 'otp' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => {
              setAuthMethod('otp');
              setShowOtpInput(false);
            }}
          >
            Login with OTP
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              authMethod === 'password' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => {
              setAuthMethod('password');
              setShowOtpInput(false);
            }}
          >
            Login with Password
          </button>
        </div>

        <form onSubmit={authMethod === 'otp' && !showOtpInput ? handleSendOtp : handleLogin}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                disabled={authMethod === 'otp' && showOtpInput}
                required
              />
            </div>
          </div>

          {authMethod === 'otp' && showOtpInput && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              <button
                type="button"
                className="text-blue-500 text-sm mt-2 hover:text-blue-600"
                onClick={() => {
                  toast.success('OTP resent successfully!');
                }}
              >
                Resend OTP
              </button>
            </div>
          )}

          {authMethod === 'password' && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {authMethod === 'otp' 
              ? (showOtpInput ? 'Login' : 'Send OTP')
              : 'Login'
            }
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;