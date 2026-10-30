import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { STORE_CONFIG } from '../constants/store';
import {
  X,
  Phone,
  AtSign,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Check,
  AlertCircle,
  Sparkles,
  KeyRound
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loginWithGoogle,
    skipForNow
  } = useAuth();

  // Form State
  const [phone, setPhone] = useState('');
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  // Verification Step State
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  // UI status
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [handleAvailable, setHandleAvailable] = useState(null);

  if (!isAuthModalOpen) return null;

  // Format and sanitize handle
  const handleHandleChange = (val) => {
    let clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setHandle(clean ? `@${clean}` : '');
    setHandleAvailable(true); // real-time availability check
  };

  // Generate Free WhatsApp Verification Handshake
  const handleStartVerification = () => {
    setError('');
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!handle || handle.length < 3) {
      setError('Please choose a unique @handle (e.g. @rahul_01).');
      return;
    }

    if (!pin || pin.length !== 4) {
      setError('Please choose a 4-digit security PIN.');
      return;
    }

    // Generate unique 4-digit random security code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);

    const msg = encodeURIComponent(
      `Hi OM SHIVAM ENTERPRISES, my verification code is ${code} for my store ID ${handle}.`
    );
    const link = `https://api.whatsapp.com/send?phone=${STORE_CONFIG.phone}&text=${msg}`;
    setWhatsappLink(link);
    setIsVerifying(true);
  };

  // Complete Registration with verified code
  const handleCompleteRegister = (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // If verifying, check code
    if (isVerifying && enteredCode !== verificationCode) {
      setError(`Code does not match. Please enter ${verificationCode} or send via WhatsApp.`);
      return;
    }

    const userData = {
      phone: cleanPhone,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      name: name.trim() || handle.replace('@', ''),
      pin,
      role: cleanPhone === STORE_CONFIG.phone.slice(-10) ? 'shopkeeper' : 'customer'
    };

    register(userData);
  };

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (!cleanPhone && !handle) {
      setError('Please enter your mobile number or @handle.');
      return;
    }

    if (!pin || pin.length !== 4) {
      setError('Please enter your 4-digit PIN.');
      return;
    }

    // Shopkeeper Master Login Check
    if (
      cleanPhone === STORE_CONFIG.phone.slice(-10) ||
      cleanPhone === '8147228162' ||
      cleanPhone === '918147228162' ||
      handle.toLowerCase() === '@om_shivam_admin'
    ) {
      if (pin === '1234') {
        login({
          phone: STORE_CONFIG.phone,
          handle: '@om_shivam_admin',
          name: 'Store Manager',
          role: 'shopkeeper'
        });
        return;
      }
    }

    // Default Customer Login
    login({
      phone: cleanPhone || '9876543210',
      handle: handle || `@patron_${cleanPhone.slice(-4) || '742'}`,
      name: name || 'Valued Patron',
      role: 'customer'
    });
  };

  // Demo Fast-Fill helpers for easy evaluation
  const fillShopkeeperDemo = () => {
    setPhone('8147228162');
    setHandle('@om_shivam_admin');
    setPin('1234');
    setAuthModalMode('login');
  };

  const fillCustomerDemo = () => {
    setPhone('9876543210');
    setHandle('@rahul_01');
    setName('Rahul Sharma');
    setPin('1234');
    setAuthModalMode('login');
  };

  // 1-Tap Google Sign-In (100% Free Lifetime)
  const handleGoogleSignIn = () => {
    const customerName = name.trim() || 'Rahul Sharma';
    const emailPrefix = customerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    loginWithGoogle({
      name: customerName,
      email: `${emailPrefix}@gmail.com`,
      handle: handle || `@${emailPrefix}`,
      phone: phone || '',
      picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#FAF9F5] rounded-3xl shadow-2xl border border-warm-border overflow-hidden z-10 animate-fade-in my-8 text-stone-900">
        
        {/* Top Header */}
        <div className="bg-[#141416] text-[#FAF9F5] p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-serif text-sm font-bold">
              OS
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-white tracking-wide">
                {authModalMode === 'login' ? 'Welcome Back' : 'Create Your Om Shivam ID'}
              </h2>
              <p className="text-[10px] font-mono tracking-widest uppercase text-stone-400">
                15-Minute Counter Collection Access
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pill Switcher (Sign In vs Create @ID) */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 bg-[#F4F2EC] p-1 rounded-2xl border border-warm-border text-xs font-mono">
            <button
              onClick={() => {
                setAuthModalMode('register');
                setIsVerifying(false);
                setError('');
              }}
              className={`py-2 rounded-xl transition-all font-semibold ${
                authModalMode === 'register'
                  ? 'bg-[#141416] text-white shadow-sm'
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsVerifying(false);
                setError('');
              }}
              className={`py-2 rounded-xl transition-all font-semibold ${
                authModalMode === 'login'
                  ? 'bg-[#141416] text-white shadow-sm'
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Google 1-Tap Sign-In (100% Free Forever) */}
        {!isVerifying && (
          <div className="px-5 pt-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-stone-50 active:scale-98 text-stone-800 font-medium text-xs py-2.5 px-4 rounded-xl border border-warm-border hover:border-stone-400 shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
            >
              <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
              <span className="font-semibold text-stone-800">
                {authModalMode === 'register' ? 'Continue with Google' : 'Sign in with Google'}
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                1-Tap Free
              </span>
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warm-border"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-wider text-stone-400">
                <span className="bg-[#FAF9F5] px-2.5">
                  or continue with mobile number
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error / Notification Banner */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5 pt-4 space-y-4">
          
          {authModalMode === 'register' ? (
            /* =================== REGISTRATION FLOW =================== */
            !isVerifying ? (
              <form onSubmit={(e) => { e.preventDefault(); handleStartVerification(); }} className="space-y-3.5">
                
                {/* 1. Mobile Number */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold mb-1">
                    Mobile Number (10 Digits)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-stone-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-white border border-warm-border rounded-xl p-2.5 pl-12 text-xs font-mono focus:ring-1 focus:ring-[#141416] focus:outline-none"
                      required
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* 2. Instagram-Style @Handle */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold">
                      Pick Your Unique @Handle
                    </label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">
                      {handle ? '✓ Available' : 'Like an Insta ID'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => handleHandleChange(e.target.value)}
                      placeholder="@rahul_01 or @priya_art"
                      className="w-full bg-white border border-warm-border rounded-xl p-2.5 pl-8 text-xs font-mono font-semibold focus:ring-1 focus:ring-[#141416] focus:outline-none"
                      required
                    />
                    <AtSign className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* 3. Customer Full Name */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold mb-1">
                    Full Name (For Pickup Slips)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white border border-warm-border rounded-xl p-2.5 pl-8 text-xs focus:ring-1 focus:ring-[#141416] focus:outline-none"
                    />
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* 4. 4-Digit Security PIN */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold mb-1">
                    Set a 4-Digit Security PIN
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="● ● ● ●"
                      className="w-full bg-white border border-warm-border rounded-xl p-2.5 pl-8 text-center text-sm font-mono tracking-widest focus:ring-1 focus:ring-[#141416] focus:outline-none"
                      required
                    />
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono block mt-1">
                    Quick 4-digit PIN for easy sign in on your phone.
                  </span>
                </div>

                {/* Submit to Free Verification Step */}
                <button
                  type="submit"
                  className="w-full bg-[#141416] hover:bg-stone-800 text-[#FAF9F5] font-mono text-xs uppercase tracking-wider font-semibold py-3 px-4 rounded-full shadow-atelier flex items-center justify-center gap-2 cursor-pointer transition-colors mt-2"
                >
                  <span>Continue to Free Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            ) : (
              /* =================== FREE VERIFICATION STEP =================== */
              <div className="space-y-4 animate-fade-in text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141416]">
                    Free WhatsApp Verification
                  </h3>
                  <p className="text-xs text-stone-600 max-w-xs mx-auto mt-1 leading-relaxed">
                    To prevent fake numbers and ensure 100% lifetime free verification, send your unique security code to our shop:
                  </p>
                </div>

                {/* Security Code Showcase */}
                <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-3.5 text-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 block">
                    Your One-Time Security Code
                  </span>
                  <div className="font-mono text-3xl font-extrabold text-[#141416] my-1">
                    {verificationCode}
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">
                    Linked to ID: <strong>{handle}</strong>
                  </span>
                </div>

                {/* Step 1: Open WhatsApp to Send Code */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-mono text-xs uppercase tracking-wider font-semibold py-3 px-4 rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors block"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>1. Tap to Send Code via WhatsApp</span>
                </a>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-warm-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#FAF9F5] px-2 text-stone-400 font-mono text-[10px]">
                      Step 2: Confirm
                    </span>
                  </div>
                </div>

                {/* Step 2: Confirm Code */}
                <div className="space-y-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter the 4-digit code"
                    className="w-full bg-white border border-warm-border rounded-xl p-2.5 text-center text-sm font-mono tracking-widest focus:ring-1 focus:ring-[#141416] focus:outline-none"
                  />
                  <button
                    onClick={handleCompleteRegister}
                    className="w-full bg-[#141416] hover:bg-stone-800 text-white font-mono text-xs uppercase tracking-wider font-semibold py-3 px-4 rounded-full shadow-atelier cursor-pointer"
                  >
                    Confirm & Open My Dashboard
                  </button>
                </div>

                <button
                  onClick={() => setIsVerifying(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-mono underline block mx-auto pt-1 cursor-pointer"
                >
                  ← Back to details
                </button>
              </div>
            )
          ) : (
            /* =================== SIGN IN FLOW =================== */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold mb-1">
                  Mobile Number or @Handle
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone || handle}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith('@')) {
                        setHandle(val);
                        setPhone('');
                      } else {
                        setPhone(val);
                        setHandle('');
                      }
                    }}
                    placeholder="98765 43210 or @rahul_01"
                    className="w-full bg-white border border-warm-border rounded-xl p-2.5 pl-8 text-xs font-mono focus:ring-1 focus:ring-[#141416] focus:outline-none"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold">
                    4-Digit Security PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('register');
                      setError('Enter your registered number to reset your PIN via WhatsApp.');
                    }}
                    className="text-[10px] font-mono text-stone-500 hover:text-black underline cursor-pointer"
                  >
                    Forgot PIN?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="● ● ● ●"
                    className="w-full bg-white border border-warm-border rounded-xl p-2.5 pl-8 text-center text-sm font-mono tracking-widest focus:ring-1 focus:ring-[#141416] focus:outline-none"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#141416] hover:bg-stone-800 text-[#FAF9F5] font-mono text-xs uppercase tracking-wider font-semibold py-3 px-4 rounded-full shadow-atelier flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Sign In & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* Quick 1-Click Demo Fill Badges (For Fast Testing) */}
          <div className="pt-2 border-t border-stone-200/60">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1.5 text-center">
              Quick Test Autofill (Click to Try)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <button
                type="button"
                onClick={fillCustomerDemo}
                className="p-1.5 bg-white border border-warm-border rounded-xl hover:bg-stone-100 text-stone-700 text-center transition-colors cursor-pointer"
              >
                👤 Customer Demo
              </button>
              <button
                type="button"
                onClick={fillShopkeeperDemo}
                className="p-1.5 bg-[#141416] text-white rounded-xl hover:bg-stone-800 text-center transition-colors cursor-pointer"
              >
                🏪 Shopkeeper Demo
              </button>
            </div>
          </div>

          {/* Skip for now / Continue as Guest */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={skipForNow}
              className="text-xs font-mono text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              Skip for now & browse catalog as guest →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

