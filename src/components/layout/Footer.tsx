import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ShieldCheck, Sparkles, Droplets, Heart } from 'lucide-react';
import { InstagramIcon, FacebookIcon, PinterestIcon } from '../common/SocialIcons';
import { brandConfig } from '../../config/brandConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F2ECE1] text-[#4A3E39] pt-10 pb-16 lg:pb-10 border-t border-[#DFD3C3] selection:bg-gold-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Feature Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-8 border-b border-[#E3D8C8] text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#DFCEB7] flex items-center justify-center text-[#B88E3A] mb-3 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold text-[#2C2119] uppercase tracking-wider">100% Anti-Tarnish</h4>
            <p className="text-[11px] text-[#6B5A4E] mt-0.5">2-Year Color Warranty</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#DFCEB7] flex items-center justify-center text-[#B88E3A] mb-3 shadow-2xs">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold text-[#2C2119] uppercase tracking-wider">Water Resistant</h4>
            <p className="text-[11px] text-[#6B5A4E] mt-0.5">Shower & Gym Safe</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#DFCEB7] flex items-center justify-center text-[#B88E3A] mb-3 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold text-[#2C2119] uppercase tracking-wider">18K Real Gold PVD</h4>
            <p className="text-[11px] text-[#6B5A4E] mt-0.5">316L Surgical Steel</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#DFCEB7] flex items-center justify-center text-[#B88E3A] mb-3 shadow-2xs">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold text-[#2C2119] uppercase tracking-wider">Skin Friendly</h4>
            <p className="text-[11px] text-[#6B5A4E] mt-0.5">Hypoallergenic & Nickel-Free</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-9">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden p-0.5 border border-amber-400/60 bg-[#FAF7F2] shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={brandConfig.badgeLogo}
                  alt={`${brandConfig.name} Logo`}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="font-brand font-bold text-2xl tracking-[0.22em] text-[#2C2119] uppercase leading-none group-hover:text-[#B88E3A] transition-colors">
                  {brandConfig.name}
                </h3>
                <span className="block text-[8px] font-brand tracking-[0.38em] uppercase text-[#8E6A22] mt-1 font-semibold">
                  HAUTE FINE JEWELRY
                </span>
              </div>
            </Link>
            <p className="text-xs text-[#6B5A4E] leading-relaxed max-w-sm">
              Crafting modern, timeless, and anti-tarnish fine jewelry designed for real life. Shower-safe, sweat-proof, and hypoallergenic.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#6B5A4E]">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#B88E3A] flex-shrink-0" />
                <span>{brandConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#B88E3A] flex-shrink-0" />
                <a href={`tel:${brandConfig.contact.phone}`} className="hover:text-[#B88E3A] transition-colors">
                  {brandConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#B88E3A] flex-shrink-0" />
                <a href={`mailto:${brandConfig.contact.email}`} className="hover:text-[#B88E3A] transition-colors">
                  {brandConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#2C2119]">
              Shop
            </h4>
            <ul className="space-y-2 text-xs text-[#6B5A4E]">
              <li>
                <Link to="/shop" className="hover:text-[#B88E3A] transition-colors">
                  All Jewelry
                </Link>
              </li>
              <li>
                <Link to="/shop?category=necklaces" className="hover:text-[#B88E3A] transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link to="/shop?category=earrings" className="hover:text-[#B88E3A] transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link to="/shop?category=rings" className="hover:text-[#B88E3A] transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bracelets" className="hover:text-[#B88E3A] transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=anklets" className="hover:text-[#B88E3A] transition-colors">
                  Anklets & Payals
                </Link>
              </li>
              <li>
                <Link to="/shop?category=nose-pins" className="hover:text-[#B88E3A] transition-colors">
                  Nose Pins & Rings
                </Link>
              </li>
              <li>
                <Link to="/shop?category=toe-rings" className="hover:text-[#B88E3A] transition-colors">
                  Toe Rings & Bichiyas
                </Link>
              </li>
              <li>
                <Link to="/shop?collection=new-arrivals" className="hover:text-[#B88E3A] transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Col: Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#2C2119]">
              Help
            </h4>
            <ul className="space-y-2 text-xs text-[#6B5A4E]">
              <li>
                <Link to="/contact" className="hover:text-[#B88E3A] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-[#B88E3A] transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#B88E3A] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#B88E3A] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#B88E3A] transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Col: Company & Follow */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#2C2119]">
                Company
              </h4>
              <ul className="space-y-2 text-xs text-[#6B5A4E]">
                <li>
                  <Link to="/about" className="hover:text-[#B88E3A] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/about#story" className="hover:text-[#B88E3A] transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-[#B88E3A] transition-colors">
                    Privacy & Terms
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#2C2119]">
                Follow
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href={brandConfig.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-[#DFCEB7] flex items-center justify-center text-[#6B5A4E] hover:text-[#B88E3A] hover:border-amber-400 transition-all shadow-2xs"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={brandConfig.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-[#DFCEB7] flex items-center justify-center text-[#6B5A4E] hover:text-[#B88E3A] hover:border-amber-400 transition-all shadow-2xs"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={brandConfig.social.pinterest}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-[#DFCEB7] flex items-center justify-center text-[#6B5A4E] hover:text-[#B88E3A] hover:border-amber-400 transition-all shadow-2xs"
                  aria-label="Pinterest"
                >
                  <PinterestIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-5 border-t border-[#DFD3C3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7C6C60]">
          <p>© 2026 {brandConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[#7C6C60]">
            <Link to="/privacy" className="hover:text-[#2C2119] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/privacy" className="hover:text-[#2C2119] transition-colors">
              Terms of Service
            </Link>
            <Link to="/admin/login" className="hover:text-[#B88E3A] text-[#8E7E73] transition-colors">
              Atelier Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
