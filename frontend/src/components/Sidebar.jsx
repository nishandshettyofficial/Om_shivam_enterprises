import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { STORE_CONFIG } from '../constants/store';
import {
  ShoppingBag,
  Printer,
  Ticket,
  Receipt,
  Store,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  User
} from 'lucide-react';

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onOpenPrintModal
}) {
  const { currentView, setCurrentView, currentUser, isLoggedIn, isShopkeeper } = useAuth();
  const { products, shopMapsUrl } = useShop();

  const navItems = [
    {
      id: 'catalog',
      label: 'Store Catalog',
      icon: ShoppingBag,
      badge: `${products.length} Items`,
      action: () => setCurrentView('catalog')
    },
    {
      id: 'print-hub',
      label: 'Print & Xerox Studio',
      icon: Printer,
      badge: 'From ₹2',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20',
      action: () => {
        setCurrentView('print');
        setIsMobileOpen(false);
      }
    },
    {
      id: 'travel-tickets',
      label: 'Train, Bus & Air Tickets',
      icon: Ticket,
      badge: 'Counter',
      action: () => {
        window.open('https://wa.me/918147228162?text=Hello%20Om%20Shivam%2C%20I%20need%20assistance%20with%20Train%2FFlight%2FBus%20ticket%20booking.', '_blank');
      }
    },
    {
      id: 'user-dashboard',
      label: 'My Orders & Slips',
      icon: Receipt,
      action: () => {
        if (isLoggedIn) {
          setCurrentView('user-dashboard');
        } else {
          setCurrentView('signin');
        }
      }
    },
    {
      id: 'shopkeeper-dashboard',
      label: isShopkeeper ? 'Shopkeeper Admin' : 'Store Counter Mode',
      icon: Store,
      badge: isShopkeeper ? 'Staff' : null,
      action: () => setCurrentView('shopkeeper-dashboard')
    }
  ];

  const content = (
    <aside
      className={`h-full flex flex-col justify-between bg-[#121215] text-[#FAF9F5] border-r border-white/10 transition-all duration-300 z-40 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Branding */}
      <div>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div
            onClick={() => {
              setCurrentView('catalog');
              setIsMobileOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group truncate"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-black font-black text-sm flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              {STORE_CONFIG.monogram}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-bold text-sm tracking-tight text-white block truncate">
                  {STORE_CONFIG.shortName}
                </span>
                <p className="text-[11px] text-stone-400 truncate">
                  Stationery & Xerox Counter
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5">
          <div className="text-[11px] text-stone-400 font-semibold px-3 py-1">
            {!isCollapsed ? 'Services & Catalog' : '•••'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'print-hub' && (currentView === 'print' || currentView === 'print-hub'));

            return (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold shadow-inner'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-amber-400' : 'text-stone-400'
                  }`}
                />
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      item.badgeColor || 'bg-white/10 text-stone-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Store Status & Profile */}
      <div className="p-3 border-t border-white/10 space-y-3">
        
        {/* Store Location & Status Card */}
        {!isCollapsed ? (
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Store Counter Open
              </span>
              <span className="text-stone-400 text-[11px]">9AM – 9:30PM</span>
            </div>
            <a
              href={shopMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-xs text-stone-400 hover:text-amber-300 transition-colors pt-1 border-t border-white/5"
            >
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">BMS College Rd, BLR</span>
              </span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        ) : (
          <div className="flex justify-center" title="Store Open Today: 9:00 AM - 9:30 PM">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}

        {/* Profile Card / Sign In CTA */}
        {isLoggedIn ? (
          <div
            onClick={() => setCurrentView('user-dashboard')}
            className={`flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold shrink-0">
              {currentUser?.handle?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 truncate">
                <p className="text-xs font-medium text-white truncate">
                  {currentUser?.handle || 'User'}
                </p>
                <p className="text-[11px] text-stone-400 truncate">
                  {currentUser?.email || currentUser?.phone || 'Account'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setCurrentView('signin')}
            className={`w-full flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Sign In"
          >
            <User className="w-4 h-4 text-amber-400 shrink-0" />
            {!isCollapsed && <span>Sign In / Register</span>}
          </button>
        )}

      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen">
        {content}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
          />
          <div className="relative z-10 w-72 max-w-[80vw] h-full shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
