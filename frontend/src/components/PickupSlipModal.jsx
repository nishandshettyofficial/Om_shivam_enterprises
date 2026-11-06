import React from 'react';
import { useShop } from '../context/ShopContext';
import { STORE_CONFIG } from '../constants/store';
import {
  X,
  CheckCircle2,
  Printer,
  MessageSquare,
  MapPin,
  ArrowUpRight
} from 'lucide-react';

export default function PickupSlipModal() {
  const { pickupSlip, setPickupSlip, shopPhone, shopMapsUrl } = useShop();

  if (!pickupSlip) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const itemsText = pickupSlip.items
      .map(
        (item, i) =>
          `${i + 1}. [${item.product.brand}] ${item.product.name} x ${item.quantity} = ₹${item.product.price * item.quantity}`
      )
      .join('\n');

    const msg = encodeURIComponent(
      `*${STORE_CONFIG.name} — PICKUP PASS #${pickupSlip.token}*\n` +
      `════════════════════════════════════\n` +
      `Customer: ${pickupSlip.customerName} (${pickupSlip.customerPhone})\n` +
      `Collection Time: ${pickupSlip.pickupTime}\n\n` +
      `Items:\n${itemsText}\n\n` +
      `Total Payable: ₹${pickupSlip.total}\n` +
      `════════════════════════════════════\n` +
      `I am picking this up from your counter. Please keep ready.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${shopPhone}&text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-warm-border animate-fade-in my-6">
        
        {/* Pass Header */}
        <div className="bg-[#141416] text-[#FAF9F5] p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Store Pickup Pass Confirmed
              </h2>
              <p className="text-xs text-stone-400">
                {STORE_CONFIG.name} • Counter Collection
              </p>
            </div>
          </div>
          <button
            onClick={() => setPickupSlip(null)}
            className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 space-y-5 text-stone-800">
          
          {/* Token Card / Boarding Voucher */}
          <div className="bg-white rounded-2xl border-2 border-stone-800 p-5 text-center relative overflow-hidden shadow-xs">
            
            {/* Top decorative barcode lines */}
            <div className="flex justify-center items-center gap-1 opacity-70 mb-2 font-mono tracking-widest text-[9px] text-stone-400 select-none">
              ||| | ||||| || |||||| | ||| |||| | ||||| |||
            </div>

            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500 font-semibold block">
              Official Pickup Token
            </span>
            <div className="font-mono text-3xl font-extrabold text-[#141416] tracking-wider my-1">
              #{pickupSlip.token}
            </div>
            <p className="text-xs text-stone-600 font-light max-w-xs mx-auto">
              Show this token number or phone number at our counter. Your stationery is being packed!
            </p>

            {/* Perforated divider look */}
            <div className="relative my-4 border-b-2 border-dashed border-stone-200">
              <div className="absolute -left-7 -top-2.5 w-5 h-5 rounded-full bg-[#FAF9F5] border-r border-warm-border" />
              <div className="absolute -right-7 -top-2.5 w-5 h-5 rounded-full bg-[#FAF9F5] border-l border-warm-border" />
            </div>

            {/* Customer Details Row */}
            <div className="grid grid-cols-2 gap-3 text-left font-mono text-xs">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Customer</span>
                <span className="font-bold text-stone-900">{pickupSlip.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Mobile</span>
                <span className="font-bold text-stone-900">{pickupSlip.customerPhone}</span>
              </div>
              <div className="col-span-2 pt-1">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Ready For Collection</span>
                <span className="font-bold text-emerald-700">{pickupSlip.pickupTime}</span>
              </div>
            </div>

          </div>

          {/* Packed Items List */}
          <div className="bg-white rounded-2xl border border-warm-border p-4 space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-stone-700 pb-1 border-b border-stone-100 flex items-center justify-between">
              <span>Itemised Supplies ({pickupSlip.items.length})</span>
              <span className="text-[10px] font-normal text-stone-400">Order at {pickupSlip.time}</span>
            </h4>

            <div className="divide-y divide-stone-100 max-h-40 overflow-y-auto pr-1">
              {pickupSlip.items.map(({ product, quantity }) => (
                <div key={product.id} className="py-2 flex justify-between items-center text-xs">
                  <div className="truncate max-w-[240px]">
                    <span className="font-mono text-[10px] text-stone-400 block uppercase">
                      {product.brand}
                    </span>
                    <span className="font-serif text-stone-800 truncate">
                      {product.name}
                    </span>
                    <span className="text-stone-400 font-mono text-[11px] ml-1">
                      (×{quantity})
                    </span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 shrink-0">
                    ₹{product.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-mono">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Total Payable At Counter:
              </span>
              <span className="text-xl font-bold text-[#141416]">
                ₹{pickupSlip.total}
              </span>
            </div>
          </div>

          {/* Store Address & Contact Pill with Direct Google Maps Link */}
          <a
            href={shopMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F4F2EC] hover:bg-stone-200/70 rounded-2xl border border-warm-border p-3.5 flex items-start justify-between gap-2.5 text-xs text-stone-700 transition-colors group cursor-pointer block"
            title="Open OM SHIVAM ENTERPRISES location on Google Maps"
          >
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="space-y-0.5 text-left">
                <span className="font-bold text-stone-900 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <span>OM SHIVAM ENTERPRISES</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-sans font-semibold">Open in Maps</span>
                </span>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Click to open Google Maps navigation for store pickup. Open until 9:30 PM.
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 shrink-0 mt-0.5" />
          </a>

          {/* Action Row */}
          <div className="pt-1 flex gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 bg-[#141416] hover:bg-stone-800 text-[#FAF9F5] text-xs font-semibold py-3 px-4 rounded-full shadow-atelier flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Share WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-3 bg-white hover:bg-stone-100 text-stone-800 border border-warm-border rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Print slip"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={() => setPickupSlip(null)}
              className="px-4 py-3 bg-[#F4F2EC] hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
