import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Check, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp, login as apiLogin, getProfile } from '../api';

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
    return match.slice(1).filter(Boolean).join('-');
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

const Login: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoLoggingIn, setAutoLoggingIn] = useState(true);
  const [otpId, setOtpId] = useState('');

  const navigate = useNavigate();
  const { login, setToken } = useAuth();

  const otpInputRefs = Array(6).fill(0).map(() => useRef<HTMLInputElement>(null));

  useEffect(() => {
  const tryAutoLogin = async () => {
    const trusted = localStorage.getItem('trustedToken');
    if (!trusted) return setAutoLoggingIn(false);

    try {
      const { token, expires } = JSON.parse(trusted);
      if (new Date() > new Date(expires)) {
        localStorage.removeItem('trustedToken');
        return setAutoLoggingIn(false);
      }

      setToken(token);
      const res = await getProfile();
      login(res.data.user);
      toast.success('Auto-logged in');
      navigate('/');
    } catch (err) {
      console.warn('Auto-login failed:', err);
      localStorage.removeItem('trustedToken');
    } finally {
      setAutoLoggingIn(false);
    }
  };

  tryAutoLogin();
}, []);

  const persistTrustedLogin = (token: string) => {
    if (trustDevice) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      localStorage.setItem('trustedToken', JSON.stringify({
        token,
        expires: expiry.toISOString()
      }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpInputRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    if (pasted.length > 0) otpInputRefs[Math.min(pasted.length, 5)].current?.focus();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return toast.error('Enter a valid 10-digit phone number');
    setIsLoading(true);
    try {
      const res = await sendOtp(phone);
      setOtpId(res.data.otp_id);
      setShowOtpInput(true);
      toast.success('OTP sent!');
      otpInputRefs[0].current?.focus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await sendOtp(phone);
      setOtpId(res.data.otp_id);
      toast.success('OTP resent!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Resend failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'otp') {
      const code = otp.join('');
      if (code.length !== 6) return toast.error('Enter 6-digit OTP');
      setIsLoading(true);
      try {
        const res = await verifyOtp({ phone, otp: code, otp_id: otpId });
        const { access_token, user } = res.data;
        setToken(access_token);
        login(user);
        persistTrustedLogin(access_token);
        toast.success('Logged in!');
        navigate('/');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Invalid OTP');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (password.length < 6) return toast.error('Password too short');
      setIsLoading(true);
      try {
        const res = await apiLogin({ phone, password });
        const { access_token, user } = res.data;
        setToken(access_token);
        login(user);
        persistTrustedLogin(access_token);
        toast.success('Logged in!');
        navigate('/');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (autoLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
        <div className="text-center mb-6">
          <Briefcase className="mx-auto h-10 w-10 text-red-600" />
          <h1 className="text-2xl font-bold text-red-600">Billing Baba</h1>
          <p className="text-gray-500">Login to continue</p>
        </div>

        <div className="flex mb-4 bg-gray-100 rounded p-1">
          <button onClick={() => { setAuthMethod('otp'); setShowOtpInput(false); }}
            className={`flex-1 py-2 rounded text-sm font-medium ${authMethod === 'otp' ? 'bg-white text-red-600' : 'text-gray-600'}`}>OTP</button>
          <button onClick={() => { setAuthMethod('password'); setShowOtpInput(false); }}
            className={`flex-1 py-2 rounded text-sm font-medium ${authMethod === 'password' ? 'bg-white text-red-600' : 'text-gray-600'}`}>Password</button>
        </div>

        {authMethod === 'otp' && !showOtpInput && (
          <form onSubmit={handleSendOtp}>
            <PhoneInput value={phone} onChange={setPhone} disabled={isLoading} />
            <button disabled={isLoading} type="submit" className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center">
              {isLoading ? 'Sending...' : <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>}
            </button>
          </form>
        )}

        {authMethod === 'otp' && showOtpInput && (
          <form onSubmit={handleLogin}>
            <label className="block text-gray-700 text-sm font-medium mb-2">Enter OTP</label>
            <div className="flex gap-2 mb-2">
              {otp.map((digit, idx) => (
                <input key={idx} ref={otpInputRefs[idx]} maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={idx === 0 ? handleOtpPaste : undefined}
                  className="w-full h-12 text-center text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ))}
            </div>
            <button type="button" onClick={handleResendOtp} className="text-red-500 text-sm mb-2">Resend OTP</button>
            {/* <div className="flex items-center mb-4">
              <input id="trustDevice" type="checkbox" checked={trustDevice} onChange={(e) => setTrustDevice(e.target.checked)} className="mr-2" />
              <label htmlFor="trustDevice" className="text-sm text-gray-600">Trust this device for 30 days</label>
            </div> */}
            <button disabled={isLoading} type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg flex items-center justify-center">
              {isLoading ? 'Logging in...' : <>Verify & Login <Check className="ml-2 h-4 w-4" /></>}
            </button>
          </form>
        )}

        {authMethod === 'password' && (
          <form onSubmit={handleLogin}>
            <PhoneInput value={phone} onChange={setPhone} disabled={isLoading} />
            <input type="password" className="mt-4 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex items-center mt-2 mb-4">
              <input id="trustDevice" type="checkbox" checked={trustDevice} onChange={(e) => setTrustDevice(e.target.checked)} className="mr-2" />
              <label htmlFor="trustDevice" className="text-sm text-gray-600">Trust this device for 30 days</label>
            </div>
            <button disabled={isLoading} type="submit" className="w-full mt-2 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center">
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-red-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;