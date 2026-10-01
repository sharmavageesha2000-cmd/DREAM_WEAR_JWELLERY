import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { API_BASE_URL } from '../../services/api';

interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  isActive: boolean;
  usageCount: number;
}

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('aurelia_admin_coupons');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'c1',
        code: 'WELCOME10',
        type: 'percent',
        value: 10,
        minOrder: 0,
        isActive: true,
        usageCount: 84,
      },
      {
        id: 'c2',
        code: 'AURELIA200',
        type: 'flat',
        value: 200,
        minOrder: 1500,
        isActive: true,
        usageCount: 32,
      },
      {
        id: 'c3',
        code: 'SPARKLE',
        type: 'percent',
        value: 15,
        minOrder: 2500,
        isActive: true,
        usageCount: 19,
      },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percent' | 'flat'>('percent');
  const [newValue, setNewValue] = useState('');
  const [newMinOrder, setNewMinOrder] = useState('');

  // Fetch live coupons from backend PostgreSQL
  useEffect(() => {
    fetch(`${API_BASE_URL}/coupons`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: Coupon[] = json.data.map((c: any, idx: number) => ({
            id: `c-db-${idx}`,
            code: c.code,
            type: c.discountType === 'percentage' ? 'percent' : 'flat',
            value: Number(c.discountValue),
            minOrder: Number(c.minSpend || 0),
            isActive: !!c.isActive,
            usageCount: 0,
          }));
          setCoupons(mapped);
          localStorage.setItem('aurelia_admin_coupons', JSON.stringify(mapped));
        }
      })
      .catch((err) => console.warn('Coupons fetch fallback:', err));
  }, []);

  const handleToggleStatus = (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    setCoupons(updated);
    localStorage.setItem('aurelia_admin_coupons', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const target = coupons.find((c) => c.id === id);
    const updated = coupons.filter((c) => c.id !== id);
    setCoupons(updated);
    localStorage.setItem('aurelia_admin_coupons', JSON.stringify(updated));

    if (target) {
      fetch(`${API_BASE_URL}/coupons/${encodeURIComponent(target.code)}`, { method: 'DELETE' })
        .catch((err) => console.warn('Delete coupon API error:', err));
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newValue) return;

    const formattedCode = newCode.toUpperCase().trim();
    const val = parseInt(newValue, 10);
    const minSpend = newMinOrder ? parseInt(newMinOrder, 10) : 0;

    const newC: Coupon = {
      id: `c-${Date.now()}`,
      code: formattedCode,
      type: newType,
      value: val,
      minOrder: minSpend,
      isActive: true,
      usageCount: 0,
    };

    const updated = [newC, ...coupons];
    setCoupons(updated);
    localStorage.setItem('aurelia_admin_coupons', JSON.stringify(updated));

    // Sync to PostgreSQL database
    fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: formattedCode,
        discountType: newType === 'percent' ? 'percentage' : 'flat',
        discountValue: val,
        minSpend: minSpend,
        description: `Promo code ${formattedCode}`,
      }),
    }).catch((err) => console.warn('Create coupon API error:', err));

    setIsModalOpen(false);
    setNewCode('');
    setNewValue('');
    setNewMinOrder('');
  };


  return (
    <div className="space-y-6 animate-fade-in text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-white">
            Promotional Vouchers & Coupons
          </h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            Create discount codes, VIP privileges, and flash sale vouchers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-stone-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gold" />
                <span className="font-mono font-bold text-lg text-white tracking-widest">{c.code}</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleStatus(c.id)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  c.isActive
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                }`}
              >
                {c.isActive ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="text-xs text-stone-400 space-y-1">
              <p>
                Discount:{' '}
                <span className="text-white font-bold">
                  {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                </span>
              </p>
              <p>
                Min. Order:{' '}
                <span className="text-white">{c.minOrder > 0 ? `₹${c.minOrder}` : 'No Minimum'}</span>
              </p>
              <p>Redeemed: <span className="text-gold font-mono">{c.usageCount} times</span></p>
            </div>

            <div className="pt-2 border-t border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                aria-label="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Coupon Code"
          maxWidth="md"
        >
          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs text-stone-300">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase text-[10px]">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. SUMMER15"
                className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white uppercase font-mono text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase text-[10px]">
                  Discount Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as 'percent' | 'flat')}
                  className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white text-xs focus:outline-none focus:border-gold"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Cash (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase text-[10px]">
                  Value *
                </label>
                <input
                  type="number"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={newType === 'percent' ? '15' : '200'}
                  className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white font-mono text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase text-[10px]">
                Minimum Order Amount (₹)
              </label>
              <input
                type="number"
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(e.target.value)}
                placeholder="Optional (e.g. 1500)"
                className="w-full px-3.5 py-2.5 bg-stone-900 rounded-xl border border-stone-700 text-white font-mono text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-stone-950 font-bold uppercase tracking-wider shadow-md"
              >
                Create Code
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
