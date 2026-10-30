import React from 'react';
import { STORE_CONFIG } from '../constants/store';

export default function AnnouncementBar() {
  const item = (
    <div className="flex items-center gap-4 shrink-0">
      <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-amber-400 uppercase">
        {STORE_CONFIG.name}
      </span>
      <span className="text-white/40">✦</span>
      <span className="text-stone-200 tracking-wide text-[11px] sm:text-xs">
        {STORE_CONFIG.tagline}
      </span>
      <span className="text-white/40">✦</span>
    </div>
  );

  return (
    <div className="bg-[#141416] text-[#FAF9F5] text-xs font-mono overflow-hidden border-b border-white/10 select-none py-2">
      <div className="marquee-track flex items-center gap-6 whitespace-nowrap">
        {item}
        {item}
        {item}
        {item}
      </div>
    </div>
  );
}
