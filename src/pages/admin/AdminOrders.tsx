import React, { useState } from 'react';
import { Search, Eye, MapPin } from 'lucide-react';
import { formatPrice } from '../../config/brandConfig';
import { Order } from '../../types';
import { Modal } from '../../components/common/Modal';
import { useOrders } from '../../hooks/useOrders';

export const AdminOrders: React.FC = () => {
  const { orders, changeStatus } = useOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.name.toLowerCase().includes(search.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase())) ||
      (o.shippingAddress.city && o.shippingAddress.city.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
    <div className="space-y-6 animate-fade-in text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-white">
            Orders & Fulfillment Hub
          </h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            Total {orders.length} orders placed • Live sync with customer checkout
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900 p-4 rounded-2xl border border-stone-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer, city, or AWB..."
            className="w-full pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 bg-stone-950 rounded-xl border border-stone-700 text-xs text-stone-300 focus:outline-none focus:border-gold"
          >
            <option value="all">All Order Statuses ({orders.length})</option>
            <option value="processing">Processing</option>
            <option value="shipped">In Transit / Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Placed Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Fulfillment Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    No orders matching your criteria found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-gold">{order.orderNumber}</td>
                    <td className="p-4 text-stone-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{order.shippingAddress.name}</p>
                      <p className="text-[11px] text-stone-400">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <p className="text-[10px] text-stone-500">{order.shippingAddress.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px] font-medium">
                        {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'}
                      </span>
                    </td>
                    <td className="p-4 font-serif font-bold text-sm text-white">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4">
                      <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded font-mono bg-stone-800 text-stone-300">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status.toLowerCase()}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider cursor-pointer bg-stone-950 ${getStatusBadge(
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
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-gold transition-colors inline-flex items-center gap-1 text-[11px]"
                        title="View Full Order Manifest"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Manifest: ${selectedOrder.orderNumber}`}
        >
          <div className="space-y-6 text-charcoal">
            {/* Top Bar Summary */}
            <div className="p-4 rounded-2xl bg-ivory border border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Placed On</p>
                <p className="text-xs font-semibold text-charcoal">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Courier AWB</p>
                <p className="text-xs font-mono font-bold text-gold-dark">
                  {selectedOrder.trackingNumber || 'BLUEDART-AUTOSYNC'}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Current Status</p>
                <select
                  value={selectedOrder.status.toLowerCase()}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="mt-0.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-white border border-stone-300"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <div className="flex items-center gap-1.5 text-gold-dark text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Customer & Delivery Address</span>
              </div>
              <div className="text-xs space-y-0.5 text-stone-700">
                <p className="font-semibold text-charcoal">{selectedOrder.shippingAddress.name}</p>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                  {selectedOrder.shippingAddress.postalCode}
                </p>
                <p className="text-stone-500 font-mono">Mobile: {selectedOrder.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Ordered Atelier Pieces ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center gap-3 bg-white">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-ivory flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-charcoal truncate">{item.productName}</p>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} • {item.finish || '18K Yellow Gold'}
                        {item.size ? ` • Size: ${item.size}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-charcoal">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials Breakdown */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({selectedOrder.couponCode})</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee ({selectedOrder.shippingMethod})</span>
                <span>{selectedOrder.shippingFee === 0 ? 'FREE' : formatPrice(selectedOrder.shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-charcoal">
                <span>Total Amount Paid</span>
                <span className="font-serif text-base text-gold-dark font-bold">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
