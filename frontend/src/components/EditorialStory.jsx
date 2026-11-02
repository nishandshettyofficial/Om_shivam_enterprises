import React from 'react';
import { STORE_CONFIG } from '../constants/store';
import { Store, Printer, Ticket, Check, Clock } from 'lucide-react';

export default function EditorialStory() {
  const services = [
    {
      num: "01",
      icon: Store,
      title: "100% Genuine Stationery",
      desc: "Authentic notebooks, pens, markers, and calculators from official distributors of Classmate, Parker, Casio, Faber-Castell, and Brustro."
    },
    {
      num: "02",
      icon: Printer,
      title: "Xerox & Color Printing",
      desc: "Instant black & white photocopies, high-speed color printing, spiral project binding, and document laminations."
    },
    {
      num: "03",
      icon: Ticket,
      title: "Train, Flight & Bus Tickets",
      desc: "Fast counter booking assistance for confirmed train reservations, domestic flight tickets, and inter-city bus bookings."
    },
    {
      num: "04",
      icon: Clock,
      title: "15-Minute Counter Pickup",
      desc: "Pick your items on your phone and collect them pre-packed at our counter without waiting in any queue."
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-t border-warm-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14 text-left">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-stone-500 mb-2">
            <Store className="w-3.5 h-3.5 text-stone-700" />
            <span>Store Services</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141416] tracking-tight">
            Stationery, Printing, Travel & Counter Services
          </h2>
          <p className="text-stone-600 text-sm font-light mt-3 leading-relaxed">
            Everything you need for school, office, and travel in one place. Pre-order online or visit our store counter directly.
          </p>
        </div>

        {/* 4 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {services.map((s) => (
            <div
              key={s.num}
              className="bg-[#FAF9F5] rounded-2xl p-6 border border-warm-border flex flex-col justify-between hover:border-stone-400 transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xl font-bold text-stone-300">
                    {s.num}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                    <s.icon className="w-4 h-4 text-stone-800" />
                  </div>
                </div>
                <h3 className="font-serif text-base font-bold text-[#141416] mb-1.5">
                  {s.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-stone-200/80 flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Available at Counter</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
