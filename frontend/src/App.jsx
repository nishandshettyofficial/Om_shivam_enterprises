import React, { useMemo, useState, useEffect } from 'react';
import { useShop } from './context/ShopContext';
import { useAuth } from './context/AuthContext';
import { CATEGORIES, BRANDS, smartMatch } from './data/products';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ToolHubHero from './components/ToolHubHero';
import PrintUploadModal from './components/PrintUploadModal';
import PrintStudio from './components/PrintStudio';
import ProductCard from './components/ProductCard';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import CartDrawer from './components/CartDrawer';
import PickupSlipModal from './components/PickupSlipModal';
import SignInPage from './components/SignInPage';
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
    selectedBrand,
    setSelectedBrand,
    sortBy,
    setSortBy,
    viewMode,
    cartCount,
    cartTotal,
    setIsCartOpen
  } = useShop();

  const { currentView, setCurrentView } = useAuth();

  // Sidebar and Modal State with Smart Viewport Detection
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1180; // auto-collapse to compact rail on tablet / smaller laptops
    }
    return false;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Auto-adapt sidebar state when screen is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    // 1. Filter
    let list = products.filter((p) => {
      // Brand filter
      if (selectedBrand !== 'All Brands' && p.brand !== selectedBrand) {
        return false;
      }

      // If user is searching, apply smartMatch filter across catalog
      if (searchQuery.trim()) {
        return smartMatch(p, searchQuery);
      }

      // Category filter (active when not searching)
      if (selectedCategory !== 'All Items' && p.category !== selectedCategory) {
        return false;
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
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy]);

  const handleResetFilters = () => {
    setSelectedBrand('All Brands');
    setSelectedCategory('All Items');
    setSearchQuery('');
  };

  // 1. Dedicated Shopkeeper Counter Dashboard View
  if (currentView === 'shopkeeper-dashboard') {
    return (
      <div className="min-h-screen bg-[#F4F2EC] text-[#141416] antialiased">
        <ShopkeeperDashboard />
        <PickupSlipModal />
      </div>
    );
  }

  // Common Layout Shell with ToolHub Sidebar & Responsive Frame
  return (
    <div className="min-h-screen flex bg-[#FAF9F5] text-[#141416] antialiased selection:bg-[#141416] selection:text-white">
      
      {/* ToolHub Left Navigation Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Main App Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Header Bar */}
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          onOpenPrintModal={() => setIsPrintModalOpen(true)}
        />

        {/* View Routing */}
        {currentView === 'signin' ? (
          <main className="flex-1 w-full py-8 sm:py-12 flex items-center justify-center px-4">
            <SignInPage />
          </main>
        ) : currentView === 'user-dashboard' ? (
          <main className="flex-1 w-full">
            <UserDashboard />
          </main>
        ) : currentView === 'print' || currentView === 'print-hub' ? (
          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
            <PrintStudio isModal={false} />
          </main>
        ) : (
          /* Main Catalog Gallery View */
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
            
            {/* ToolHub Marketplace Hero Banner */}
            <ToolHubHero
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              onExploreCatalog={() => {
                const el = document.getElementById('marketplace-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Brand & Category Navigation Bar */}
            <div id="marketplace-catalog" className="space-y-3 pt-2">
              {/* Brand Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                <span className="text-xs text-stone-400 font-semibold mr-1">
                  Brand:
                </span>
                {BRANDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedBrand === b
                        ? 'bg-[#141416] text-white shadow-xs'
                        : 'bg-white hover:bg-stone-100 text-stone-600 border border-warm-border'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Category Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchQuery('');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat && !searchQuery
                        ? 'bg-[#141416] text-white shadow-xs font-semibold'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-warm-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header Status */}
            <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-warm-border/60">
              <div className="flex items-center gap-2 flex-wrap">
                <span>
                  Showing <span className="font-bold text-[#141416]">{processedProducts.length}</span> items
                  {selectedBrand !== 'All Brands' && (
                    <span> from <span className="text-stone-900 font-semibold">{selectedBrand}</span></span>
                  )}
                  {searchQuery ? (
                    <span className="ml-1.5 inline-flex items-center gap-1.5 bg-amber-100/90 text-amber-950 px-2.5 py-0.5 rounded-full font-semibold text-xs">
                      matching "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="hover:text-amber-700 font-bold ml-0.5 cursor-pointer"
                        title="Clear search filter"
                      >
                        ×
                      </button>
                    </span>
                  ) : selectedCategory !== 'All Items' && (
                    <span> in <span className="text-stone-800 font-semibold">{selectedCategory}</span></span>
                  )}
                </span>
                {(selectedBrand !== 'All Brands' || (selectedCategory !== 'All Items' && !searchQuery) || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-stone-400 hover:text-black text-xs underline ml-2 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-stone-700 text-xs font-medium focus:outline-none cursor-pointer"
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
              <div className="text-center py-16 bg-white rounded-3xl border border-warm-border p-8 space-y-4">
                <h3 className="text-xl font-bold tracking-tight text-[#141416] font-display">
                  No products found matching "{searchQuery}"
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your keywords or clearing your search filter to browse the full catalog.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 bg-[#141416] text-[#FAF9F5] px-4 py-2 rounded-full text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Search & Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Products Grid with adaptive column sizing */
              <div
                className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                  viewMode === 'spacious'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : isSidebarCollapsed
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {processedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </main>
        )}

        {/* Floating Mobile Cart Bar with iOS safe area support */}
        {cartCount > 0 && (
          <div className="sm:hidden fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 animate-slide-up">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-[#141416] text-[#FAF9F5] p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 active:scale-98 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="bg-[#D97706] text-white text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
                <span className="font-semibold text-xs tracking-wide">
                  Total: ₹{cartTotal}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-200">
                <span>View Bag</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>

      {/* Quick View Lightbox Modal */}
      <ProductQuickViewModal />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Digital Store Pickup Pass Modal */}
      <PickupSlipModal />

      {/* Martin Mroč Interactive Print & Xerox Studio Modal */}
      <PrintUploadModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

    </div>
  );
}
