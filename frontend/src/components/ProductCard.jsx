import React from 'react';
import { useShop } from '../context/ShopContext';
import { Plus, Minus, Eye, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const { cart, addToCart, updateCartQuantity, setQuickViewProduct } = useShop();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const discount = product.mrp ? product.mrp - product.price : 0;

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-warm-border/80 hover:border-stone-400/80 shadow-atelier hover:shadow-atelier-hover transition-all duration-500 flex flex-col justify-between overflow-hidden relative">
      
      {/* Product Image Area */}
      <div className="relative aspect-square bg-[#F4F2EC] overflow-hidden p-6 flex items-center justify-center cursor-pointer"
        onClick={() => setQuickViewProduct(product)}
      >
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="bg-[#141416] text-[#FAF9F5] text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full font-semibold shadow-xs">
              {product.badge}
            </span>
          ) : <span />}

          {discount > 0 && (
            <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
              Save ₹{discount}
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-[#141416] text-xs font-mono uppercase tracking-wider font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </div>

      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-stone-500 mb-1">
            <span>{product.brand}</span>
            <div className="flex items-center gap-1 text-stone-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="font-serif text-sm sm:text-base font-bold text-[#141416] line-clamp-2 leading-snug hover:text-[#D97706] transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Bag */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-base sm:text-lg font-bold text-[#141416]">
                ₹{product.price}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-stone-400 line-through font-mono">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-emerald-600 block">
              In Stock at Counter
            </span>
          </div>

          {/* Bag Actions */}
          {cartItem ? (
            <div className="flex items-center bg-[#F4F2EC] border border-warm-border rounded-full p-0.5">
              <button
                onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                className="w-7 h-7 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors shadow-xs"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-mono font-bold text-xs text-[#141416]">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                className="w-7 h-7 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors shadow-xs"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className="bg-[#141416] hover:bg-stone-800 active:scale-95 text-[#FAF9F5] font-mono text-xs uppercase tracking-wider font-semibold py-2 px-3.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
