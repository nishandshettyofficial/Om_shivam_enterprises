import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { STORE_CONFIG } from '../constants/store';
import {
  generateOrderToken,
  generateWhatsAppOrderText,
  buildWhatsAppUrl,
  formatCurrency
} from '../utils/formatters';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageSquare,
  FileText,
  Copy,
  Check,
  Store,
  Clock,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  Gift
} from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    cartTotal,
    cartCount,
    cartSavings,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    setPickupSlip,
    triggerConfetti,
    shopPhone
  } = useShop();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('Today within 30-45 minutes');
  const [extraNotes, setExtraNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isCartOpen) return null;

  // Free gift threshold from store config
  const giftThreshold = STORE_CONFIG.cart.freeGiftThreshold;
  const progressToGift = Math.min(100, Math.round((cartTotal / giftThreshold) * 100));
  const amountToGift = Math.max(0, giftThreshold - cartTotal);

  // Send via WhatsApp
  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;
    const token = generateOrderToken();
    const orderText = generateWhatsAppOrderText({
      token,
      cart,
      customerName,
      customerPhone,
      pickupTime,
      extraNotes,
      total: cartTotal
    });
    const whatsappUrl = buildWhatsAppUrl(shopPhone, orderText);
    window.open(whatsappUrl, '_blank');

    setPickupSlip({
      token,
      customerName: customerName || 'Customer',
      customerPhone: customerPhone || '-',
      pickupTime,
      extraNotes,
      items: [...cart],
      total: cartTotal,
      savings: cartSavings,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    triggerConfetti();
    clearCart();
    setIsCartOpen(false);
  };

  // Generate in-store pickup slip directly
  const handleGenerateSlip = () => {
    if (cart.length === 0) return;
    const token = generateOrderToken();
    setPickupSlip({
      token,
      customerName: customerName || 'Customer',
      customerPhone: customerPhone || '-',
      pickupTime,
      extraNotes,
      items: [...cart],
      total: cartTotal,
      savings: cartSavings,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    triggerConfetti();
    clearCart();
    setIsCartOpen(false);
  };

  const handleCopyList = () => {
    const token = generateOrderToken();
    const orderText = generateWhatsAppOrderText({
      token,
      cart,
      customerName,
      customerPhone,
      pickupTime,
      extraNotes,
      total: cartTotal
    });
    navigator.clipboard.writeText(orderText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-[#FAF9F5] h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden border-l border-warm-border">
        
        {/* Header */}
        <div className="bg-[#141416] text-[#FAF9F5] p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-amber-300">
              OS
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Your Order Bag
              </h2>
              <p className="text-xs text-stone-400">
                Pre-packed for in-store collection ({cartCount} items)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gift Progress Bar */}
        {cart.length > 0 && (
          <div className="bg-[#F4F2EC] px-5 py-3 border-b border-warm-border text-xs">
            <div className="flex items-center justify-between font-mono text-[11px] text-stone-700 mb-1.5">
              <span className="flex items-center gap-1 font-semibold">
                <Gift className="w-3.5 h-3.5 text-[#D97706]" />
                {amountToGift > 0 ? (
                  <span>Add ₹{amountToGift} more for a complimentary document wallet</span>
                ) : (
                  <span className="text-emerald-700 font-bold">Complimentary document wallet unlocked!</span>
                )}
              </span>
              <span>{progressToGift}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#141416] transition-all duration-500 rounded-full"
                style={{ width: `${progressToGift}%` }}
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6 no-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 border border-warm-border flex items-center justify-center mx-auto text-stone-400">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#141416]">
                  Your bag is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Browse our stationery catalog and tap "Add" to assemble your pickup order.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-stone-500 pb-2 border-b border-warm-border">
                  <span>Selected Supplies</span>
                  <button
                    onClick={clearCart}
                    className="text-stone-400 hover:text-red-600 transition-colors font-sans text-xs underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-warm-border/60 max-h-56 overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                      
                      {/* Image & Title */}
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-12 h-12 rounded-xl bg-[#F4F2EC] p-1 flex items-center justify-center shrink-0 border border-warm-border">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="truncate">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                            {product.brand}
                          </span>
                          <h4 className="font-serif text-xs font-bold text-[#141416] truncate">
                            {product.name}
                          </h4>
                          <span className="font-mono text-[11px] text-stone-500">
                            ₹{product.price} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center bg-white border border-warm-border rounded-full p-0.5">
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity - 1)}
                            className="w-6 h-6 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-xs text-[#141416]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity + 1)}
                            className="w-6 h-6 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-xs text-[#141416] w-12 text-right">
                          ₹{product.price * quantity}
                        </span>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-stone-400 hover:text-red-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* In-Store Pickup Details Form */}
              <div className="bg-white rounded-2xl border border-warm-border p-4 space-y-3 shadow-xs">
                <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100">
                  <Store className="w-4 h-4 text-[#D97706]" />
                  <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#141416]">
                    Collection Details (For The Counter)
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#F4F2EC] border border-warm-border rounded-xl p-2.5 pl-8 text-xs focus:ring-1 focus:ring-[#141416] focus:outline-none"
                    />
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-[#F4F2EC] border border-warm-border rounded-xl p-2.5 pl-8 text-xs focus:ring-1 focus:ring-[#141416] focus:outline-none font-mono"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Pickup Window
                  </label>
                  <div className="relative">
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-[#F4F2EC] border border-warm-border rounded-xl p-2.5 pl-8 text-xs focus:ring-1 focus:ring-[#141416] focus:outline-none font-mono cursor-pointer"
                    >
                      <option>Today within 30-45 minutes</option>
                      <option>Today within 1-2 hours</option>
                      <option>Today Evening (5 PM – 8 PM)</option>
                      <option>Tomorrow Morning (9:30 AM – 12 PM)</option>
                      <option>Tomorrow Evening (5 PM – 8 PM)</option>
                    </select>
                    <Clock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Additional Supplies Needed?
                  </label>
                  <input
                    type="text"
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    placeholder="e.g. 1 Fevicol glue bottle, 2 chart papers..."
                    className="w-full bg-[#F4F2EC] border border-warm-border rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#141416] focus:outline-none"
                  />
                </div>

              </div>

              {/* Order Cost Breakdown */}
              <div className="bg-white rounded-2xl border border-warm-border p-4 space-y-2 text-xs shadow-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Bag Subtotal:</span>
                  <span className="font-semibold text-stone-900">₹{cartTotal}</span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Retail Savings:</span>
                    <span className="font-semibold">-₹{cartSavings}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Counter Assembly & Bagging:</span>
                  <span className="text-emerald-600 font-semibold">Complimentary</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline font-bold text-sm text-[#141416]">
                  <span>Total Payable at Counter:</span>
                  <span className="text-lg font-black">₹{cartTotal}</span>
                </div>
                <span className="text-[11px] text-stone-400 block text-right font-normal">
                  Pay via Cash, UPI QR or Card upon inspecting your items.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer CTAs */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-warm-border space-y-2.5">
            {/* Primary Action 1: WhatsApp Dispatch */}
            <button
              onClick={handleSendWhatsApp}
              className="w-full bg-[#141416] hover:bg-stone-800 text-[#FAF9F5] text-xs font-semibold py-3.5 px-4 rounded-full shadow-atelier flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Send Order to Shop via WhatsApp (₹{cartTotal})</span>
            </button>

            {/* Action 2: Generate Slip */}
            <button
              onClick={handleGenerateSlip}
              className="w-full bg-[#F4F2EC] hover:bg-stone-200/80 text-[#141416] border border-warm-border text-xs font-semibold py-3 px-4 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-stone-600" />
              <span>Generate In-Store Pickup Pass</span>
            </button>

            {/* Action 3: Copy List */}
            <button
              onClick={handleCopyList}
              className="w-full text-center text-xs text-stone-500 hover:text-stone-900 py-1 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold font-mono">List copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-mono text-[11px]">Copy Order List as Text</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
