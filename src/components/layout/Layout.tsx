import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { BottomMobileBar } from './BottomMobileBar';
import { Footer } from './Footer';
import { SearchModal } from '../ui/SearchModal';
import { CartDrawer } from '../cart/CartDrawer';
import { QuickViewModal } from '../product/QuickViewModal';
import { Product } from '../../types';

export const Layout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const location = useLocation();

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Global event listener for custom quick view triggers
  useEffect(() => {
    const handleOpenQuickView = (e: CustomEvent<Product>) => {
      setQuickViewProduct(e.detail);
    };
    window.addEventListener('open-quick-view' as unknown as keyof WindowEventMap, handleOpenQuickView as EventListener);
    return () => {
      window.removeEventListener('open-quick-view' as unknown as keyof WindowEventMap, handleOpenQuickView as EventListener);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-ivory text-charcoal-dark selection:bg-gold-light/40">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Main Responsive Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
      />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Global Slide-in Cart Drawer */}
      <CartDrawer />

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Page Content Outlet */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet context={{ onQuickView: (p: Product) => setQuickViewProduct(p) }} />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Sticky Bottom Bar for Mobile Ergonomics */}
      <BottomMobileBar />
    </div>
  );
};
