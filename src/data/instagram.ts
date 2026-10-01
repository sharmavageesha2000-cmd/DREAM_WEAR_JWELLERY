export interface InstagramPost {
  id: string;
  image: string;
  handle: string;
  caption: string;
  likes: number;
  productTagged?: string;
  productSlug?: string;
}

export const instagramPosts: InstagramPost[] = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    handle: '@maya.styled',
    caption: 'Sunday brunch neck stack in pure 18k gold ✨ @aurelia.jewelry',
    likes: 1240,
    productTagged: 'Minimal Baroque Pearl Pendant',
    productSlug: 'minimal-baroque-pearl-pendant',
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    handle: '@tanya_aesthetic',
    caption: 'The croissant ring has not left my finger in 3 weeks 🥐💛',
    likes: 890,
    productTagged: 'Croissant Dome Signet Ring',
    productSlug: 'croissant-dome-signet-ring',
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    handle: '@simran_k',
    caption: 'Clean girl aesthetic unlocked with the everyday huggie hoops ☁️',
    likes: 2105,
    productTagged: 'Chubby Bold Huggie Hoops',
    productSlug: 'chubby-bold-huggie-hoops',
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1611591475879-119106ff79a6?auto=format&fit=crop&w=600&q=80',
    handle: '@zoya.journal',
    caption: 'Golden hour details with @aurelia.jewelry paperclip chain ✨',
    likes: 1470,
    productTagged: 'Paperclip Link Toggle Bracelet',
    productSlug: 'paperclip-link-toggle-bracelet',
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    handle: '@aarti_v',
    caption: 'Heirloom energy only. The celestial coin medallion is perfection 🌟',
    likes: 980,
    productTagged: 'Celestial Zodiac Medallion Pendant',
    productSlug: 'celestial-zodiac-medallion-pendant',
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    handle: '@divya_b',
    caption: 'All stacked up and nowhere to go 🥂 #AureliaGirl',
    likes: 1650,
    productTagged: 'The Golden Hour Layering Duo Set',
    productSlug: 'golden-hour-layering-duo-set',
  },
];
