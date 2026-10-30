import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { STORE_CONFIG } from '../constants/store';
import { Search, ShoppingBag, X, ArrowUpRight, MessageCircle } from 'lucide-react';

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    cartTotal,
    setIsCartOpen,
    shopPhone,
    shopMapsUrl
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-panel transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-3 group text-left shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#141416] text-[#FAF9F5] flex items-center justify-center font-serif text-lg font-bold shadow-atelier group-hover:scale-105 transition-transform duration-300">
              {STORE_CONFIG.monogram}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#141416]">
                  {STORE_CONFIG.shortName}
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase bg-[#141416] text-white px-2 py-0.5 rounded-sm font-semibold">
                  ENTERPRISES
                </span>
              </div>
              <p className="text-[10px] font-mono text-stone-500 line-clamp-1 tracking-wide">
                {STORE_CONFIG.subtitle}
              </p>
            </div>
          </a>

          {/* Center: Minimalist Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
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
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archival paper, Parker pens, Casio calculators, art sets..."
                className="w-full bg-transparent text-xs text-[#141416] placeholder:text-stone-400 pl-11 pr-10 py-2.5 rounded-full focus:outline-none font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Status Pill & Bag Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Live Store Status & Google Maps Link Pill */}
            <a
              href={shopMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#F4F2EC] hover:bg-stone-200/80 border border-warm-border hover:border-stone-400 px-3 py-1.5 rounded-full text-[11px] font-mono transition-all group cursor-pointer"
              title="Open OM SHIVAM ENTERPRISES on Google Maps"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-stone-700 font-medium">Shop Open • 15m Pickup</span>
              <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-stone-800 transition-colors" />
            </a>

            {/* Direct WhatsApp Concierge */}
            <a
              href={`https://api.whatsapp.com/send?phone=${shopPhone}&text=${encodeURIComponent(
                "Hello Om Shivam Enterprises, I would like to inquire about stationery items available at your store."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-900 border border-warm-border hover:border-stone-400 bg-white/70 px-3 py-1.5 rounded-full transition-colors"
              title="Chat directly with shopkeeper on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask Shop</span>
            </a>

            {/* Shopping Bag CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="group flex items-center gap-2.5 bg-[#141416] hover:bg-stone-800 text-[#FAF9F5] px-4 py-2 rounded-full font-medium text-xs shadow-atelier transition-all duration-300 transform active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#D97706] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono tracking-wider">BAG</span>
              {cartCount > 0 && (
                <span className="bg-white/15 text-white font-mono px-2 py-0.5 rounded-full text-[11px]">
                  ₹{cartTotal}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full rounded-full bg-[#F4F2EC] border border-warm-border">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notebooks, pens, markers, files..."
              className="w-full bg-transparent text-xs text-[#141416] placeholder:text-stone-400 pl-9 pr-9 py-2 rounded-full focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
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
