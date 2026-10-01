import React from 'react';
import { Award, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '../../config/brandConfig';
import { useOrders } from '../../hooks/useOrders';

export const AdminAnalytics: React.FC = () => {
  const { orders } = useOrders();

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status.toLowerCase() !== 'cancelled' ? o.total : 0),
    0
  );
  const totalItemsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, it) => iSum + it.quantity, 0),
    0
  );
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const categorySales = [
    { category: 'Necklaces & Pendants', percent: 38, revenue: Math.round(totalRevenue * 0.38) },
    { category: 'Earrings & Huggies', percent: 26, revenue: Math.round(totalRevenue * 0.26) },
    { category: 'Rings & Stacks', percent: 18, revenue: Math.round(totalRevenue * 0.18) },
    { category: 'Bracelets & Cuffs', percent: 11, revenue: Math.round(totalRevenue * 0.11) },
    { category: 'Jewelry Sets', percent: 7, revenue: Math.round(totalRevenue * 0.07) },
  ];

  const topSellers = [
    { name: 'Liquid Gold Herringbone Flat Chain', sales: 64, revenue: 140736 },
    { name: 'Minimal Baroque Pearl Pendant Necklace', sales: 52, revenue: 98748 },
    { name: 'Chubby Bold Huggie Hoops', sales: 48, revenue: 71952 },
    { name: 'The Golden Hour Layering Duo Set', sales: 31, revenue: 108469 },
    { name: 'Croissant Dome Signet Ring', sales: 29, revenue: 43471 },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-white">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-white">
          Atelier Revenue & Sales Analytics
        </h1>
        <p className="text-xs text-stone-400 font-light mt-1">
          Live analytics computed across {orders.length} orders and {totalItemsSold} fine jewelry pieces sold.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
            Average Order Value (AOV)
          </span>
          <p className="font-serif text-2xl font-bold text-white">{formatPrice(averageOrderValue)}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12% vs last month</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
            Checkout Conversion Rate
          </span>
          <p className="font-serif text-2xl font-bold text-white">4.82%</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Top tier for luxury fine jewelry</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
            Repeat VIP Purchase Rate
          </span>
          <p className="font-serif text-2xl font-bold text-white">34.6%</p>
          <p className="text-[11px] text-gold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Driven by 2-Year Anti-Tarnish trust</span>
          </p>
        </div>
      </div>

      {/* Category Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-5">
          <h3 className="font-serif text-lg font-semibold text-white">Sales by Category</h3>
          <div className="space-y-4">
            {categorySales.map((cat) => (
              <div key={cat.category} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span className="font-medium">{cat.category}</span>
                  <span className="font-mono text-gold">{formatPrice(cat.revenue)} ({cat.percent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Signature Best Sellers */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-white">Top 5 Signature Pieces</h3>
          <div className="divide-y divide-stone-800 text-xs">
            {topSellers.map((item, idx) => (
              <div key={item.name} className="py-3 first:pt-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-stone-500 font-mono font-bold">#{idx + 1}</span>
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-[10px] text-stone-500">{item.sales} units sold</p>
                  </div>
                </div>
                <span className="font-serif font-bold text-gold">{formatPrice(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
