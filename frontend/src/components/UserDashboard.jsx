import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { STORE_CONFIG } from '../constants/store';
import PrintStudio from './PrintStudio';
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Printer,
  Ticket,
  FileText,
  RotateCcw,
  LogOut,
  ArrowRight,
  Store,
  MapPin,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Edit3,
  Check,
  X
} from 'lucide-react';

export default function UserDashboard() {
  const { currentUser, logout, setCurrentView, updateProfile } = useAuth();
  const { cart, addToCart, setIsCartOpen, setPickupSlip } = useShop();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'print' | 'travel'
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Print Job State
  const [printFileName, setPrintFileName] = useState('');
  const [printType, setPrintType] = useState('Black & White (₹2/page)');
  const [copies, setCopies] = useState(1);
  const [binding, setBinding] = useState('None');
  const [printRemarks, setPrintRemarks] = useState('');
  const [printSubmitted, setPrintSubmitted] = useState(false);

  // Demo user orders for visualization
  const [userOrders, setUserOrders] = useState([
    {
      token: 'OSE-742',
      date: 'Today, 2:45 PM',
      status: 'READY', // 'RECEIVED' | 'PACKING' | 'READY' | 'COLLECTED'
      total: 719,
      pickupWindow: 'Today within 30-45 minutes',
      items: [
        { name: 'Classmate Pulse 6-Subject Notebook', brand: 'Classmate', qty: 2, price: 185 },
        { name: 'Parker Jotter Ballpoint Pen', brand: 'Parker', qty: 1, price: 349 }
      ]
    },
    {
      token: 'OSE-318',
      date: 'Yesterday, 11:20 AM',
      status: 'COLLECTED',
      total: 399,
      pickupWindow: 'Yesterday',
      items: [
        { name: 'Deli Mesh Metal Desk Organizer', brand: 'Deli', qty: 1, price: 399 }
      ]
    }
  ]);

  const handlePrintSubmit = (e) => {
    e.preventDefault();
    setPrintSubmitted(true);
    setTimeout(() => {
      setPrintSubmitted(false);
      setPrintFileName('');
      setPrintRemarks('');
    }, 4000);
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    if (!editName.trim()) return;

    updateProfile({
      name: editName.trim(),
      phone: editPhone ? editPhone.replace(/\D/g, '').slice(-10) : currentUser?.phone || ''
    });

    setIsEditingProfile(false);
    setProfileSuccessMsg('Profile updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 pb-16">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-[#141416] text-[#FAF9F5] pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold border border-amber-400/30 overflow-hidden shrink-0">
              {currentUser?.photo ? (
                <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                (currentUser?.name?.[0] || 'U').toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-white tracking-wide">
                  {currentUser?.name || 'Customer'}
                </span>
              </div>

              {!isEditingProfile ? (
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-stone-400 font-sans">
                      {currentUser?.phone ? `+91 ${currentUser.phone}` : (currentUser?.email || '')}
                    </p>
                    <button
                      onClick={() => {
                        setEditName(currentUser?.name || '');
                        setEditPhone(currentUser?.phone || '');
                        setIsEditingProfile(true);
                      }}
                      className="text-[11px] font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 underline underline-offset-2 cursor-pointer transition-colors"
                      title="Edit your details"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="mt-2 space-y-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your Name (e.g. Rahul Sharma)"
                      className="bg-stone-900 border border-stone-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                      autoFocus
                      required
                    />
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="WhatsApp Mobile (optional)"
                      maxLength={10}
                      className="bg-stone-900 border border-stone-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1 rounded-lg font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Check className="w-3 h-3" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="bg-white/10 hover:bg-white/20 text-stone-300 text-xs px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {profileSuccessMsg && (
                <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
                  ✓ {profileSuccessMsg}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentView('catalog')}
              className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold px-3.5 sm:px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              ← Back to Catalog
            </button>
            <button
              onClick={logout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs uppercase tracking-wider font-semibold px-3.5 sm:px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-1.5 shadow-atelier border border-warm-border flex items-center gap-1 max-w-lg mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-mono text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#141416] text-white shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-mono text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'print'
                ? 'bg-[#141416] text-white shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Xerox & Print</span>
          </button>
        </div>

        {/* Tab 1: Store Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between pb-2 border-b border-warm-border">
              <h3 className="text-xl font-bold text-[#141416]">
                Your Counter Collection Orders
              </h3>
              <button
                onClick={() => setCurrentView('catalog')}
                className="text-xs font-mono text-stone-600 hover:text-black flex items-center gap-1 underline"
              >
                <span>Add More Stationery</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userOrders.map((ord) => (
                <div
                  key={ord.token}
                  className="bg-white rounded-3xl p-6 border border-warm-border shadow-atelier space-y-4"
                >
                  {/* Order Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                        Pickup Token
                      </span>
                      <span className="font-mono text-xl font-bold text-[#141416]">
                        #{ord.token}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                        ord.status === 'READY'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                          : ord.status === 'PACKING'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {ord.status === 'READY'
                        ? 'Ready for Counter Pickup 📦'
                        : ord.status === 'PACKING'
                        ? 'Packing in Progress ⏳'
                        : 'Collected & Paid ✅'}
                    </span>
                  </div>

                  {/* Pickup Progress Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-3 text-center text-[9px] sm:text-[10px] font-mono gap-1">
                      <div className="text-emerald-700 font-bold">1. Placed ✓</div>
                      <div className={ord.status !== 'RECEIVED' ? 'text-emerald-700 font-bold' : 'text-stone-400'}>
                        2. Packed
                      </div>
                      <div className={ord.status === 'READY' || ord.status === 'COLLECTED' ? 'text-emerald-700 font-bold' : 'text-stone-400'}>
                        3. Counter Ready
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                        style={{
                          width: ord.status === 'READY' ? '100%' : ord.status === 'PACKING' ? '66%' : '33%'
                        }}
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs text-stone-700">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-50">
                        <span className="truncate pr-2">
                          <strong className="font-mono text-stone-400">{item.brand}:</strong> {item.name} (×{item.qty})
                        </span>
                        <span className="font-mono font-semibold text-stone-900 shrink-0">
                          ₹{item.price * item.qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Total Due at Shop:</span>
                      <span className="font-mono text-lg font-bold text-[#141416]">₹{ord.total}</span>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=${STORE_CONFIG.phone}&text=${encodeURIComponent(
                        `Hi OM SHIVAM ENTERPRISES, I am inquiring about my pickup token #${ord.token}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#141416] hover:bg-stone-800 text-white font-mono text-xs uppercase tracking-wider px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ask Counter</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: Xerox & Print Jobs */}
        {activeTab === 'print' && (
          <div className="max-w-3xl">
            <PrintStudio isModal={false} />
          </div>
        )}

      </div>

    </div>
  );
}
