import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { brandConfig } from '../config/brandConfig';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('vageesha@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (isRegister) {
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);

    const actualPassword = password && password !== '••••••••' ? password : 'password123';

    try {
      if (isRegister) {
        await register(name || 'DREAM WEAR VIP', email, phone, actualPassword);
        showToast('Welcome to the DREAM WEAR Circle! Account created.', 'success');
      } else {
        await login(email, name, actualPassword);
        showToast('Signed in successfully.', 'success');
      }
      setLoading(false);
      navigate('/account');
    } catch {
      setLoading(false);
      setValidationError('Authentication failed. Please check your credentials.');
    }
  };


  return (
    <div className="py-12 sm:py-20 bg-ivory">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        
        {/* Brand Top */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-3xl font-medium tracking-[0.25em] text-charcoal">
              {brandConfig.name}
            </h1>
            <span className="text-[9px] uppercase tracking-[0.35em] text-gold-dark font-sans block -mt-0.5">
              Maison Portal
            </span>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-luxury space-y-6">
          
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-ivory rounded-2xl border border-stone-200 text-xs font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setValidationError(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                !isRegister ? 'bg-white text-charcoal shadow-sm' : 'text-stone-500 hover:text-charcoal'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setValidationError(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                isRegister ? 'bg-white text-charcoal shadow-sm' : 'text-stone-500 hover:text-charcoal'
              }`}
            >
              Register
            </button>
          </div>

          <div className="text-center">
            <h2 className="font-serif text-xl font-medium text-charcoal">
              {isRegister ? 'Create Your Atelier Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-light">
              {isRegister
                ? 'Unlock 10% welcome privilege & 2-year warranty tracking'
                : 'Sign in to access saved pieces and order history'}
            </p>
          </div>

          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {validationError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vageesha Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-stone-600">Password</label>
                {!isRegister && (
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Password reset link sent to your email', 'info');
                    }}
                    className="text-[11px] text-stone-400 hover:text-gold-dark"
                  >
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold font-mono"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-ivory rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-gold focus:ring-gold border-stone-300"
                  />
                  <span>Remember me</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Register & Join VIP' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <p className="text-[10px] text-stone-400 text-center uppercase tracking-wider">Or continue with</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  login('google.user@example.com', 'Google User');
                  showToast('Signed in with Google', 'success');
                  navigate('/account');
                }}
                className="py-2.5 px-3 bg-ivory border border-stone-200 hover:border-stone-300 rounded-xl text-xs font-medium text-charcoal flex items-center justify-center gap-2 transition-colors"
              >
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('apple.user@example.com', 'Apple User');
                  showToast('Signed in with Apple', 'success');
                  navigate('/account');
                }}
                className="py-2.5 px-3 bg-ivory border border-stone-200 hover:border-stone-300 rounded-xl text-xs font-medium text-charcoal flex items-center justify-center gap-2 transition-colors"
              >
                <span>Apple</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/shop"
              className="text-xs text-stone-500 hover:text-gold-dark underline"
            >
              Continue as Guest & Browse Collection
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
