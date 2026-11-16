import React from 'react';
import { useShop } from '../context/ShopContext';
import { STORE_CONFIG } from '../constants/store';
import { MessageCircle, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function Footer() {
  const { setSelectedCategory, shopPhone, shopMapsUrl } = useShop();

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#141416] text-[#FAF9F5] pt-16 pb-12 border-t border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center text-base font-bold">
                {STORE_CONFIG.monogram}
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight block text-white">
                  {STORE_CONFIG.name}
                </span>
                <span className="text-xs text-stone-400 block tracking-normal">
                  {STORE_CONFIG.subtitle}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 font-normal leading-relaxed max-w-sm">
              All your daily needs in one place. Authentic stationery, school and office essentials, photocopies, printouts, and travel tickets with fast counter collection.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                In-Store Collection Open Today
              </span>
            </div>
          </div>

          {/* Quick Categories Col */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-stone-300">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {CATEGORIES.slice(1, 7).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & Address */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-stone-300">
              Counter Hours & Location
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white">{STORE_CONFIG.hours.weekdays}</div>
                  <div className="text-stone-400 text-xs">{STORE_CONFIG.hours.sunday}</div>
                </div>
              </div>

              <a
                href={shopMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 pt-2 group hover:text-white transition-colors block cursor-pointer"
                title="View OM SHIVAM ENTERPRISES on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-stone-400 group-hover:text-stone-200 text-xs leading-relaxed">
                  <span className="font-semibold text-white flex items-center gap-1">
                    {STORE_CONFIG.name}
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-white transition-colors" />
                  </span>
                  {STORE_CONFIG.address.full}
                </div>
              </a>
            </div>
          </div>

          {/* Contact / WhatsApp */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-stone-400 font-semibold">
              Store Support
            </h4>
            <div className="space-y-2.5">
              <a
                href={`https://api.whatsapp.com/send?phone=${shopPhone}&text=${encodeURIComponent(
                  `Hello ${STORE_CONFIG.name}, I would like to inquire about stationery orders and printing.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-full text-xs font-mono transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Shop</span>
              </a>

              <p className="text-[11px] text-stone-400 font-light leading-snug">
                Send lists, document PDFs for printing, or travel inquiries directly to the counter.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} {STORE_CONFIG.name}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-stone-400">
            <span>Stationery, Xerox & Printing</span>
            <span className="hidden sm:inline">•</span>
            <span>15-Minute Counter Collection</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
