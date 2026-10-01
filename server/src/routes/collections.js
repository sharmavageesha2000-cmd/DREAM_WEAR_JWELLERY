import express from 'express';

const router = express.Router();

const COLLECTIONS = [
  { id: 'anti-tarnish', name: '100% Anti-Tarnish Edit', description: 'Waterproof 18K Real Gold on Medical Steel', badge: 'Signature Guarantee' },
  { id: 'best-sellers', name: 'Best Sellers', description: 'Most-loved heirloom pieces', badge: 'Top Rated' },
  { id: 'new-arrivals', name: 'New Arrivals', description: 'Freshly designed seasonal pieces', badge: 'Just In' },
  { id: 'minimalist', name: 'Everyday Minimalist', description: 'Understated elegance for daily wear', badge: 'Clean Luxury' },
];

router.get('/', (req, res) => {
  res.json({ success: true, data: COLLECTIONS });
});

export default router;
