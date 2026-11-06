import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { STORE_CONFIG } from '../constants/store';
import confetti from 'canvas-confetti';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [products] = useState(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [sortBy, setSortBy] = useState('curated'); // 'curated', 'price-low', 'price-high', 'rating'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (4-col) or 'spacious' (3-col)
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pickupSlip, setPickupSlip] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORE_CONFIG.cart.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Shop WhatsApp & Location
  const [shopPhone, setShopPhone] = useState(STORE_CONFIG.phone);
  const [shopMapsUrl] = useState(STORE_CONFIG.mapsUrl);

  useEffect(() => {
    localStorage.setItem(STORE_CONFIG.cart.storageKey, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Total savings compared to MRP
  const cartSavings = cart.reduce((sum, item) => {
    const mrp = item.product.mrp || item.product.price;
    return sum + (mrp - item.product.price) * item.quantity;
  }, 0);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#141416', '#BAA58E', '#D97706', '#E8E1D3']
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        cartSavings,
        isCartOpen,
        setIsCartOpen,
        pickupSlip,
        setPickupSlip,
        quickViewProduct,
        setQuickViewProduct,
        shopPhone,
        setShopPhone,
        shopMapsUrl,
        triggerConfetti,
        storeConfig: STORE_CONFIG
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
