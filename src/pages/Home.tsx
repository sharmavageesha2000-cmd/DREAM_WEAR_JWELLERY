import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { TrustSection } from '../components/home/TrustSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { BestSellersGrid } from '../components/home/BestSellersGrid';
import { AntiTarnishHighlight } from '../components/home/AntiTarnishHighlight';
import { InteractiveMaterialSection } from '../components/home/InteractiveMaterialSection';
import { TrendingBentoGrid } from '../components/home/TrendingBentoGrid';
import { TestimonialCarousel } from '../components/home/TestimonialCarousel';
import { InstagramGrid } from '../components/home/InstagramGrid';
import { LuxuryPackagingUnboxing } from '../components/home/LuxuryPackagingUnboxing';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { Product } from '../types';
import { useSEO } from '../hooks/useSEO';

export const Home: React.FC = () => {
  const { onQuickView } = useOutletContext<{ onQuickView: (product: Product) => void }>();

  useSEO({
    title: 'DREAM WEAR — Haute Minimalist & Anti-Tarnish 18K Gold Fine Jewelry',
    description:
      'Minimal, timeless and made for everyday moments. Shower-safe, sweat-proof fine jewelry crafted with 18K Real Gold Vacuum PVD on surgical steel. Backed by a 2-Year Color Warranty.',
    keywords: [
      'anti-tarnish jewelry',
      'waterproof jewelry',
      '18k gold necklace',
      'minimalist earrings',
      'huggie hoops',
      'pearl pendant',
      'wave cuff bracelet',
    ],
  });

  return (
    <div className="animate-fade-in w-full overflow-x-hidden">
      {/* 1. Immersive Split-Screen Hero */}
      <HeroSection />

      {/* 2. Premium SaaS Trust Feature Strip */}
      <TrustSection />

      {/* 3. Editorial Asymmetric Category Section */}
      <CategoryGrid />

      {/* 4. New Arrivals Product Showcase */}
      <NewArrivalsSection onQuickView={onQuickView} />

      {/* 5. Anti-Tarnish Story Section (Why Anti-Tarnish / Made For Real Life) */}
      <AntiTarnishHighlight />

      {/* 6. Best Sellers Horizontal Showcase */}
      <BestSellersGrid onQuickView={onQuickView} />

      {/* 7. Interactive Material Innovation Section */}
      <InteractiveMaterialSection />

      {/* 8. Trending Collections Bento Grid */}
      <TrendingBentoGrid />

      {/* 9. Social Proof & Customer Reviews */}
      <TestimonialCarousel />


      {/* 11. Instagram Community Masonry Grid ("Follow Our Atelier") */}
      <InstagramGrid />

      {/* 12. Signature Packaging Experience & Unboxing Ritual */}
      <LuxuryPackagingUnboxing />

      {/* 13. VIP SaaS Newsletter Card */}
      <NewsletterSection />
    </div>
  );
};
