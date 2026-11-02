import React, { useMemo } from 'react';
import { useShop } from './context/ShopContext';
import { useAuth } from './context/AuthContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import EditorialStory from './components/EditorialStory';
import CartDrawer from './components/CartDrawer';
import PickupSlipModal from './components/PickupSlipModal';
import AuthModal from './components/AuthModal';
import UserDashboard from './components/UserDashboard';
import ShopkeeperDashboard from './components/ShopkeeperDashboard';
import Footer from './components/Footer';
import { ArrowRight, RotateCcw } from 'lucide-react';

export default function App() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    viewMode,
    cartCount,
    cartTotal,
    setIsCartOpen
  } = useShop();

  const { currentView } = useAuth();

  // Filter and sort products
  const processedProducts = useMemo(() => {
    // 1. Filter
    let list = products.filter((p) => {
      if (selectedCategory !== 'All Items' && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // 2. Sort
    return list.sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      // 'curated' default: featured first, then original order
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All Items');
    setSearchQuery('');
  };

  // 1. Dedicated Shopkeeper Counter Dashboard View
  if (currentView === 'shopkeeper-dashboard') {
    return (
      <div className="min-h-screen bg-[#F4F2EC] text-[#141416] antialiased">
        <ShopkeeperDashboard />
        <AuthModal />
        <PickupSlipModal />
      </div>
    );
  }

  // 2. Customer Dashboard & Orders View
  if (currentView === 'user-dashboard') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141416] antialiased selection:bg-[#141416] selection:text-white">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 w-full">
          <UserDashboard />
        </main>
        <Footer />
        <AuthModal />
        <ProductQuickViewModal />
        <CartDrawer />
        <PickupSlipModal />
      </div>
    );
  }

  // 3. Main Store Catalog Gallery View
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141416] antialiased selection:bg-[#141416] selection:text-white">
      {/* Top Ticker Bar */}
      <AnnouncementBar />

      {/* Main Glass Navigation */}
      <Header />

      {/* Main Catalog Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* Results Header Status */}
        <div className="flex items-center justify-between text-xs font-mono text-stone-500 pb-2 border-b border-warm-border/60">
          <div className="flex items-center gap-2">
            <span>
              Showing <span className="font-bold text-[#141416]">{processedProducts.length}</span> items
              {selectedCategory !== 'All Items' && (
                <span> in <span className="text-stone-800 font-semibold">{selectedCategory}</span></span>
              )}
            </span>
            {(selectedCategory !== 'All Items' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-stone-400 hover:text-black text-[11px] underline ml-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-stone-700 text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="curated">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Empty State if filter yields zero */}
        {processedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-warm-border p-8 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#141416]">
              No stationery matches your current search
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't find any products matching "{searchQuery}". Try selecting another category or resetting the search filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-[#141416] text-[#FAF9F5] px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          /* Products Grid with dynamic viewMode */
          <div
            className={`grid gap-4 sm:gap-6 ${
              viewMode === 'spacious'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {processedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>

      {/* Editorial Story / Brand Trust Section */}
      <EditorialStory />

      {/* Floating Mobile Cart Bar */}
      {cartCount > 0 && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40 animate-slide-up">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#141416] text-[#FAF9F5] p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-[#D97706] text-white text-[10px] font-mono font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
              <span className="font-mono font-semibold text-xs tracking-wide">
                Total: ₹{cartTotal}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-bold text-amber-200">
              <span>View Bag</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Unified Verification & PIN Auth Modal */}
      <AuthModal />

      {/* Quick View Lightbox Modal */}
      <ProductQuickViewModal />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Digital Store Pickup Pass Modal */}
      <PickupSlipModal />

      {/* Editorial Luxury Footer */}
      <Footer />
    </div>
  );
}
