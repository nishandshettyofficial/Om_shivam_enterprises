import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { STORE_CONFIG } from '../constants/store';
import {
  Store,
  Clock,
  CheckCircle2,
  Package,
  Printer,
  Ticket,
  Search,
  MessageCircle,
  LogOut,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function ShopkeeperDashboard() {
  const { currentUser, logout, setCurrentView } = useAuth();
  const { products } = useShop();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'print'
  const [orderFilter, setOrderFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COLLECTED'

  // Live Counter Orders State
  const [orders, setOrders] = useState([
    {
      token: 'OSE-742',
      customerName: 'Rahul Sharma',
      customerHandle: '@rahul_01',
      customerPhone: '9876543210',
      time: '12 mins ago',
      pickupWindow: 'Today within 30-45 minutes',
      extraNotes: 'Please pack 1 blue chart paper if available',
      status: 'RECEIVED', // 'RECEIVED' | 'PACKING' | 'READY' | 'COLLECTED'
      total: 719,
      items: [
        { name: 'Classmate Pulse 6-Subject Notebook', brand: 'Classmate', qty: 2, price: 185 },
        { name: 'Parker Jotter Ballpoint Pen (Blue)', brand: 'Parker', qty: 1, price: 349 }
      ]
    },
    {
      token: 'OSE-883',
      customerName: 'Priya Shetty',
      customerHandle: '@priya_art',
      customerPhone: '9812345678',
      time: '25 mins ago',
      pickupWindow: 'Today within 1-2 hours',
      extraNotes: 'Urgent for art class',
      status: 'PACKING',
      total: 929,
      items: [
        { name: 'Faber-Castell 48 Grip Pencils Set', brand: 'Faber-Castell', qty: 1, price: 499 },
        { name: 'Brustro A4 Watercolour Pad 300GSM', brand: 'Brustro', qty: 1, price: 430 }
      ]
    },
    {
      token: 'OSE-109',
      customerName: 'Arjun Kamath',
      customerHandle: '@arjun_eng',
      customerPhone: '9740011223',
      time: '1 hour ago',
      pickupWindow: 'Today Evening',
      extraNotes: 'Casio invoice required for college',
      status: 'READY',
      total: 1549,
      items: [
        { name: 'Casio FX-991CW ClassWiz Scientific Calculator', brand: 'Casio', qty: 1, price: 1549 }
      ]
    }
  ]);

  // Inventory Stock Toggle State
  const [stockState, setStockState] = useState(() => {
    const map = {};
    products.forEach((p) => { map[p.id] = true; });
    return map;
  });

  // Update order status handler
  const handleUpdateStatus = (token, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.token === token ? { ...o, status: newStatus } : o))
    );
  };

  // Toggle item stock
  const toggleStock = (id) => {
    setStockState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ACTIVE') return o.status !== 'COLLECTED';
    if (orderFilter === 'COLLECTED') return o.status === 'COLLECTED';
    return true;
  });

  // Calculate quick metrics
  const activeCount = orders.filter((o) => o.status !== 'COLLECTED').length;
  const readyCount = orders.filter((o) => o.status === 'READY').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-stone-900 pb-20">
      
      {/* Top Shopkeeper Admin Bar */}
      <header className="bg-[#141416] text-[#FAF9F5] px-4 sm:px-6 lg:px-8 py-4 border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold border border-amber-400/30">
              OS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">
                  {STORE_CONFIG.name}
                </h1>
                <span className="bg-amber-500 text-stone-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  Counter Operations Hub
                </span>
              </div>
              <p className="text-[11px] font-mono text-stone-400">
                Live In-Store Pickup Management • Logged in as Store Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('catalog')}
              className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              Public Catalog View
            </button>
            <button
              onClick={logout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-warm-border shadow-atelier">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Pending Pickups
              </span>
              <Package className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="font-mono text-3xl font-bold text-[#141416] mt-2">
              {activeCount} Orders
            </div>
            <span className="text-[11px] text-stone-500 font-sans mt-1 block">
              {readyCount} packed & ready on the shelf
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-warm-border shadow-atelier">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Estimated Counter Value
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-mono text-3xl font-bold text-[#141416] mt-2">
              ₹{totalRevenue}
            </div>
            <span className="text-[11px] text-stone-500 font-sans mt-1 block">
              Payable upon collection (UPI / Cash)
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-warm-border shadow-atelier">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Counter Packing Speed
              </span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-mono text-3xl font-bold text-[#141416] mt-2">
              15 Mins
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold font-mono mt-1 block">
              ● Counter #1 Operational
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 border-b border-warm-border pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 rounded-full font-mono text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#141416] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-warm-border'
              }`}
            >
              Live Orders Feed ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-2 px-4 rounded-full font-mono text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#141416] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-warm-border'
              }`}
            >
              Stock & Availability Manager
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="flex items-center gap-1.5 font-mono text-xs bg-white border border-warm-border p-1 rounded-full">
              {['ALL', 'ACTIVE', 'COLLECTED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOrderFilter(filter)}
                  className={`px-3 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                    orderFilter === filter
                      ? 'bg-[#141416] text-white font-bold'
                      : 'text-stone-600 hover:text-black'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: Live Orders Feed */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((ord) => (
              <div
                key={ord.token}
                className="bg-white rounded-3xl p-6 border border-warm-border shadow-atelier flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-[#141416]">
                        #{ord.token}
                      </span>
                      <span className="font-mono text-xs text-[#D97706] font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {ord.customerHandle}
                      </span>
                    </div>
                    <span className="text-xs text-stone-700 font-medium block mt-1">
                      {ord.customerName} • +91 {ord.customerPhone}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400 block mt-0.5">
                      Ordered {ord.time} • Window: {ord.pickupWindow}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      ord.status === 'READY'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : ord.status === 'PACKING'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : ord.status === 'COLLECTED'
                        ? 'bg-stone-100 text-stone-500'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs text-stone-800 flex-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    Supplies to Pack:
                  </span>
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-50">
                      <span className="truncate pr-2">
                        <strong>{item.qty}×</strong> {item.name}
                      </span>
                      <span className="font-mono font-semibold text-stone-900 shrink-0">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                  {ord.extraNotes && (
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 mt-2">
                      <strong>Customer Note:</strong> {ord.extraNotes}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-stone-100 space-y-3">
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-xs uppercase text-stone-500">Collect at Shop:</span>
                    <span className="text-xl font-bold text-[#141416]">₹{ord.total}</span>
                  </div>

                  {/* 1-Click Status Controls */}
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                    {ord.status === 'RECEIVED' && (
                      <button
                        onClick={() => handleUpdateStatus(ord.token, 'PACKING')}
                        className="col-span-2 bg-[#141416] hover:bg-stone-800 text-white py-2.5 px-3 rounded-full font-semibold transition-colors cursor-pointer"
                      >
                        Start Packing 📦
                      </button>
                    )}

                    {ord.status === 'PACKING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(ord.token, 'READY')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-full font-semibold transition-colors cursor-pointer"
                        >
                          Mark Ready ✓
                        </button>
                        <a
                          href={`https://api.whatsapp.com/send?phone=91${ord.customerPhone}&text=${encodeURIComponent(
                            `Hi ${ord.customerHandle}, your stationery order #${ord.token} (₹${ord.total}) is packed and ready for pickup at OM SHIVAM ENTERPRISES!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 px-3 rounded-full font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>
                      </>
                    )}

                    {ord.status === 'READY' && (
                      <button
                        onClick={() => handleUpdateStatus(ord.token, 'COLLECTED')}
                        className="col-span-2 bg-stone-900 hover:bg-black text-white py-2.5 px-3 rounded-full font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Collected & Paid (₹{ord.total})</span>
                      </button>
                    )}

                    {ord.status === 'COLLECTED' && (
                      <span className="col-span-2 text-center text-xs font-mono text-stone-400 py-1">
                        Completed & Handed Over
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Stock & Availability Manager */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-border shadow-atelier space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#141416]">
                Instant In-Store Stock Manager
              </h3>
              <p className="text-xs text-stone-500 font-light mt-1">
                Toggle products out of stock when an item runs out on your counter shelf today. Changes reflect in real time.
              </p>
            </div>

            <div className="divide-y divide-warm-border/60">
              {products.map((p) => {
                const inStock = stockState[p.id] !== false;
                return (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F4F2EC] p-1 flex items-center justify-center shrink-0 border border-warm-border">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">
                          {p.brand} • {p.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#141416]">
                          {p.name}
                        </h4>
                        <span className="font-mono text-xs text-stone-600 font-semibold">
                          ₹{p.price}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStock(p.id)}
                      className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                        inStock
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
                      }`}
                    >
                      {inStock ? '● In Stock' : '✕ Out of Stock'}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
