import React from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import ShaderButton from './ShaderButton';
import { Plus, Minus, Eye, Star, Sparkles } from 'lucide-react';

export default function ProductCard({ product }) {
  const { cart, addToCart, updateCartQuantity, setQuickViewProduct } = useShop();
  const { requireAuth } = useAuth();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const discount = product.mrp ? product.mrp - product.price : 0;

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-warm-border/90 hover:border-amber-500/40 shadow-atelier hover:shadow-atelier-hover transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Product Image Area with Hover Zoom */}
      <div
        className="relative aspect-square bg-[#F7F5EE] overflow-hidden p-3.5 sm:p-5 md:p-6 flex items-center justify-center cursor-pointer transition-colors group-hover:bg-[#F2EFE7]"
        onClick={() => setQuickViewProduct(product)}
      >
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="bg-[#141416]/90 backdrop-blur-md text-[#FAF9F5] text-[8px] sm:text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full font-semibold shadow-xs border border-white/10">
              {product.badge}
            </span>
          ) : <span />}

          {discount > 0 && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full shadow-2xs">
              Save ₹{discount}
            </span>
          )}
        </div>

        {/* Quick View Hover Pill */}
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-[#141416] text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 border border-stone-200">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        
        <div>
          {/* Brand Tag & In Stock */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold text-amber-950 bg-amber-50 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md border border-amber-200/50 text-[10px] sm:text-[11px] truncate max-w-[90px] sm:max-w-none">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-stone-700 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-[11px] sm:text-xs">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="text-xs sm:text-sm md:text-base font-bold text-[#141416] line-clamp-2 leading-snug hover:text-amber-800 transition-colors cursor-pointer pt-0.5 tracking-tight"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-1 sm:line-clamp-2 mt-1 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Bag */}
        <div className="pt-2 sm:pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5 sm:gap-2">
          
          {/* Price */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base md:text-lg font-black text-[#141416] tracking-tight">
                ₹{product.price}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-700 font-medium truncate block">
              <span className="inline-block sm:hidden">● In Stock</span>
              <span className="hidden sm:inline">In Stock • Store Counter</span>
            </span>
          </div>

          {/* Bag Actions featuring Shader Button */}
          {cartItem ? (
            <div className="flex items-center bg-[#F4F2EC] border border-warm-border rounded-full p-0.5 shadow-2xs shrink-0">
              <button
                onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
              <span className="w-5 sm:w-7 text-center font-bold text-xs text-[#141416]">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
          ) : (
            <div className="shrink-0">
              <ShaderButton
                variant="shader-amber"
                size="sm"
                icon={Plus}
                onClick={() => requireAuth(() => addToCart(product, 1))}
                title={`Add ${product.name} to pickup bag`}
              >
                Add
              </ShaderButton>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
