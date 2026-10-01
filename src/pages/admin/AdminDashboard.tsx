import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
  Eye,
} from 'lucide-react';
import { getStoredProducts } from '../../data/products';
import { formatPrice } from '../../config/brandConfig';
import { Order } from '../../types';
import { useOrders } from '../../hooks/useOrders';
import { Modal } from '../../components/common/Modal';

export const AdminDashboard: React.FC = () => {
  const { orders, changeStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Dynamic Metrics
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status.toLowerCase() !== 'cancelled' ? o.total : 0),
    0
  );
  const processingCount = orders.filter((o) => o.status.toLowerCase() === 'processing').length;
  const shippedCount = orders.filter((o) => o.status.toLowerCase() === 'shipped').length;

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    changeStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80';
      case 'shipped':
        return 'bg-sky-950/80 text-sky-300 border border-sky-800/80';
      case 'processing':
        return 'bg-amber-950/80 text-amber-300 border border-amber-800/80';
      case 'cancelled':
        return 'bg-rose-950/80 text-rose-300 border border-rose-800/80';
      default:
        return 'bg-stone-800 text-stone-300 border border-stone-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-gold font-semibold font-mono">
              Live Atelier Node
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-white mt-1">
            Executive Dashboard
          </h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            Real-time analytics for Velora Luxury Jewelry atelier.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="px-4 py-2.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 shadow-md flex items-center gap-1.5"
          >
            <span>View Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Revenue */}
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800/90 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-light text-white">
            {formatPrice(totalRevenue)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="font-semibold font-mono">Live Computed</span>
            <span className="text-stone-500">• {orders.length} transactions</span>
          </div>
        </div>

        {/* Metric 2: Orders */}
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800/90 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-light text-white">
            {orders.length}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <span className="text-amber-400 font-mono font-semibold">{processingCount} Processing</span>
            <span>•</span>
            <span className="text-sky-400 font-mono font-semibold">{shippedCount} In Transit</span>
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800/90 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
              Active Pieces
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-light text-white">
            {getStoredProducts().length}
          </p>
          <p className="text-[11px] text-stone-400">
            100% Anti-Tarnish 18K Real Gold PVD
          </p>
        </div>

        {/* Metric 4: Registered VIPs */}
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800/90 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
              VIP Clients
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-light text-white">
            142
          </p>
          <p className="text-[11px] text-stone-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-gold" />
            <span>2-Year Warranty registered</span>
          </p>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <h2 className="font-serif text-lg sm:text-xl font-light text-white">
              Recent Store Orders
            </h2>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs text-gold hover:underline flex items-center gap-1 font-mono uppercase tracking-wider"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px]">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Pieces</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-gold">{order.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{order.shippingAddress.name}</p>
                      <p className="text-[10px] text-stone-500">{order.shippingAddress.city}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px]">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>
                    <td className="p-4 font-serif font-bold text-sm text-white">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4">
                      <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded font-mono bg-stone-800 text-stone-300">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status.toLowerCase()}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider cursor-pointer bg-stone-950 ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-gold transition-colors inline-flex items-center gap-1 text-[11px]"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manifest Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order: ${selectedOrder.orderNumber}`}
        >
          <div className="space-y-4 text-xs text-charcoal">
            <div className="p-3 bg-ivory rounded-xl flex justify-between">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Customer</span>
                <span className="font-bold">{selectedOrder.shippingAddress.name}</span>
                <p className="text-[11px] text-stone-600">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}</p>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block text-[10px] uppercase">Status</span>
                <span className="font-bold uppercase text-gold-dark">{selectedOrder.status}</span>
              </div>
            </div>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <img src={it.image} alt={it.productName} className="w-10 h-10 object-cover rounded" />
                    <div>
                      <p className="font-semibold">{it.productName}</p>
                      <p className="text-[10px] text-stone-500">Qty: {it.quantity} • {it.finish}</p>
                    </div>
                  </div>
                  <span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-stone-50 rounded-xl flex justify-between font-bold text-sm">
              <span>Total Paid</span>
              <span className="text-gold-dark">{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
