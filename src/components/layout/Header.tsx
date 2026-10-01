import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Droplets,
  ArrowRight,
  Gift,
  Flame,
  Clock,
  BookOpen,
  Mail,
  Gem,
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenMobileNav }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setHoveredMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setHoveredMenu(null);
  }, [location.pathname, location.search]);

  const clearCloseTimeouts = () => {
    closeTimeoutRef.current.forEach((t) => clearTimeout(t));
    closeTimeoutRef.current = [];
  };

  const handleMouseEnter = (menuKey: string) => {
    clearCloseTimeouts();
    setHoveredMenu(menuKey);
  };

  const handleMouseLeave = () => {
    clearCloseTimeouts();
    const t = setTimeout(() => {
      setHoveredMenu(null);
    }, 220); // 220ms grace buffer ensures smooth transition into dropdown menu
    closeTimeoutRef.current.push(t);
  };

  const navLinks = [
    { key: 'home', label: 'Home', to: '/' },
    { key: 'shop', label: 'Shop', to: '/shop' },
    { key: 'new-arrivals', label: 'New Arrivals', to: '/shop?collection=new-arrivals' },
    { key: 'collections', label: 'Collections', to: '/shop?collection=anti-tarnish' },
    { key: 'about', label: 'About Us', to: '/about' },
  ];

  const isLinkActive = (to: string) => {
    if (to === '/') {
      return location.pathname === '/' && !location.search;
    }
    if (to.includes('?')) {
      const [path, query] = to.split('?');
      return location.pathname === path && location.search.includes(query);
    }
    return location.pathname.startsWith(to) && !location.search;
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs border-b border-stone-200/80 py-2.5'
          : 'bg-[#FAF7F2] py-2.5 sm:py-3.5 border-b border-stone-200/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={onOpenMobileNav}
              className="p-1.5 text-stone-900 hover:text-gold-dark lg:hidden rounded-lg hover:bg-stone-100/80 transition-colors cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <Link
              to="/"
              className="group flex items-center gap-2.5 sm:gap-3.5 select-none hover:opacity-95 transition-all duration-300"
            >
              {/* Brand Logo .png */}
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden p-0.5 shadow-xs group-hover:scale-105 group-hover:shadow-sm transition-all duration-300 border border-amber-400/60 bg-[#FAF7F2] flex-shrink-0 ring-1 ring-amber-300/30">
                <img
                  src={brandConfig.badgeLogo}
                  alt={`${brandConfig.name} Logo`}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              {/* Stylish Brand Name Typography */}
              <div className="flex flex-col text-left">
                <span className="font-brand font-bold text-xl sm:text-2xl tracking-[0.22em] text-[#2C2119] uppercase leading-none drop-shadow-xs group-hover:text-amber-900 transition-colors">
                  {brandConfig.name}
                </span>
                <span className="text-[8px] sm:text-[9px] font-brand tracking-[0.38em] uppercase text-amber-700/90 font-semibold pl-0.5 pt-1">
                  HAUTE FINE JEWELRY
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links with Automatic Hover Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-xs font-semibold uppercase tracking-[0.16em] text-stone-850">
            {navLinks.map((link) => {
              const active = isLinkActive(link.to);
              const isHovered = hoveredMenu === link.key;

              return (
                <div
                  key={link.key}
                  className="relative group py-2"
                  onMouseEnter={() => handleMouseEnter(link.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={link.to}
                    onClick={(e) => {
                      if (hoveredMenu === link.key) {
                        setHoveredMenu(null);
                      } else {
                        e.preventDefault();
                        clearCloseTimeouts();
                        setHoveredMenu(link.key);
                      }
                    }}
                    className={`transition-colors py-1 inline-flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                      active || isHovered
                        ? 'text-[#2C2119] font-bold'
                        : 'text-stone-700 hover:text-[#B88E3A]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${
                        isHovered ? 'rotate-180 text-[#B88E3A]' : 'group-hover:rotate-180'
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#B88E3A] transition-all duration-300 ${
                        active || isHovered ? 'w-full' : 'w-0'
                      }`}
                    />
                  </Link>

                  {/* ======================================================== */}
                  {/* AUTOMATIC DROPDOWN MENU ON HOVER FOR EACH HEADING */}
                  {/* ======================================================== */}
                  {isHovered && (
                    <div
                      className="absolute top-full -left-6 pt-3 z-50 animate-fade-in-up"
                      onMouseEnter={() => handleMouseEnter(link.key)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* ==================================================== */}
                      {/* 1. HOME DROPDOWN */}
                      {/* ==================================================== */}
                      {link.key === 'home' && (
                        <div className="w-[520px] bg-white rounded-2xl border border-stone-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] p-6 text-left text-charcoal-dark overflow-hidden">
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-7 space-y-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                                ATELIER SECTIONS
                              </span>

                              <Link
                                to="/#anti-tarnish"
                                className="group/sub flex items-start gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold-dark flex items-center justify-center shrink-0 mt-0.5">
                                  <Droplets className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/sub:text-gold-dark transition-colors flex items-center gap-1.5">
                                    <span>Anti-Tarnish Showcase</span>
                                    <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 uppercase">
                                      Try-On
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-normal mt-0.5">
                                    Shower-safe 18K Real Gold on surgical steel
                                  </p>
                                </div>
                              </Link>

                              <Link
                                to="/#trending"
                                className="group/sub flex items-start gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/sub:text-gold-dark transition-colors flex items-center gap-1.5">
                                    <span>Trending Curations</span>
                                    <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 uppercase">
                                      Marquee
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-normal mt-0.5">
                                    Capsules styled for your signature aesthetic
                                  </p>
                                </div>
                              </Link>

                              <Link
                                to="/#instagram"
                                className="group/sub flex items-start gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                                  <Heart className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/sub:text-rose-600 transition-colors">
                                    Follow Our Atelier
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-normal mt-0.5">
                                    Daily fine jewelry styling & community gallery
                                  </p>
                                </div>
                              </Link>
                            </div>

                            <div className="col-span-5 bg-[#FAF7F2] rounded-xl p-4 flex flex-col justify-between border border-[#E5DDD0]">
                              <div>
                                <div className="w-8 h-8 rounded-lg bg-white border border-[#DFCEB7] text-[#B88E3A] flex items-center justify-center mb-2.5 shadow-2xs">
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h4 className="text-xs font-bold text-[#2C2119] uppercase tracking-wider">
                                  2-Year Warranty
                                </h4>
                                <p className="text-[10px] text-stone-500 font-light mt-1 leading-relaxed">
                                  Full color replacement if your piece ever fades or discolors.
                                </p>
                              </div>

                              <Link
                                to="/shop"
                                className="inline-flex items-center justify-between text-[11px] font-bold text-charcoal-dark hover:text-gold-dark pt-3 border-t border-stone-300/80"
                              >
                                <span>Explore Catalog</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ==================================================== */}
                      {/* 2. SHOP DROPDOWN (FULL LUXURY MEGA-MENU) */}
                      {/* ==================================================== */}
                      {link.key === 'shop' && (
                        <div className="w-[740px] bg-white rounded-2xl border border-stone-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] p-6 text-left text-charcoal-dark overflow-hidden">
                          <div className="grid grid-cols-12 gap-6">
                            {/* Column 1: Fine Categories */}
                            <div className="col-span-4 space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                                JEWELRY CATEGORIES
                              </span>
                              {[
                                { name: 'Necklaces & Pendants', to: '/shop?category=necklaces' },
                                { name: 'Earrings & Huggie Hoops', to: '/shop?category=earrings' },
                                { name: 'Rings & Signet Domes', to: '/shop?category=rings' },
                                { name: 'Bracelets & Cuffs', to: '/shop?category=bracelets' },
                                { name: 'Anklets & Chains', to: '/shop?category=anklets' },
                                { name: 'Curated Gift Sets', to: '/shop?category=sets' },
                              ].map((cat) => (
                                <Link
                                  key={cat.name}
                                  to={cat.to}
                                  className="block text-xs font-medium text-stone-700 hover:text-gold-dark hover:translate-x-1 transition-all py-1"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                            </div>

                            {/* Column 2: Material & Finishes */}
                            <div className="col-span-4 space-y-2 border-l border-stone-100 pl-5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                                MATERIAL & CRAFT
                              </span>
                              {[
                                { name: '18K Vacuum PVD Gold', tag: 'Shower Safe', to: '/shop?collection=anti-tarnish' },
                                { name: '316L Surgical Steel', tag: 'Hypoallergenic', to: '/shop?collection=minimalist' },
                                { name: 'Marine Baroque Pearls', tag: 'Organic Luster', to: '/shop?search=pearl' },
                                { name: '5A CZ Diamond Crystals', tag: 'Party Ready', to: '/shop?search=tennis' },
                              ].map((mat) => (
                                <Link
                                  key={mat.name}
                                  to={mat.to}
                                  className="block group/m py-1 text-xs"
                                >
                                  <div className="font-medium text-stone-800 group-hover/m:text-gold-dark transition-colors">
                                    {mat.name}
                                  </div>
                                  <span className="text-[9px] text-stone-400">{mat.tag}</span>
                                </Link>
                              ))}
                            </div>

                            {/* Column 3: Visual Featured Promo */}
                            <div className="col-span-4 bg-gradient-to-br from-[#FAF7F2] via-[#F4ECE1] to-[#EAE0D0] text-[#2C2119] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden border border-[#DFCEB7] shadow-xs">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
                              <div className="relative z-10">
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/95 text-[#8E6A22] border border-amber-300/60 inline-block mb-2 shadow-2xs">
                                  Anti-Tarnish Core
                                </span>
                                <h4 className="font-serif text-base font-medium leading-snug text-[#2C2119]">
                                  18K Real Gold on Surgical Steel
                                </h4>
                                <p className="text-[10px] text-[#6B5A4E] font-light mt-1">
                                  Shower, swim, and sweat without worry.
                                </p>
                              </div>

                              <Link
                                to="/shop"
                                className="relative z-10 inline-flex items-center justify-between text-[11px] font-bold text-[#8E6A22] hover:text-[#584128] pt-3 border-t border-[#DFCEB7]"
                              >
                                <span>Shop All Pieces</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ==================================================== */}
                      {/* 3. NEW ARRIVALS DROPDOWN */}
                      {/* ==================================================== */}
                      {link.key === 'new-arrivals' && (
                        <div className="w-[620px] bg-white rounded-2xl border border-stone-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] p-6 text-left text-charcoal-dark overflow-hidden">
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-7 space-y-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                                LATEST STUDIO DROPS
                              </span>

                              <Link
                                to="/shop?collection=new-arrivals"
                                className="group/n flex items-start gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold-dark flex items-center justify-center shrink-0 mt-0.5">
                                  <Flame className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/n:text-gold-dark transition-colors flex items-center gap-1.5">
                                    <span>This Week's Fresh Drop</span>
                                    <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 uppercase">
                                      New
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-normal mt-0.5">
                                    Minimalist summer paperclip & herringbone chains
                                  </p>
                                </div>
                              </Link>

                              <Link
                                to="/shop?collection=golden-hour"
                                className="group/n flex items-start gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/n:text-gold-dark transition-colors">
                                    The Golden Hour Edit
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-normal mt-0.5">
                                    Warm luster rings & huggies for everyday stacking
                                  </p>
                                </div>
                              </Link>

                              <Link
                                to="/shop?sort=bestselling"
                                className="group/n flex items-start gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                                  <Gem className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/n:text-gold-dark transition-colors">
                                    Back in Stock Icons
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-normal mt-0.5">
                                    Restocked Croissant dome rings & tennis cuffs
                                  </p>
                                </div>
                              </Link>
                            </div>

                            <div className="col-span-5 bg-stone-50 rounded-xl p-4 flex flex-col justify-between border border-stone-200/80">
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-gold-dark block mb-1">
                                  ATELIER EDIT
                                </span>
                                <h4 className="font-serif text-base font-normal text-charcoal-dark leading-snug">
                                  Handcrafted in Paris & London
                                </h4>
                                <p className="text-[10px] text-stone-500 font-light mt-1">
                                  Limited small-batch production for ethical longevity.
                                </p>
                              </div>

                              <Link
                                to="/shop?collection=new-arrivals"
                                className="inline-flex items-center justify-between text-[11px] font-bold text-charcoal-dark hover:text-gold-dark pt-3 border-t border-stone-300/80"
                              >
                                <span>View All New</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ==================================================== */}
                      {/* 4. COLLECTIONS DROPDOWN */}
                      {/* ==================================================== */}
                      {link.key === 'collections' && (
                        <div className="w-[660px] bg-white rounded-2xl border border-stone-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] p-6 text-left text-charcoal-dark overflow-hidden">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                            SIGNATURE CAPSULES
                          </span>

                          <div className="grid grid-cols-2 gap-3">
                            {[
                              {
                                title: 'The Anti-Tarnish Edit',
                                desc: 'Shower-safe 18K Real Gold on surgical steel',
                                tag: 'Core Signature',
                                to: '/shop?collection=anti-tarnish',
                                icon: ShieldCheck,
                              },
                              {
                                title: 'Everyday Minimalist',
                                desc: 'Subtle chains & dainty bands for clean aesthetics',
                                tag: 'Daily Essentials',
                                to: '/shop?collection=minimalist',
                                icon: Sparkles,
                              },
                              {
                                title: 'Curated Gift Sets',
                                desc: 'Pairings in signature silk box packaging',
                                tag: 'Save up to 25%',
                                to: '/shop?category=sets',
                                icon: Gift,
                              },
                              {
                                title: 'The Statement Edit',
                                desc: '5A CZ Tennis crystal shimmer for celebrations',
                                tag: 'Party Ready',
                                to: '/shop?category=bracelets',
                                icon: Gem,
                              },
                            ].map((col) => {
                              const Icon = col.icon;
                              return (
                                <Link
                                  key={col.title}
                                  to={col.to}
                                  className="group/c p-3 rounded-xl border border-stone-100 hover:border-gold/50 hover:bg-stone-50/80 transition-all flex items-start gap-3"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 group-hover/c:bg-gold/15 group-hover/c:text-gold-dark flex items-center justify-center shrink-0 transition-colors">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-semibold text-charcoal-dark group-hover/c:text-gold-dark transition-colors truncate">
                                        {col.title}
                                      </span>
                                    </div>
                                    <span className="text-[9px] font-semibold text-gold-dark block mt-0.5">
                                      {col.tag}
                                    </span>
                                    <p className="text-[10px] text-stone-500 font-light mt-0.5 line-clamp-1">
                                      {col.desc}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-stone-500 font-light">
                              Backed by our 2-Year Color Replacement Guarantee.
                            </span>
                            <Link
                              to="/shop"
                              className="font-bold text-charcoal-dark hover:text-gold-dark flex items-center gap-1"
                            >
                              <span>Explore All Capsules</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* ==================================================== */}
                      {/* 5. ABOUT DROPDOWN */}
                      {/* ==================================================== */}
                      {link.key === 'about' && (
                        <div className="w-[540px] bg-white rounded-2xl border border-stone-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] p-6 text-left text-charcoal-dark overflow-hidden">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                                OUR ATELIER
                              </span>

                              <Link
                                to="/about#story"
                                className="group/a flex items-start gap-2.5 py-1"
                              >
                                <BookOpen className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/a:text-gold-dark transition-colors">
                                    Our Story & Philosophy
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-light">
                                    The Haute Minimalist Movement
                                  </p>
                                </div>
                              </Link>

                              <Link
                                to="/about#science"
                                className="group/a flex items-start gap-2.5 py-1"
                              >
                                <Sparkles className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/a:text-gold-dark transition-colors">
                                    Anti-Tarnish Science
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-light">
                                    18K Vacuum PVD Technology
                                  </p>
                                </div>
                              </Link>

                              <Link
                                to="/about#warranty"
                                className="group/a flex items-start gap-2.5 py-1"
                              >
                                <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/a:text-gold-dark transition-colors">
                                    2-Year Color Warranty
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-light">
                                    Guaranteed 730-Day Protection
                                  </p>
                                </div>
                              </Link>
                            </div>

                            <div className="space-y-3 border-l border-stone-100 pl-5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                                CLIENT CARE
                              </span>

                              <Link
                                to="/about#care"
                                className="group/a flex items-start gap-2.5 py-1"
                              >
                                <Droplets className="w-4 h-4 text-stone-500 group-hover/a:text-gold-dark shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/a:text-gold-dark transition-colors">
                                    Jewelry Care Guide
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-light">
                                    Easy cleaning & maintenance
                                  </p>
                                </div>
                              </Link>

                              <Link
                                to="/contact"
                                className="group/a flex items-start gap-2.5 py-1"
                              >
                                <Mail className="w-4 h-4 text-stone-500 group-hover/a:text-gold-dark shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs font-semibold text-charcoal-dark group-hover/a:text-gold-dark transition-colors">
                                    Concierge Contact
                                  </div>
                                  <p className="text-[10px] text-stone-500 font-light">
                                    Paris & London Atelier Support
                                  </p>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right: SaaS-Inspired Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-stone-900 flex-shrink-0">
            {/* Command-Palette Style Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="group hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200/80 hover:border-gold/60 text-stone-500 hover:text-stone-900 transition-all shadow-2xs cursor-pointer text-xs"
              title="Search jewelry (⌘K)"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-gold-dark transition-colors" />
              <span className="hidden md:inline font-normal text-[11px] text-stone-400">Search jewelry...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-stone-100 text-stone-500 rounded border border-stone-200">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="sm:hidden p-2 text-stone-800 hover:text-gold-dark rounded-full hover:bg-stone-100/80 transition-colors"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Account Icon */}
            <Link
              to="/account"
              className="p-2 text-stone-800 hover:text-gold-dark rounded-full hover:bg-stone-100/80 transition-colors relative"
              title={isLoggedIn ? 'Account Dashboard' : 'Sign In'}
              aria-label="Account"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
              {isLoggedIn && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-stone-800 hover:text-gold-dark rounded-full hover:bg-stone-100/80 transition-colors relative"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B88E3A] text-white text-[9px] font-bold flex items-center justify-center shadow-2xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer group active:scale-95"
              title="Shopping Cart"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
              <span className="text-[11px] font-bold">{itemCount}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
