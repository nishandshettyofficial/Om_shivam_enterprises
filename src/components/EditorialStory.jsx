import React from 'react';
import { STORE_CONFIG } from '../constants/store';
import { Feather, Printer, Ticket, Check, Clock } from 'lucide-react';

export default function EditorialStory() {
  const standards = [
    {
      num: "01",
      icon: Feather,
      title: "Authentic Stationery & Instruments",
      desc: "Every notebook, pen, and calculator is procured directly from certified distributors of Parker, Casio, Faber-Castell, Brustro, and Classmate."
    },
    {
      num: "02",
      icon: Printer,
      title: "Xerox & High-Speed Printing",
      desc: "Instant black & white photocopies, high-resolution color document printing, thesis spiral binding, and project laminations."
    },
    {
      num: "03",
      icon: Ticket,
      title: "Confirmed Travel Ticket Bookings",
      desc: "Quick, dependable online booking assistance for train reservations, domestic & international flight tickets, and inter-city bus travel."
    },
    {
      num: "04",
      icon: Clock,
      title: "15-Minute Pre-Packed Store Pickup",
      desc: "Assemble your stationery wishlist on your phone. Our staff hand-packs and cross-checks your order so you never wait in a queue."
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-warm-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-stone-500 mb-3">
            <Feather className="w-3.5 h-3.5 text-[#D97706]" />
            <span>The {STORE_CONFIG.shortName} Commitment</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141416] tracking-tight leading-[1.12]">
            All Your Daily Needs in One Dependable Place.
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light mt-4 leading-relaxed">
            From precision engineering calculators and archival art supplies to urgent photocopies and confirmed travel bookings — OM SHIVAM ENTERPRISES serves as your neighborhood's complete destination with zero-wait counter collection.
          </p>
        </div>

        {/* 4 Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {standards.map((s) => (
            <div
              key={s.num}
              className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-7 border border-warm-border flex flex-col justify-between hover:border-stone-400 transition-colors shadow-atelier"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-stone-300">
                    {s.num}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                    <s.icon className="w-4 h-4 text-[#D97706]" />
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141416] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-200/80 flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Service</span>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Quote Banner */}
        <div className="mt-14 rounded-3xl bg-[#141416] text-[#FAF9F5] p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#D97706]">
              Store Philosophy
            </span>
            <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl italic font-normal text-stone-200 leading-snug">
              “Serving students, scholars, professionals, and families with genuine supplies and prompt neighborhood service.”
            </blockquote>
            <div className="pt-2 text-xs font-mono text-stone-400">
              — {STORE_CONFIG.name}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
