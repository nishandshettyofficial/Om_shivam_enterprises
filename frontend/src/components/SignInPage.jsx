import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SignIn, SignUp } from '@clerk/react';
import { useGoogleLogin } from '@react-oauth/google';
import {
  Phone,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export default function SignInPage() {
  const { login, register, loginWithGoogle, setCurrentView } = useAuth();

  // Auth Method: 'clerk' | 'direct'
  const [authMethod, setAuthMethod] = useState('clerk');

  // Mode for direct store PIN auth: 'signin' | 'register'
  const [mode, setMode] = useState('signin');

  // Form Inputs
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Live Google OAuth (standalone fallback)
  const hasLiveGoogleClientId = Boolean(
    import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    import.meta.env.VITE_GOOGLE_CLIENT_ID.trim().length > 15 &&
    !import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('placeholder')
  );

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const profile = await res.json();

        loginWithGoogle({
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture
        });
      } catch (err) {
        setError('Failed to sign in with Google. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed.');
    }
  });

  const handleGoogleClick = () => {
    setError('');
    setSuccessMsg('');
    if (hasLiveGoogleClientId) {
      triggerGoogleLogin();
    } else {
      loginWithGoogle({
        name: 'Rahul Sharma',
        email: 'customer@gmail.com',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      });
    }
  };

  // Direct login
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!identifier.trim()) {
      setError('Please enter your mobile number, email, or @handle.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password or 4-digit PIN.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        return;
      }

      login(data.user);
    } catch (err) {
      setError('Unable to reach server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // Direct register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password.trim()) {
      setError('Please set a secure 4-digit PIN or password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim(),
          pin: password.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        return;
      }

      register(data.user);
    } catch (err) {
      setError('Unable to reach server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      
      {/* Back to store */}
      <button
        onClick={() => setCurrentView('catalog')}
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-black mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      {/* Auth Method Tabs */}
      <div className="flex items-center justify-center gap-2 mb-6 bg-stone-100 p-1 rounded-2xl max-w-xs mx-auto border border-warm-border">
        <button
          type="button"
          onClick={() => setAuthMethod('clerk')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            authMethod === 'clerk'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Clerk Auth</span>
        </button>
        <button
          type="button"
          onClick={() => setAuthMethod('direct')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            authMethod === 'direct'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
          <span>Store PIN / Direct</span>
        </button>
      </div>

      {/* Main Card */}
      {authMethod === 'clerk' ? (
        <div className="flex justify-center">
          <SignIn routing="hash" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-warm-border p-7 sm:p-9 shadow-sm">
          {/* Brand Header */}
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-[#141416] text-white flex items-center justify-center text-base font-bold mx-auto mb-3">
              OS
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#141416]">
              {mode === 'signin' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {mode === 'signin'
                ? 'Sign in with your mobile number, email, or @handle'
                : 'Enter your details to create your store account'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign-In Fallback Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full bg-white hover:bg-stone-50 active:scale-99 text-stone-800 font-medium text-xs py-3 px-4 rounded-xl border border-warm-border hover:border-stone-400 shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.43l4.03-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-border"></div>
            </div>
            <div className="relative flex justify-center text-[11px] text-stone-400">
              <span className="bg-white px-2">or store account</span>
            </div>
          </div>

          {/* Form Body */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Mobile / Email / @Handle
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="9876543210 or rahul@gmail.com"
                    className="w-full bg-[#FAF9F5] border border-warm-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  PIN or Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter 4-digit PIN or password"
                    className="w-full bg-[#FAF9F5] border border-warm-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#141416] hover:bg-stone-800 text-white font-medium text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Signing in...' : 'Sign In with Store PIN'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-[#FAF9F5] border border-warm-border rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Mobile Number (10 digits)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full bg-[#FAF9F5] border border-warm-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Set 4-Digit Store PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. 1234"
                    maxLength={10}
                    className="w-full bg-[#FAF9F5] border border-warm-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#141416] hover:bg-stone-800 text-white font-medium text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Switch Mode Footer */}
          <div className="mt-6 pt-5 border-t border-warm-border text-center text-xs text-stone-500">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-stone-900 font-semibold underline hover:text-black cursor-pointer ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-stone-900 font-semibold underline hover:text-black cursor-pointer ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
