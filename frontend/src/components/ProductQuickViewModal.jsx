import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { STORE_CONFIG } from '../constants/store';
import { X, Plus, Minus, ShoppingBag, Star, MessageCircle, Check } from 'lucide-react';

export default function ProductQuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    cart,
    addToCart,
    updateCartQuantity,
    shopPhone
  } = useShop();

  const { requireAuth } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const cartItem = cart.find((item) => item.product.id === product.id);
  const discountPercent = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAdd = () => {
    requireAuth(() => {
      addToCart(product, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden z-10 animate-fade-in my-6 sm:my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-stone-100 text-stone-700 flex items-center justify-center transition-colors shadow-xs border border-warm-border"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image Stage */}
          <div className="relative bg-[#F4F2EC] p-8 flex items-center justify-center aspect-square md:aspect-auto">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-80 max-w-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
            />
            {product.badge && (
              <span className="absolute top-5 left-5 bg-[#141416] text-[#FAF9F5] text-xs px-3 py-1 rounded-full font-semibold">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-3">
              {/* Category & Brand */}
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.category}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#141416] leading-snug tracking-tight">
                {product.name}
              </h2>

              {/* Rating & In-Store Availability */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-stone-300">|</span>
                <span className="text-emerald-700 text-xs font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Ready in 15 mins at counter
                </span>
              </div>

              {/* Price Banner */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl font-black text-[#141416]">
                  ₹{product.price}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-sm text-stone-400 line-through">
                      ₹{product.mrp}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal pt-1">
                {product.description}
              </p>

              {/* Specifications List */}
              {product.specs && product.specs.length > 0 && (
                <div className="pt-2 space-y-1.5 border-t border-stone-100">
                  <span className="text-xs text-stone-400 font-semibold block mb-1">
                    Key Specifications
                  </span>
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#141416]" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Actions Area */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center bg-[#F4F2EC] border border-warm-border rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#141416]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-[#141416] hover:bg-stone-800 text-[#FAF9F5] text-xs font-semibold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-atelier active:scale-98 cursor-pointer"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag (₹{product.price * quantity})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct WhatsApp Question */}
              <a
                href={`https://wa.me/918147228162?text=${encodeURIComponent(
                  `Hi ${STORE_CONFIG.name}, I am inquiring about "${product.name}" (₹${product.price}). Do you have this in stock at your counter?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center text-xs text-stone-500 hover:text-emerald-700 py-1 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp counter at 8147228162</span>
              </a>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
