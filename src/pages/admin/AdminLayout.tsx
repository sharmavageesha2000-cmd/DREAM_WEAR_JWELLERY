import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Bell,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { brandConfig } from '../../config/brandConfig';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdminLoggedIn, logoutAdmin } = useAdminAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  const navItems = [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', to: '/admin/products', icon: Package },
    { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', to: '/admin/customers', icon: Users },
    { label: 'Coupons & Promos', to: '/admin/coupons', icon: Tag },
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-stone-900 border-r border-stone-800 p-5 fixed inset-y-0 left-0 z-30">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-stone-800 border border-gold/40 flex items-center justify-center text-gold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-widest text-white leading-tight">
                {brandConfig.name}
              </h2>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold block font-sans">
                Atelier Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold uppercase tracking-wider">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.to ||
                (item.to === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/'));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gold text-stone-950 font-bold shadow-gold-glow'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-6 border-t border-stone-800">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-xs font-medium text-stone-300 transition-colors"
          >
            <span>Live Customer Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock & Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-400 hover:text-white rounded-lg"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest hidden sm:inline">
              Executive Management Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 text-stone-400 hover:text-white relative rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-stone-800">
              <div className="w-8 h-8 rounded-full bg-gold-dark/30 border border-gold flex items-center justify-center font-serif text-xs font-bold text-gold">
                V
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-none">Vageesha</p>
                <p className="text-[10px] text-stone-400 leading-tight">Master Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Child Page Contents */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-[#2C2119]/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-stone-900 border-r border-stone-800 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-gold" />
                  <span className="font-serif font-bold text-sm text-white tracking-wider">
                    {brandConfig.name} Admin
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-stone-400 hover:text-white"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 text-xs font-semibold uppercase tracking-wider">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gold text-stone-950 font-bold'
                          : 'text-stone-400 hover:text-white hover:bg-stone-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-stone-800 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-stone-800 text-xs font-semibold text-white"
              >
                View Customer Store
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center py-2 text-xs font-semibold text-rose-400"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
