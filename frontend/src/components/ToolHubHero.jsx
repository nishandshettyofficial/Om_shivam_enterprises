import React from 'react';
import ShaderButton from './ShaderButton';
import { STORE_CONFIG } from '../constants/store';
import { UploadCloud, ShoppingBag, Clock, Printer, Store, MapPin, ExternalLink } from 'lucide-react';

export default function ToolHubHero({ onOpenPrintModal, onExploreCatalog }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121215] via-[#1A1A22] to-[#14141A] text-white border border-white/10 p-5 sm:p-7 md:p-8 shadow-2xl">
      
      {/* Decorative Ambient Radial Mesh Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
        
        {/* Left Column: Store Heading, Genuine Description & Action Buttons */}
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Store Open</span>
            <span className="text-white/40">•</span>
            <a
              href={STORE_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer"
              title="View on Google Maps"
            >
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Kapu, Udupi</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
            Stationery, Xerox & Printing, School & Office Supplies
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm font-normal max-w-xl leading-relaxed">
            Original <strong className="text-white font-semibold">ITC Classmate</strong> notebooks and pens, <strong className="text-white font-semibold">Apsara</strong> drawing and geometry sets, and instant document printing. Order on your phone and collect at our store in 15 minutes.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
            
            {/* Martin Mroč Shader Upload Button */}
            <ShaderButton
              variant="shader-upload"
              size="lg"
              icon={UploadCloud}
              onClick={onOpenPrintModal}
            >
              Upload Documents for Print
            </ShaderButton>

            {/* Amber Shader Browse Button */}
            <ShaderButton
              variant="shader-amber"
              size="lg"
              icon={ShoppingBag}
              onClick={onExploreCatalog}
            >
              Browse 173+ Items
            </ShaderButton>

          </div>
        </div>

        {/* Right Column: Compact Store Metrics Grid */}
        <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-2.5 shrink-0">
          
          <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-0.5">
            <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-medium">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Catalog Size</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              173 Items
            </div>
            <p className="text-[10px] text-stone-400">
              Classmate & Apsara
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-0.5">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Counter Ready</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              15 Mins
            </div>
            <p className="text-[10px] text-stone-400">
              Fast Pickup Queue
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-0.5">
            <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-medium">
              <Printer className="w-3.5 h-3.5" />
              <span>Print & Xerox</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              From ₹2
            </div>
            <p className="text-[10px] text-stone-400">
              B&W & Color Prints
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-0.5">
            <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-medium">
              <Store className="w-3.5 h-3.5" />
              <span>Store Hours</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              9AM – 9:30PM
            </div>
            <p className="text-[10px] text-stone-400">
              Mon – Sat
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
