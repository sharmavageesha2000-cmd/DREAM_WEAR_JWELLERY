import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Package, Users, Tag, BarChart3, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';

export const AdminPlaceholder: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 bg-stone-950 text-white min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Scaffolding Notice */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <Shield className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-widest font-semibold">Admin Architecture Scaffolding</span>
            </div>
            <h1 className="font-serif text-3xl font-light text-white mt-1">
              {brandConfig.name} Atelier Portal
            </h1>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </Link>
        </div>

        {/* Readiness Info Card */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Customer Frontend Architecture Complete & REST API Ready</span>
          </div>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            This workspace is structured with logical separation between customer routes and future admin services. When connecting to your Node.js + Express + PostgreSQL backend, administrative controllers and protected authentication middleware will bind directly to this module.
          </p>
        </div>

        {/* Prepared Admin Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800/80 space-y-2">
            <Package className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-base font-semibold text-white">Product Catalog</h3>
            <p className="text-xs text-stone-400">Inventory, 18K PVD specs, dimensions, image uploads & stock alerts.</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800/80 space-y-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h3 className="font-serif text-base font-semibold text-white">Order Management</h3>
            <p className="text-xs text-stone-400">Fulfillment tracking, AWB generation, tax invoices & warranty registers.</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800/80 space-y-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <h3 className="font-serif text-base font-semibold text-white">Customers & VIPs</h3>
            <p className="text-xs text-stone-400">Customer profiles, addresses, order frequency & concierge history.</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800/80 space-y-2">
            <Tag className="w-6 h-6 text-rose-400" />
            <h3 className="font-serif text-base font-semibold text-white">Coupons & Promos</h3>
            <p className="text-xs text-stone-400">Dynamic discount rules, minimum order thresholds & flash sales.</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800/80 space-y-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <h3 className="font-serif text-base font-semibold text-white">Warranty Claims</h3>
            <p className="text-xs text-stone-400">2-Year Anti-Tarnish claim approvals and reverse pickup logistics.</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800/80 space-y-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <h3 className="font-serif text-base font-semibold text-white">Sales Analytics</h3>
            <p className="text-xs text-stone-400">Revenue, average order value, conversion rates & bestselling categories.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
