import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (rememberMe) {
        localStorage.setItem('cx_token', data.token);
      }
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName, email: emailOrUsername, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      localStorage.setItem('cx_token', data.token);
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone) return setError('Please enter a valid phone number');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      await res.json();
      setOtpSent(true);
    } catch (err: any) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');

      localStorage.setItem('cx_token', data.token);
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'alex_google@mingleloop.io',
          name: 'Alex Morgan Google',
          googleId: '10984218731',
          picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        }),
      });
      const data = await res.json();
      localStorage.setItem('cx_token', data.token);
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError('Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-all"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/30">
            <Sparkles size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to MingleLoop</h2>
          <p className="text-xs text-slate-400 mt-1">Social & Messaging Network</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-slate-800/80 p-1 rounded-2xl mb-6">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              authMode === 'login' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              authMode === 'signup' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setAuthMode('otp')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              authMode === 'otp' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  placeholder="alex@connectx.io or alex_connect"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  placeholder="Password123!"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-purple-400 hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all text-sm"
            >
              {loading ? 'Authenticating...' : 'Login to ConnectX'}
            </button>
          </form>
        )}

        {authMode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Full Name</label>
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Username</label>
              <input
                type="text"
                required
                placeholder="alex_connect"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Email</label>
              <input
                type="email"
                required
                placeholder="alex@connectx.io"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Password</label>
              <input
                type="password"
                required
                placeholder="Password123!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg transition-all text-sm mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {authMode === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Mobile Phone Number</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3 text-slate-500" size={18} />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (415) 555-2671"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl text-sm outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold"
                >
                  {otpSent ? 'Resend' : 'Send Code'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="text-xs text-emerald-400 mb-1 block font-medium">
                  Enter 6-digit OTP (Use test code: 123456)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-center text-lg tracking-widest font-mono"
                />
              </div>
            )}

            {otpSent && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm"
              >
                Verify Phone OTP & Enter
              </button>
            )}
          </form>
        )}

        {/* Third Party OAuth */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-slate-200 font-medium text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
