import React from 'react';
import ShaderButton from './ShaderButton';
import { UploadCloud, ShoppingBag, Clock, Printer, Store, MapPin } from 'lucide-react';

export default function ToolHubHero({ onOpenPrintModal, onExploreCatalog }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121215] via-[#1A1A22] to-[#14141A] text-white border border-white/10 p-6 sm:p-9 shadow-2xl">
      
      {/* Decorative Ambient Radial Mesh Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Left Column: Store Heading, Genuine Description & Action Buttons */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Store Counter Open</span>
            <span className="text-white/40">•</span>
            <span className="text-stone-300">BMS College Road, Bengaluru</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Stationery, Xerox & Printing, School & Office Supplies
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm font-normal max-w-xl leading-relaxed">
            Original <strong className="text-white font-semibold">ITC Classmate</strong> notebooks and pens, <strong className="text-white font-semibold">Apsara</strong> drawing and geometry sets, and instant document printing. Order on your phone and collect at our store in 15 minutes.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            
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

        {/* Right Column: Real Store Metrics Grid */}
        <div className="w-full lg:w-auto grid grid-cols-2 gap-3 shrink-0">
          
          <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
              <ShoppingBag className="w-4 h-4" />
              <span>Catalog Size</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              173 Items
            </div>
            <p className="text-xs text-stone-400">
              Classmate & Apsara
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <Clock className="w-4 h-4" />
              <span>Counter Ready</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              15 Mins
            </div>
            <p className="text-xs text-stone-400">
              Fast Pickup Queue
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium">
              <Printer className="w-4 h-4" />
              <span>Print & Xerox</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              From ₹2
            </div>
            <p className="text-xs text-stone-400">
              B&W and Color Prints
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-medium">
              <Store className="w-4 h-4" />
              <span>Store Hours</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              9AM – 9:30PM
            </div>
            <p className="text-xs text-stone-400">
              Monday to Saturday
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
