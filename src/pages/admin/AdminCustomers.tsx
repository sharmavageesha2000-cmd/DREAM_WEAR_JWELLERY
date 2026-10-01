import React, { useState } from 'react';
import { Search, Mail, Phone, MapPin, ShieldCheck, Users } from 'lucide-react';
import { formatPrice } from '../../config/brandConfig';
import { useOrders } from '../../hooks/useOrders';

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  hasWarranty: boolean;
}

export const AdminCustomers: React.FC = () => {
  const { orders } = useOrders();
  const [search, setSearch] = useState('');

  // Derive active VIP customer directory directly from live orders + seed list
  const customers: CustomerItem[] = React.useMemo(() => {
    const map = new Map<string, CustomerItem>();

    // Initial base clients
    const baseClients: CustomerItem[] = [
      {
        id: 'usr-1',
        name: 'Vageesha Sharma',
        email: 'vageesha@example.com',
        phone: '+91 98765 43210',
        city: 'Mumbai',
        totalOrders: 4,
        totalSpent: 9840,
        joinedDate: 'Aug 2024',
        hasWarranty: true,
      },
      {
        id: 'usr-2',
        name: 'Ananya Roy',
        email: 'ananya.roy@example.com',
        phone: '+91 98111 22334',
        city: 'New Delhi',
        totalOrders: 2,
        totalSpent: 5297,
        joinedDate: 'Sep 2024',
        hasWarranty: true,
      },
      {
        id: 'usr-3',
        name: 'Kavya Pillai',
        email: 'kavya.p@example.com',
        phone: '+91 99444 55667',
        city: 'Bengaluru',
        totalOrders: 3,
        totalSpent: 7396,
        joinedDate: 'Oct 2024',
        hasWarranty: true,
      },
      {
        id: 'usr-4',
        name: 'Rhea Deshmukh',
        email: 'rhea.d@example.com',
        phone: '+91 98200 44332',
        city: 'Pune',
        totalOrders: 1,
        totalSpent: 2499,
        joinedDate: 'Nov 2024',
        hasWarranty: true,
      },
    ];

    baseClients.forEach((c) => map.set(c.phone || c.name, c));

    // Overlay with all real placed orders
    orders.forEach((order) => {
      const key = order.shippingAddress.phone || order.shippingAddress.name;
      const existing = map.get(key);
      if (existing) {
        // If from base clients, update
        existing.totalSpent += order.total;
        existing.totalOrders += 1;
      } else {
        map.set(key, {
          id: `usr-${order.id}`,
          name: order.shippingAddress.name,
          email: `${order.shippingAddress.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@gmail.com`,
          phone: order.shippingAddress.phone,
          city: order.shippingAddress.city,
          totalOrders: 1,
          totalSpent: order.total,
          joinedDate: new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
          hasWarranty: true,
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-white">
            VIP Client Directory
          </h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            Registered clientele, lifetime luxury spend, and 2-Year Anti-Tarnish Warranty registrations.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono text-gold">
          <Users className="w-4 h-4" />
          <span>{customers.length} VIP Clients Active</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, city..."
            className="w-full pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Client Name</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">City</th>
                <th className="p-4 font-semibold">Orders Placed</th>
                <th className="p-4 font-semibold">Lifetime Spend</th>
                <th className="p-4 font-semibold">Warranty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-[10px] text-stone-500">Joined {c.joinedDate}</p>
                  </td>
                  <td className="p-4 space-y-0.5">
                    <p className="flex items-center gap-1 text-stone-300">
                      <Mail className="w-3 h-3 text-gold" />
                      <span>{c.email}</span>
                    </p>
                    <p className="flex items-center gap-1 text-stone-400 font-mono text-[11px]">
                      <Phone className="w-3 h-3 text-stone-500" />
                      <span>{c.phone}</span>
                    </p>
                  </td>
                  <td className="p-4 text-stone-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-500" />
                      {c.city}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-200 font-mono font-bold text-[11px]">
                      {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                    </span>
                  </td>
                  <td className="p-4 font-serif font-bold text-sm text-gold">
                    {formatPrice(c.totalSpent)}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] uppercase font-bold tracking-wider">
                      <ShieldCheck className="w-3 h-3" />
                      2-Yr Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
