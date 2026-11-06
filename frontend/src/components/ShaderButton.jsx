import React, { useState } from 'react';

/**
 * Martin Mroč inspired Shader Button
 * Featuring fluid rotating conic-gradient borders, ambient glowing aura,
 * and tactile micro-interactions.
 */
export default function ShaderButton({
  children,
  onClick,
  variant = 'shader-amber',
  size = 'md',
  icon: Icon,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  title = ''
}) {
  const [isPressed, setIsPressed] = useState(false);

  // Size specifications
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs font-semibold px-4 py-2 gap-2',
    lg: 'text-sm font-semibold px-5 py-2.5 gap-2.5'
  };

  // Border gradient aura variants
  const auraGradients = {
    // Holographic chromatic shader (Martin Mroč exploration style)
    'shader-rainbow': 'bg-[conic-gradient(from_0deg,#ff4545,#00ffcc,#0066ff,#ff00ff,#ffbb00,#00ffcc,#ff4545)]',
    // Luxury warm atelier shader (Deep gold, bronze, amber, rose)
    'shader-amber': 'bg-[conic-gradient(from_0deg,#d97706,#f59e0b,#fbbf24,#ec4899,#d97706,#b45309,#d97706)]',
    // Electric cyber cyan/indigo shader for Upload & Print actions
    'shader-upload': 'bg-[conic-gradient(from_0deg,#6366f1,#38bdf8,#a855f7,#06b6d4,#ec4899,#6366f1)]',
    // Dark glass subtle border
    'glass': 'bg-gradient-to-r from-white/30 via-stone-400/20 to-white/30',
    'dark': 'bg-stone-700'
  };

  const isShader = variant.startsWith('shader');

  return (
    <div
      className={`relative inline-flex group ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {/* Ambient Glow Aura (Visible on hover) */}
      {isShader && !disabled && (
        <div
          className={`absolute -inset-1 rounded-full blur-md opacity-40 group-hover:opacity-85 transition-opacity duration-500 animate-pulse pointer-events-none ${
            variant === 'shader-rainbow'
              ? 'bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400'
              : variant === 'shader-upload'
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600'
          }`}
        />
      )}

      {/* Main Button Container with Animated Conic Border */}
      <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        title={title}
        className={`relative z-10 w-full inline-flex items-center justify-center rounded-full p-[1.5px] overflow-hidden transition-transform duration-200 ${
          isPressed ? 'scale-[0.97]' : 'group-hover:scale-[1.02]'
        }`}
      >
        {/* Continuous Rotating Conic Gradient Shader */}
        {isShader && (
          <span
            className={`absolute -inset-[150%] ${auraGradients[variant]} animate-spin-slow group-hover:animate-spin-fast transition-all`}
          />
        )}

        {/* Inner Button Core Content */}
        <span
          className={`relative z-10 w-full inline-flex items-center justify-center rounded-full transition-colors duration-200 font-semibold tracking-normal ${
            sizeClasses[size]
          } ${
            isShader
              ? 'bg-[#141416] text-[#FAF9F5] group-hover:bg-[#1E1E24] shadow-inner shadow-white/10'
              : variant === 'glass'
              ? 'bg-white/80 backdrop-blur-md text-stone-800 hover:bg-white border border-stone-200/80 shadow-xs'
              : 'bg-stone-900 text-white hover:bg-black'
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-3.5 w-3.5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            Icon && (
              <Icon
                className={`transition-transform duration-300 group-hover:scale-110 ${
                  size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
                }`}
              />
            )
          )}
          <span>{children}</span>
        </span>
      </button>
    </div>
  );
}
