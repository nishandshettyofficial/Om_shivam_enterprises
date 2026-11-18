import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { UserButton } from '@clerk/react';
import { STORE_CONFIG } from '../constants/store';
import {
  Search,
  ShoppingBag,
  X,
  MessageCircle,
  User,
  Store,
  Menu,
  Printer,
  Sparkles,
  Command
} from 'lucide-react';

export default function Header({ onToggleMobileSidebar, onOpenPrintModal }) {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    cartTotal,
    setIsCartOpen,
    shopMapsUrl
  } = useShop();

  const {
    currentUser,
    isLoggedIn,
    isShopkeeper,
    currentView,
    setCurrentView
  } = useAuth();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-warm-border/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Mobile Sidebar Hamburger & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 -ml-2 rounded-xl text-stone-700 hover:bg-stone-200/60 md:hidden transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('catalog');
              }}
              className="flex items-center gap-2.5 group text-left shrink-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#141416] text-[#FAF9F5] flex items-center justify-center text-sm font-bold shadow-atelier group-hover:scale-105 transition-transform duration-300">
                {STORE_CONFIG.monogram}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-[#141416] font-display">
                    {STORE_CONFIG.shortName}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-1 tracking-normal font-normal">
                  Stationery & Xerox Counter
                </p>
              </div>
            </a>
          </div>

          {/* Center: Universal Command Omnibar with Keyboard Hint & Quick Suggestions */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2 lg:mx-4 relative">
            <div
              className={`relative w-full rounded-full transition-all duration-300 ${
                isSearchFocused
                  ? 'bg-white ring-2 ring-[#141416] shadow-atelier'
                  : 'bg-[#F4F2EC] hover:bg-stone-200/60'
              }`}
            >
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'catalog') setCurrentView('catalog');
                }}
                placeholder="Search pens, gel pens, pencils, notebooks, geometry..."
                className="w-full bg-transparent text-xs text-[#141416] placeholder:text-stone-400 pl-11 pr-16 py-2.5 rounded-full focus:outline-none font-sans"
              />

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded-full cursor-pointer"
                  title="Clear search filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 text-[10px] font-mono text-stone-400 bg-stone-200/70 px-1.5 py-0.5 rounded-md pointer-events-none">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Print Studio Trigger Button */}
            <button
              onClick={() => setCurrentView('print')}
              className="hidden lg:flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200/80 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-2xs"
              title="Upload PDF/Word document for Xerox & print"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>Print Upload</span>
            </button>

            {/* Direct WhatsApp Concierge (clean, no raw phone number) */}
            <a
              href={STORE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-emerald-900 hover:text-emerald-950 border border-emerald-300/80 hover:border-emerald-500 bg-emerald-50/90 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full transition-all font-medium cursor-pointer shadow-2xs"
              title="Chat with OM SHIVAM ENTERPRISES on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
              <span className="font-semibold tracking-tight">WhatsApp</span>
            </a>

            {/* Account / Dashboard Button & Clerk UserButton */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {isShopkeeper ? (
                  <button
                    onClick={() => setCurrentView(currentView === 'shopkeeper-dashboard' ? 'catalog' : 'shopkeeper-dashboard')}
                    className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    title="Switch between Shopkeeper Counter Hub and Public Catalog"
                  >
                    <Store className="w-3.5 h-3.5 text-amber-700" />
                    <span className="hidden sm:inline">{currentView === 'shopkeeper-dashboard' ? 'Catalog' : 'Counter Hub'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentView(currentView === 'user-dashboard' ? 'catalog' : 'user-dashboard')}
                    className="flex items-center gap-1.5 bg-[#F4F2EC] hover:bg-stone-200/80 text-stone-800 border border-warm-border px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0"
                    title="Open Your Account & Orders"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="max-w-[70px] sm:max-w-[90px] truncate">{currentView === 'user-dashboard' ? 'Catalog' : currentUser?.handle || 'Account'}</span>
                  </button>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('signin')}
                className={`flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer ${
                  currentView === 'signin'
                    ? 'bg-[#141416] text-white border-[#141416]'
                    : 'text-stone-700 hover:text-stone-900 border-warm-border hover:border-stone-400 bg-white/70'
                }`}
                title="Sign in or Create Account"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Shopping Bag CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="group flex items-center gap-2 bg-[#141416] hover:bg-stone-800 text-[#FAF9F5] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs shadow-atelier transition-all duration-300 transform active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold tracking-normal">Bag</span>
              {cartCount > 0 && (
                <span className="bg-white/15 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  ₹{cartTotal}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full rounded-full bg-[#F4F2EC] border border-warm-border">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'catalog') setCurrentView('catalog');
              }}
              placeholder="Search pens, gel pens, pencils, notebooks..."
              className="w-full bg-transparent text-xs text-[#141416] placeholder:text-stone-400 pl-9 pr-9 py-2 rounded-full focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
