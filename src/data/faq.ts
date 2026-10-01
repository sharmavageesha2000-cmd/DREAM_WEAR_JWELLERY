export interface FAQItem {
  question: string;
  answer: string;
  category: 'products' | 'anti-tarnish' | 'shipping' | 'returns' | 'payments' | 'orders';
}

export const faqItems: FAQItem[] = [
  // Products
  {
    category: 'products',
    question: 'What materials are used in AURELIA fine jewelry?',
    answer: 'All our pieces are engineered with 316L medical-grade surgical stainless steel, layered with 18K Real Gold using high-vacuum Physical Vapor Deposition (PVD). We also use genuine AAA freshwater cultured pearls and micro-prong set 5A Cubic Zirconia diamond simulants.',
  },
  {
    category: 'products',
    question: 'How do I find my ring size or necklace length?',
    answer: 'We offer standard US sizes (6, 7, 8, 9) and adjustable open cuffs. All necklaces include a built-in 2-inch (5cm) extender chain so you can customize your drape between choker length and collarbone drop.',
  },
  // Anti-Tarnish
  {
    category: 'anti-tarnish',
    question: 'What makes AURELIA jewelry 100% Anti-Tarnish and Waterproof?',
    answer: 'Unlike conventional fast-fashion jewelry that uses thin electroplating over cheap copper/brass, our Physical Vapor Deposition (PVD) bonds real 18K gold at an atomic level inside a vacuum chamber. This creates a coating 10x thicker that does not peel, fade, or react with water, sweat, perfume, or humidity.',
  },
  {
    category: 'anti-tarnish',
    question: 'Can I shower, swim in the ocean, or workout wearing my jewelry?',
    answer: 'Yes, 100%! All our anti-tarnish jewelry is engineered for 24/7 non-stop wear. You can shower, wash hands, swim in pools and the ocean, and workout without fear of tarnishing or green skin.',
  },
  {
    category: 'anti-tarnish',
    question: 'What does the 2-Year Anti-Tarnish Guarantee cover?',
    answer: 'Every piece is protected by our 2-Year Color Warranty. If your jewelry experiences any discoloration, fading, or tarnishing from everyday wear within 2 years, we will replace it with a brand-new piece immediately.',
  },
  // Shipping
  {
    category: 'shipping',
    question: 'What are your delivery timelines and shipping charges?',
    answer: 'We provide FREE Express Shipping across India on all orders above ₹999. Orders below ₹999 have a flat ₹99 fee. Metro cities receive parcels in 2-3 business days; all other locations take 3-5 business days.',
  },
  {
    category: 'shipping',
    question: 'How can I track my package once dispatched?',
    answer: 'As soon as your order is dispatched from our Mumbai Atelier, you will receive an automated SMS and email containing your live tracking link with Bluedart or Delhivery.',
  },
  // Returns
  {
    category: 'returns',
    question: 'What is your return & exchange policy?',
    answer: 'We offer a 7-day hassle-free return and exchange policy from the date of delivery. Items must be unworn and in their original packaging with tags and warranty card intact.',
  },
  {
    category: 'returns',
    question: 'How do I claim a 2-Year Warranty replacement?',
    answer: 'Simply email concierge@aureliajewelry.com or message us on WhatsApp with your Order ID and photo. We will arrange a doorstep reverse pickup within 24-48 hours.',
  },
  // Payments
  {
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, MasterCard, RuPay, Amex), Net Banking, and Cash on Delivery (COD) across 19,000+ PIN codes.',
  },
  {
    category: 'payments',
    question: 'Is online payment safe on AURELIA?',
    answer: 'Yes. All payments are processed through RBI-approved, PCI-DSS Level 1 compliant gateways with end-to-end 256-bit SSL encryption. We never store your card details or banking passwords.',
  },
  // Orders
  {
    category: 'orders',
    question: 'Can I cancel or modify my order after placing it?',
    answer: 'Orders can be modified or canceled within 2 hours of placement before our Atelier dispatches your parcel. Please message our concierge on WhatsApp (+91 98200 12345) for instant priority assistance.',
  },
  {
    category: 'orders',
    question: 'Do you offer luxury gift packaging and gift cards?',
    answer: 'Yes! You can select our Luxury Satin Gift Box option at checkout (+₹149), which includes our gold-embossed keepsake box, velvet pouch, and a handwritten personalized gift card.',
  },
];
