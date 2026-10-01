import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { brandConfig } from '../../config/brandConfig';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAdmin(password);
      if (result.success) {
        setIsLoading(false);
        navigate('/admin/dashboard');
      } else {
        setIsLoading(false);
        setError(result.message || 'Incorrect password. Access denied.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-white selection:bg-gold selection:text-stone-950">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-dark/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-stone-800/20 rounded-full blur-2xl pointer-events-none" />

      {/* Return to Customer Store Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-gold transition-colors py-2 px-3.5 rounded-xl bg-stone-900/80 border border-stone-800 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Store</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-900 border border-gold/40 shadow-gold-glow mb-2 text-gold">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-[0.25em] text-white">
            {brandConfig.name}
          </h1>
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans font-semibold">
            Executive Atelier Portal
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-stone-900/90 backdrop-blur-xl border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="font-serif text-xl font-medium text-white">
              Administrator Authentication
            </h2>
            <p className="text-xs text-stone-400 font-light">
              Enter your master passcode to manage products, orders, inventory & store analytics.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2"
              >
                Enter Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter administrator password..."
                  className="w-full pl-4 pr-11 py-3.5 bg-stone-950/80 rounded-2xl border border-stone-700 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-gold to-gold-light hover:to-gold text-stone-950 text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Unlock Atelier Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="pt-4 border-t border-stone-800/80 flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Encrypted Session • Single-Tenant Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
