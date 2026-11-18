import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SignIn } from '@clerk/react';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  const { setCurrentView } = useAuth();

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {/* Back to store navigation */}
      <button
        onClick={() => setCurrentView('catalog')}
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-black mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      {/* Official Clerk Authentication Component */}
      <div className="flex justify-center">
        <SignIn routing="hash" />
      </div>
    </div>
  );
}
