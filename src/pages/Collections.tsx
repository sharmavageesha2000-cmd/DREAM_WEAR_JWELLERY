import React from 'react';
import { useParams } from 'react-router-dom';
import { Shop } from './Shop';
import { useSEO } from '../hooks/useSEO';

export const Collections: React.FC = () => {
  const { collectionSlug } = useParams<{ collectionSlug: string }>();

  const getCollectionTitle = () => {
    switch (collectionSlug) {
      case 'anti-tarnish':
        return '100% Anti-Tarnish & Waterproof Edit';
      case 'new-arrivals':
        return 'New Arrivals — Seasonal Drop';
      case 'best-sellers':
        return 'Best Selling Heirloom Pieces';
      case 'minimalist':
        return 'Everyday Minimalist Jewelry';
      default:
        return 'Curated Jewelry Collection';
    }
  };

  useSEO({
    title: getCollectionTitle(),
    description: `Discover our ${getCollectionTitle()} engineered in 18K Real Gold Vacuum PVD on medical-grade surgical stainless steel.`,
  });

  return <Shop />;
};
