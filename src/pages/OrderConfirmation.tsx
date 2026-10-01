import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../config/brandConfig';

export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useAuth();

  const currentOrder = orders.find((o) => o.orderNumber === orderId || o.id === orderId) || orders[0];

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#EAD7A8', '#FAF8F5', '#2D2825'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 sm:py-20 bg-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Celebration Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-light/20 text-gold-dark text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Confirmed & Payment Secured</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal">
            Thank you for choosing DREAM WEAR
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto">
            Your anti-tarnish heirloom piece is being carefully hand-polished and packed in our signature velvet gift box.
          </p>

          <p className="font-mono text-xs font-bold text-charcoal bg-white inline-block px-4 py-2 rounded-xl border border-stone-200 shadow-sm">
            Order Reference: <span className="text-gold-dark font-bold">{orderId || currentOrder?.orderNumber || 'AUR-894102'}</span>
          </p>
        </div>

        {/* Order Details & Delivery Stepper Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-8">
          
          {/* Tracking Timeline Stepper */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal mb-4">
              Estimated Delivery: <span className="text-gold-dark normal-case">{currentOrder?.estimatedDelivery || 'In 3-5 business days'}</span>
            </h2>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-gold text-stone-900 font-bold flex items-center justify-center mx-auto shadow-sm">
                  ✓
                </div>
                <p className="font-semibold text-charcoal">Order Placed</p>
                <p className="text-stone-400 text-[10px]">Today</p>
              </div>

              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto border border-stone-200">
                  <Package className="w-4 h-4 text-gold-dark" />
                </div>
                <p className="font-medium text-stone-600">Polishing & Packing</p>
                <p className="text-stone-400 text-[10px]">Tomorrow</p>
              </div>

              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto border border-stone-200">
                  <Truck className="w-4 h-4" />
                </div>
                <p className="font-medium text-stone-600">In Transit</p>
                <p className="text-stone-400 text-[10px]">Day 3</p>
              </div>

              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto border border-stone-200">
                  🏠
                </div>
                <p className="font-medium text-stone-400">Delivered</p>
                <p className="text-stone-400 text-[10px]">Day 4-5</p>
              </div>
            </div>
          </div>

          {/* Ordered Items Breakdown */}
          {currentOrder && currentOrder.items && (
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <h2 className="font-serif text-lg font-semibold text-charcoal">Items in this Delivery</h2>
              <div className="divide-y divide-stone-100">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-14 rounded-xl object-cover bg-ivory border border-stone-200 flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-xs font-semibold text-charcoal">{item.productName}</h3>
                        <p className="text-[11px] text-stone-500">
                          Qty: {item.quantity} • Finish: {item.finish} {item.size ? `• Size: ${item.size}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-sm font-bold text-charcoal">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping & Payment Summary Breakdown */}
          <div className="pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600">
            <div>
              <h4 className="font-semibold uppercase tracking-wider text-charcoal mb-1">
                Delivery Address
              </h4>
              <p>{currentOrder?.shippingAddress?.name || 'Customer'}</p>
              <p>{currentOrder?.shippingAddress?.street}</p>
              <p>{currentOrder?.shippingAddress?.city}, {currentOrder?.shippingAddress?.state} {currentOrder?.shippingAddress?.postalCode}</p>
              <p>Phone: {currentOrder?.shippingAddress?.phone}</p>
            </div>

            <div>
              <h4 className="font-semibold uppercase tracking-wider text-charcoal mb-1">
                Payment Breakdown
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-semibold text-charcoal uppercase">{currentOrder?.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(currentOrder?.subtotal || 0)}</span>
                </div>
                {(currentOrder?.discount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-{formatPrice(currentOrder?.discount || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-charcoal pt-1 border-t border-stone-100">
                  <span>Grand Total</span>
                  <span className="font-serif text-sm">{formatPrice(currentOrder?.total || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warranty Certificate Tag */}
          <div className="p-4 rounded-2xl bg-ivory-warm border border-gold-satin/40 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-gold flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-charcoal">2-Year Anti-Tarnish Warranty Certificate Activated</p>
              <p className="text-stone-500">Your digital guarantee card is registered with this order reference.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-100">
            <Link
              to="/shop"
              className="flex-1 py-3.5 bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-3.5 bg-white border border-stone-200 text-charcoal text-xs font-semibold uppercase tracking-wider rounded-xl hover:border-gold flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
