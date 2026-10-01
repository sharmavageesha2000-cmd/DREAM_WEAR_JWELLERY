import { useEffect } from 'react';
import { brandConfig } from '../config/brandConfig';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
}

export const useSEO = ({ title, description, keywords }: SEOProps) => {
  useEffect(() => {
    // Set document title
    const fullTitle = title
      ? `${title} | ${brandConfig.name} Haute Minimal`
      : `${brandConfig.name} | Minimalist & 100% Anti-Tarnish Fine Jewelry`;
    document.title = fullTitle;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const defaultDesc =
      description ||
      'Shop waterproof, shower-safe, anti-tarnish 18K gold minimalist jewelry backed by a 2-Year Color Warranty.';

    if (metaDescription) {
      metaDescription.setAttribute('content', defaultDesc);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = defaultDesc;
      document.head.appendChild(meta);
    }

    // Set keywords if provided
    if (keywords && keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords.join(', '));
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', keywords.join(', '));
        document.head.appendChild(metaKeywords);
      }
    }
  }, [title, description, keywords]);
};
