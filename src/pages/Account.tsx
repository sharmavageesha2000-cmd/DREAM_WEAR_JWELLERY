import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Truck,
  Eye,
  Settings,
  User as UserIcon,
  Sparkles,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../config/brandConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/ui/Button';
import { Order } from '../types';
import { useSEO } from '../hooks/useSEO';

export const Account: React.FC = () => {
  useSEO({
    title: 'Customer Dashboard & Orders | DREAM WEAR',
    description:
      'Track your DREAM WEAR fine jewelry shipments, manage saved delivery addresses, and view warranty certificates.',
  });

  const { user, isLoggedIn, logout, orders, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { wishlistCount } = useWishlist();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'wishlist' | 'addresses' | 'profile' | 'settings'
  >('overview');

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');

  if (!isLoggedIn || !user) {
    return (
      <div className="py-24 text-center bg-[#FAF8F5] min-h-[75vh] flex items-center">
        <div className="max-w-md mx-auto px-4 space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-white border border-stone-200 shadow-sm flex items-center justify-center mx-auto text-gold-dark">
            <UserIcon className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-light text-charcoal-dark">
              Sign in to your Account
            </h2>
            <p className="text-xs text-stone-500 font-light">
              Track orders, manage addresses, and view 2-Year Anti-Tarnish Warranty certificates.
            </p>
          </div>
          <Link to="/login">
            <Button variant="primary" size="lg" className="shadow-md">
              Sign In / Register
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostalCode) return;

    addAddress({
      name: user.name,
      phone: user.phone,
      street: newStreet,
      city: newCity,
      state: newState || 'Maharashtra',
      postalCode: newPostalCode,
      country: 'India',
      isDefault: user.savedAddresses.length === 0,
    });

    setShowAddressForm(false);
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewPostalCode('');
    showToast('New address saved to address book', 'success');
  };

  const getStatusBadge = (status: Order['status']) => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <Truck className="w-3 h-3 text-blue-600" /> In Transit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F5] min-h-[85vh] animate-fade-in text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-6 sm:space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Customer Account' }]} />

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>DREAM WEAR CIRCLE MEMBER</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal-dark tracking-tight">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Member since {user.joinedDate} • {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 hover:border-rose-300 hover:text-rose-600 text-xs font-semibold text-stone-600 transition-all cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* SaaS Dashboard Grid: Sidebar + Main Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-white p-3 rounded-3xl border border-stone-200/80 shadow-sm space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: Sparkles },
              { id: 'orders', label: 'Orders & Shipments', icon: Package, count: orders.length },
              { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, count: wishlistCount },
              { id: 'addresses', label: 'Address Book', icon: MapPin, count: user.savedAddresses.length },
              { id: 'profile', label: 'Profile Information', icon: UserIcon },
              { id: 'settings', label: 'Account Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-charcoal-dark hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-light' : 'text-stone-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-stone-800 text-gold-light' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Reward & Privileges Hero Card */}
                <div className="relative rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#F8F2E8] to-[#EFE2CE] text-[#332924] p-6 sm:p-8 overflow-hidden shadow-xl border border-amber-300/70">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 border border-amber-300/70 text-[#8E6A22] text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                        <Gift className="w-3 h-3 text-[#B88E3A]" />
                        <span>VIP Privileges</span>
                      </div>
                      <h3 className="font-serif text-2xl font-light text-[#2C2119]">
                        DREAM WEAR Gold Tier Status
                      </h3>
                      <p className="text-xs text-[#6B5A4E] font-light max-w-md">
                        Enjoy free express delivery on every order, complimentary gift packaging, and direct access to personal atelier styling concierge.
                      </p>
                    </div>

                    <Link to="/shop">
                      <Button variant="gold" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Explore Catalog
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Quick Metric Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      TOTAL ORDERS
                    </span>
                    <span className="font-serif text-3xl font-light text-charcoal-dark">
                      {orders.length}
                    </span>
                    <p className="text-[11px] text-stone-500 mt-1">All backed by 2-Yr Warranty</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      SAVED WISHLIST
                    </span>
                    <span className="font-serif text-3xl font-light text-charcoal-dark">
                      {wishlistCount}
                    </span>
                    <p className="text-[11px] text-stone-500 mt-1">
                      <Link to="/wishlist" className="text-gold-dark hover:underline font-medium">
                        View saved pieces →
                      </Link>
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      WARRANTY CERTIFICATES
                    </span>
                    <span className="font-serif text-3xl font-light text-charcoal-dark">
                      Active
                    </span>
                    <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed
                    </p>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <h3 className="font-serif text-lg font-medium text-charcoal-dark">
                      Recent Orders
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-gold-dark hover:underline font-semibold"
                    >
                      View all ({orders.length})
                    </button>
                  </div>

                  {orders.length > 0 ? (
                    <div className="divide-y divide-stone-100">
                      {orders.slice(0, 2).map((order) => (
                        <div key={order.id} className="py-4 flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-charcoal-dark">
                                #{order.orderNumber}
                              </span>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-xs text-stone-500 mt-1">
                              {order.items.length} items • {formatPrice(order.total)}
                            </p>
                          </div>

                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 py-4 text-center">No orders placed yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS */}
            {activeTab === 'orders' && (
              <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-6">
                <div className="pb-4 border-b border-stone-100">
                  <h3 className="font-serif text-xl font-medium text-charcoal-dark">
                    Order History & Live Shipments
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-0.5">
                    Track delivery status and download digital warranty certificates.
                  </p>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl bg-ivory-warm/60 border border-stone-200/80 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                          <div>
                            <span className="font-mono text-xs font-bold text-charcoal-dark block">
                              Order #{order.orderNumber}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(order.status)}
                            <span className="font-serif text-sm font-bold text-charcoal-dark">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Snapshot */}
                        <div className="flex items-center gap-3 overflow-x-auto pb-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 flex-shrink-0 bg-white p-2 rounded-xl border border-stone-200">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-10 h-10 rounded-lg object-cover bg-ivory-warm"
                              />
                              <div className="text-left pr-2">
                                <p className="text-xs font-semibold text-charcoal-dark truncate max-w-[140px]">
                                  {item.productName}
                                </p>
                                <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-stone-500 font-mono text-[11px]">
                            Tracking: {order.trackingNumber || 'BLUEDART-8921044'}
                          </span>
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => setSelectedOrder(order)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            View Order Summary
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-stone-500 text-xs">
                    <p className="font-serif text-lg text-charcoal-dark mb-1">No orders yet</p>
                    <p className="mb-4">When you place an order, it will appear here with live tracking.</p>
                    <Link to="/shop">
                      <Button variant="primary" size="sm">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: WISHLIST REDIRECT */}
            {activeTab === 'wishlist' && (
              <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm text-center space-y-4">
                <Heart className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="font-serif text-2xl font-light text-charcoal-dark">
                  You have {wishlistCount} saved pieces
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Revisit your favorites or move them to your bag anytime.
                </p>
                <Link to="/wishlist">
                  <Button variant="primary" size="md">
                    Open Wishlist Page
                  </Button>
                </Link>
              </div>
            )}

            {/* TAB 4: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-charcoal-dark">
                      Saved Delivery Addresses
                    </h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Manage default shipping addresses for 1-click checkout.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddressForm(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        addr.isDefault
                          ? 'border-gold bg-gold-light/10 shadow-2xs'
                          : 'border-stone-200 bg-ivory-warm/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-charcoal-dark">{addr.name}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-stone-900 text-white">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-light">{addr.street}</p>
                      <p className="text-xs text-stone-600 font-light">
                        {addr.city}, {addr.state} — {addr.postalCode}
                      </p>
                      <p className="text-xs text-stone-500 mt-1 font-mono">{addr.phone}</p>

                      <div className="flex items-center gap-3 pt-4 mt-3 border-t border-stone-200/80 text-xs">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-gold-dark hover:underline font-semibold cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteAddress(addr.id)}
                          className="text-stone-400 hover:text-rose-600 ml-auto cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PROFILE */}
            {activeTab === 'profile' && (
              <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-6">
                <div className="pb-4 border-b border-stone-100">
                  <h3 className="font-serif text-xl font-medium text-charcoal-dark">
                    Personal Profile
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-0.5">
                    Your personal information and verified contact details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-ivory-warm/60 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      FULL NAME
                    </span>
                    <span className="font-medium text-charcoal-dark text-sm">{user.name}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-ivory-warm/60 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      EMAIL ADDRESS
                    </span>
                    <span className="font-medium text-charcoal-dark text-sm">{user.email}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-ivory-warm/60 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      PHONE NUMBER
                    </span>
                    <span className="font-medium text-charcoal-dark text-sm">{user.phone}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-ivory-warm/60 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      MEMBERSHIP
                    </span>
                    <span className="font-medium text-gold-dark text-sm">Aurelia Circle VIP</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-6">
                <div className="pb-4 border-b border-stone-100">
                  <h3 className="font-serif text-xl font-medium text-charcoal-dark">
                    Account & Notification Settings
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-0.5">
                    Customize order SMS updates and email drops.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer">
                    <div>
                      <p className="font-semibold text-charcoal-dark">Order & Tracking Updates (SMS/WhatsApp)</p>
                      <p className="text-[11px] text-stone-500">Receive live dispatch notifications and OTP verification.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-stone-900 focus:ring-gold" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer">
                    <div>
                      <p className="font-semibold text-charcoal-dark">VIP Seasonal Drops & Private Sales</p>
                      <p className="text-[11px] text-stone-500">Early access to limited atelier drops before public release.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-stone-900 focus:ring-gold" />
                  </label>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Selected Order Summary Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs text-left">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <p className="text-[11px] text-stone-500">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p className="font-mono text-[11px] text-stone-700">Tracking: {selectedOrder.trackingNumber}</p>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Ordered Items
              </h4>
              <div className="divide-y divide-stone-100">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.productName} className="w-12 h-12 rounded-xl object-cover bg-ivory-warm border border-stone-200" />
                      <div>
                        <p className="font-semibold text-charcoal-dark">{it.productName}</p>
                        <p className="text-[11px] text-stone-500">{it.finish} • Qty {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-charcoal-dark">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="p-4 rounded-2xl bg-ivory-warm/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount ({selectedOrder.couponCode})</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-500">
                <span>Shipping</span>
                <span>{selectedOrder.shippingFee === 0 ? 'FREE' : formatPrice(selectedOrder.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-serif font-bold text-sm text-charcoal-dark pt-2 border-t border-stone-200">
                <span>Total Paid</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Address Modal */}
      {showAddressForm && (
        <Modal
          isOpen={showAddressForm}
          onClose={() => setShowAddressForm(false)}
          title="Add Delivery Address"
          maxWidth="md"
        >
          <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs text-left">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Street / Apartment *</label>
              <input
                type="text"
                required
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                placeholder="Flat 101, Palm Grove"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-gold text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-gold text-xs"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={newPostalCode}
                  onChange={(e) => setNewPostalCode(e.target.value)}
                  placeholder="400050"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-gold text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">State</label>
              <input
                type="text"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                placeholder="Maharashtra"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-gold text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddressForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Address
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
