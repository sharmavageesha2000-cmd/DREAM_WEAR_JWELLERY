import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Droplets,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { getProductById, getStoredProducts } from '../data/products';
import { Product, ProductFinish, Review } from '../types';
import { formatPrice, brandConfig } from '../config/brandConfig';
import { RatingStars } from '../components/common/RatingStars';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useSEO } from '../hooks/useSEO';
import { apiService } from '../services/api';


export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<ProductFinish>('18K Yellow Gold');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  useSEO({
    title: product ? `${product.name} — Anti-Tarnish Fine Jewelry` : 'Fine Jewelry Piece',
    description: product ? product.description : 'Waterproof 18K Gold fine jewelry.',
  });

  // 5 Information Accordions: 'details' | 'material-care' | 'anti-tarnish' | 'shipping' | 'returns'
  const [openAccordions, setOpenAccordions] = useState<string[]>(['details', 'anti-tarnish']);

  // Customer Reviews state
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const perspectiveTitles = [
    'Studio Flatlay',
    'Macro Craft Detail',
    '45° Dynamic Contour',
    'Editorial Perspective',
  ];

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!product || product.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!product || product.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 35) {
      handleNextSlide();
    } else if (diff < -35) {
      handlePrevSlide();
    }
    setTouchStartX(null);
  };

  const loadProductData = async () => {
    if (id) {
      let found = getProductById(id);
      if (found) {
        setProduct(found);
        setActiveImageIndex(0);
        setSelectedFinish(found.finishes[0] || '18K Yellow Gold');
        setSelectedSize(found.availableSizes ? found.availableSizes[0] : '');
        setQuantity(1);
      }

      // Try fetching latest live item from PostgreSQL backend
      try {
        const live = await apiService.getProductById(id);
        if (live) {
          found = live;
          setProduct(live);
          setSelectedFinish(live.finishes[0] || '18K Yellow Gold');
          setSelectedSize(live.availableSizes ? live.availableSizes[0] : '');
        }
      } catch (err) {
        console.warn('Live product fetch error:', err);
      }

      if (found) {
        try {
          const liveReviews = await apiService.getReviews(found.id);
          if (liveReviews && liveReviews.length > 0) {
            setProductReviews(liveReviews);
            return;
          }
        } catch {
          // ignore
        }

        setProductReviews([
          {
            id: 'rev-p1',
            author: 'Simran K.',
            rating: 5,
            title: 'Exceeded all my expectations! ✨',
            comment: `I have been wearing this ${found.name} non-stop for 3 weeks including morning workouts and showers. No discoloration whatsoever!`,
            verifiedPurchase: true,
            date: '5 days ago',
          },
          {
            id: 'rev-p2',
            author: 'Ayesha M.',
            rating: 5,
            title: 'Looks like solid 18k fine jewelry',
            comment: 'The gold finish is buttery and rich, not that fake neon brass color. Highly recommend!',
            verifiedPurchase: true,
            date: '2 weeks ago',
          },
        ]);
      }
    }
  };

  useEffect(() => {
    loadProductData();
    window.addEventListener('aurelia_products_updated', loadProductData);
    window.addEventListener('storage', loadProductData);
    return () => {
      window.removeEventListener('aurelia_products_updated', loadProductData);
      window.removeEventListener('storage', loadProductData);
    };
  }, [id]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-2xl text-charcoal">Jewelry Piece Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">The requested design is currently unavailable.</p>
        <Link
          to="/shop"
          className="inline-block mt-4 px-6 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-wider rounded-xl"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedFinish, selectedSize);
    setAdded(true);
    showToast(`Added ${quantity}x "${product.name}" to your bag`, 'cart');
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedFinish, selectedSize);
    navigate('/checkout');
  };

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiService.verifyPincode(pincode);
      setPincodeStatus(res.message);
    } catch {
      if (pincode.length === 6 && /^\d+$/.test(pincode)) {
        setPincodeStatus('Delivery available in 2-3 business days! Free Express Shipping applied.');
      } else {
        setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
      }
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      author: newReviewAuthor,
      rating: newReviewRating,
      title: newReviewTitle || 'Great quality!',
      comment: newReviewComment,
      verifiedPurchase: true,
      date: 'Just now',
    };

    setProductReviews([newRev, ...productReviews]);
    setReviewSubmitted(true);
    showToast('Your review was posted successfully!', 'success');

    // Async sync to PostgreSQL backend
    apiService.submitReview(newRev).catch((err) => console.warn('Submit review sync error:', err));

    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setNewReviewAuthor('');
      setNewReviewTitle('');
      setNewReviewComment('');
    }, 1500);
  };


  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // "You May Also Like" Related Products
  const relatedProducts = getStoredProducts()
    .filter((p) => p.id !== product?.id && (p.category === product?.category || p.isBestSeller))
    .slice(0, 4);

  return (
    <div className="py-8 sm:py-12 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: product.categoryName, to: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
          className="mb-6"
        />

        {/* Top Section: Interactive Gallery with Zoom + Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-stone-200/80 shadow-sm">

          {/* Left Column: Image Gallery with Magnifier Zoom & Interactive Slider */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Main Image Container with Slider Navigation */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-ivory-warm border border-stone-200 shadow-md group select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Main Current Angle Image Display */}
              <div className="w-full h-full relative overflow-hidden">
                {product.images.map((img, idx) => {
                  const allImagesIdentical =
                    product.images.length > 1 && product.images.every((i) => i === product.images[0]);
                  const perspectiveTransforms = [
                    'scale-100 object-center',
                    'scale-[1.38] object-center',
                    'scale-[1.12] -rotate-2 object-center',
                    'scale-[1.16] rotate-2 object-center brightness-[1.03]',
                  ];

                  return (
                    <div
                      key={idx}
                      className={`absolute inset-0 w-full h-full transition-all duration-300 ease-in-out overflow-hidden ${activeImageIndex === idx
                          ? 'opacity-100 scale-100 z-10'
                          : 'opacity-0 scale-95 z-0 pointer-events-none'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - Angle ${idx + 1}`}
                        className={`w-full h-full object-cover transition-transform duration-500 ${allImagesIdentical ? perspectiveTransforms[idx % 4] : 'object-center'
                          }`}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Angle / Perspective Tag for multi-angle products */}
              {product.images.length > 1 && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[#8E6A22] border border-amber-300/70 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#B88E3A]" />
                    <span>Angle {activeImageIndex + 1}/{product.images.length}: {perspectiveTitles[activeImageIndex] || `View ${activeImageIndex + 1}`}</span>
                  </span>
                </div>
              )}

              {/* Always-Visible Slider Previous Button */}
              {product.images.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-stone-900 border border-stone-200 shadow-xl hover:shadow-2xl hover:border-gold hover:text-gold-dark flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                  aria-label="Previous angle"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Always-Visible Slider Next Button */}
              {product.images.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-stone-900 border border-stone-200 shadow-xl hover:shadow-2xl hover:border-gold hover:text-gold-dark flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                  aria-label="Next angle"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Dot Indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#DFCEB7] shadow-xs">
                  {product.images.map((_, idx) => {
                    const isActive = activeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(idx);
                        }}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${isActive
                            ? 'w-6 h-2 bg-[#B88E3A] shadow-xs'
                            : 'w-2 h-2 bg-[#DFCEB7] hover:bg-[#B88E3A]'
                          }`}
                        aria-label={`Go to angle ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              )}

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
                {product.isAntiTarnish && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-gold-dark border border-gold-satin/40 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-gold" /> 100% Anti-Tarnish
                  </span>
                )}
                {product.isWaterproof && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50/90 backdrop-blur-md text-blue-800 border border-blue-200">
                    <Droplets className="w-3 h-3 text-blue-500" /> Shower-Safe
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-rose-600 text-white shadow-xs inline-block self-start">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Perspective View Selector Toolbar & Thumbnails */}
            {product.images.length > 1 && (
              <div className="space-y-2.5 pt-1">
                {/* Perspective Selection Header */}
                <div className="flex items-center justify-between text-xs text-stone-600 font-medium px-1">
                  <span className="font-semibold text-charcoal flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Select Photography View ({product.images.length} Perspectives)</span>
                  </span>
                  <span className="text-gold-dark text-[11px] font-semibold">Active: {perspectiveTitles[activeImageIndex]}</span>
                </div>

                {/* 4 Interactive Thumbnail Cards */}
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                  {product.images.map((img, idx) => {
                    const isCurrent = activeImageIndex === idx;
                    const allImagesIdentical =
                      product.images.length > 1 && product.images.every((i) => i === product.images[0]);
                    const perspectiveTransforms = [
                      'scale-100',
                      'scale-[1.38]',
                      'scale-[1.12] -rotate-2',
                      'scale-[1.16] rotate-2',
                    ];

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer text-left ${isCurrent
                            ? 'border-gold shadow-lg ring-2 ring-gold/40 scale-[1.03] bg-gold-light/10'
                            : 'border-stone-200 opacity-75 hover:opacity-100 hover:border-gold/60 hover:scale-[1.01]'
                          }`}
                      >
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-ivory-warm relative">
                          <img
                            src={img}
                            alt={`Angle ${idx + 1}`}
                            className={`w-full h-full object-cover transition-transform duration-300 ${allImagesIdentical ? perspectiveTransforms[idx % 4] : 'group-hover:scale-105'
                              }`}
                          />
                        </div>
                        <div className="mt-1.5 px-0.5">
                          <span className={`block text-[10px] font-bold truncate ${isCurrent ? 'text-gold-dark' : 'text-stone-700'
                            }`}>
                            {idx + 1}. {perspectiveTitles[idx] || `Angle ${idx + 1}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Controls */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category, SKU & Rating */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-dark">
                  {product.categoryName} • SKU: {product.sku}
                </span>
                <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-charcoal-dark mt-2 leading-tight">
                {product.name}
              </h1>

              {/* Tagline */}
              <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
                {product.tagline}
              </p>

              {/* Pricing & Availability */}
              <div className="flex items-baseline gap-3 my-4 flex-wrap">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    Save {product.discountPercentage}%
                  </span>
                )}
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 ml-auto">
                  ● In Stock Ready to Ship
                </span>
              </div>

              {/* Material Description Callout */}
              <div className="p-3.5 bg-ivory-warm rounded-2xl border border-stone-200/80 text-xs text-stone-600 mb-5">
                <p>
                  <strong>Material:</strong> {product.material}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  18K Gold Vacuum PVD Coated over 316L Surgical Steel (Waterproof & Sweat-Safe)
                </p>
              </div>

              {/* Metal Finish / Color Selector */}
              {product.finishes && product.finishes.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                    Metal Color / Finish: <span className="text-gold-dark normal-case font-medium">{selectedFinish}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.finishes.map((finish) => (
                      <button
                        key={finish}
                        type="button"
                        onClick={() => setSelectedFinish(finish)}
                        className={`text-xs px-4 py-2 rounded-xl border font-medium transition-all ${selectedFinish === finish
                            ? 'border-gold bg-gold-light/20 text-charcoal font-semibold shadow-sm'
                            : 'border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector where applicable */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                      Size / Length: <span className="text-gold-dark normal-case font-medium">{selectedSize}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('details')}
                      className="text-[11px] text-stone-500 hover:text-gold-dark underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs px-3.5 py-2 rounded-xl border font-medium transition-all ${selectedSize === size
                            ? 'border-gold bg-gold-light/20 text-charcoal font-semibold shadow-sm'
                            : 'border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity, Add to Cart, Buy Now & Wishlist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => setQuantity((q) => q + 1)}
                    onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                  />

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 py-3.5 px-5 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${added
                        ? 'bg-emerald-600 text-white'
                        : product.inStock
                          ? 'bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white shadow-md cursor-pointer'
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Shopping Bag
                      </>
                    ) : product.inStock ? (
                      <>
                        <ShoppingBag className="w-4 h-4 text-gold" /> Add to Bag — {formatPrice(product.price * quantity)}
                      </>
                    ) : (
                      'Sold Out'
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const isNowFav = toggleWishlist(product);
                      showToast(
                        isNowFav
                          ? `Saved "${product.name}" to your wishlist`
                          : `Removed from wishlist`,
                        isNowFav ? 'wishlist' : 'info'
                      );
                    }}
                    className={`p-3.5 rounded-xl border transition-colors shadow-sm ${isFavorited
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-stone-200 hover:border-stone-300 text-charcoal'
                      }`}
                    title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Buy Now Direct Shortcut */}
                {product.inStock && (
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-gold to-gold-light hover:to-gold text-stone-950 text-xs font-bold uppercase tracking-[0.18em] shadow-md hover:shadow-gold-glow transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-stone-950" />
                    <span>Buy Now — Instant Checkout</span>
                  </button>
                )}
              </div>

              {/* Delivery PIN Code Checker */}
              <div className="mt-6 pt-4 border-t border-stone-100">
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter PIN code for delivery estimation"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-ivory rounded-xl border border-stone-200 focus:outline-none focus:border-gold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-charcoal text-xs font-semibold rounded-xl"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> {pincodeStatus}
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* 5 Information Accordions Section */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-charcoal pb-2 border-b border-stone-100">
            Information & Specifications
          </h2>

          {/* 1. Product Details Accordion */}
          <div className="border-b border-stone-100 pb-3">
            <button
              type="button"
              onClick={() => toggleAccordion('details')}
              className="w-full flex items-center justify-between py-2 text-left font-serif text-lg font-medium text-charcoal"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" /> Product Details & Specifications
              </span>
              {openAccordions.includes('details') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openAccordions.includes('details') && (
              <div className="mt-2.5 p-4 bg-white rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-2 leading-relaxed animate-fade-in shadow-2xs">
                <p>{product.description}</p>
                <p><strong>SKU:</strong> {product.sku}</p>
                {product.dimensions && <p><strong>Dimensions:</strong> {product.dimensions}</p>}
                {product.weight && <p><strong>Approx Weight:</strong> {product.weight}</p>}
                <div className="pt-1">
                  <strong>Key Highlights:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-stone-600">
                    {product.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 2. Material & Care Accordion */}
          <div className="border-b border-stone-100 pb-3">
            <button
              type="button"
              onClick={() => toggleAccordion('material-care')}
              className="w-full flex items-center justify-between py-2 text-left font-serif text-lg font-medium text-charcoal"
            >
              <span className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" /> Material & Care Guide
              </span>
              {openAccordions.includes('material-care') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openAccordions.includes('material-care') && (
              <div className="mt-2.5 p-4 bg-white rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-2 leading-relaxed animate-fade-in shadow-2xs">
                <p><strong>Base Metal:</strong> {product.baseMetal}</p>
                <p><strong>Plating:</strong> {product.coating}</p>
                <div className="pt-1">
                  <strong>Care Guidelines:</strong>
                  <ul className="list-disc list-inside space-y-1 mt-1 text-stone-600">
                    {product.careInstructions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 3. Anti-Tarnish Information Accordion */}
          <div className="border-b border-stone-100 pb-3">
            <button
              type="button"
              onClick={() => toggleAccordion('anti-tarnish')}
              className="w-full flex items-center justify-between py-2 text-left font-serif text-lg font-medium text-charcoal"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-dark" /> Anti-Tarnish Information & Science
              </span>
              {openAccordions.includes('anti-tarnish') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openAccordions.includes('anti-tarnish') && (
              <div className="mt-2.5 p-4 bg-white rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-2 leading-relaxed animate-fade-in shadow-2xs">
                <p>
                  AURELIA jewelry utilizes Physical Vapor Deposition (PVD), which vaporizes real 18K gold in vacuum chambers and bonds it at an atomic level onto 316L medical stainless steel.
                </p>
                <p>
                  This molecular barrier resists chlorine, salt water, body sweat, soaps, and perfume without tarnishing or turning skin green. Protected by our <strong>2-Year Color Fade Replacement Warranty</strong>.
                </p>
              </div>
            )}
          </div>

          {/* 4. Shipping Accordion */}
          <div className="border-b border-stone-100 pb-3">
            <button
              type="button"
              onClick={() => toggleAccordion('shipping')}
              className="w-full flex items-center justify-between py-2 text-left font-serif text-lg font-medium text-charcoal"
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-dark" /> Shipping & Delivery Information
              </span>
              {openAccordions.includes('shipping') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openAccordions.includes('shipping') && (
              <div className="mt-2.5 p-4 bg-white rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-2 leading-relaxed animate-fade-in shadow-2xs">
                <p>• <strong>Free Express Shipping:</strong> Available across India on all orders ₹{brandConfig.shipping.freeShippingThreshold} and above.</p>
                <p>• <strong>Timelines:</strong> Metro cities (2-3 business days), Other regions (3-5 business days).</p>
                <p>• <strong>Cash on Delivery (COD):</strong> Available across 19,000+ PIN codes.</p>
              </div>
            )}
          </div>

          {/* 5. Returns Accordion */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('returns')}
              className="w-full flex items-center justify-between py-2 text-left font-serif text-lg font-medium text-charcoal"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gold-dark" /> Returns & Exchanges
              </span>
              {openAccordions.includes('returns') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openAccordions.includes('returns') && (
              <div className="mt-2.5 p-4 bg-white rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-2 leading-relaxed animate-fade-in shadow-2xs">
                <p>• <strong>7-Day Window:</strong> Returns and exchanges are accepted within 7 days of package delivery for unworn pieces with tags intact.</p>
                <p>• <strong>Doorstep Reverse Pickup:</strong> Arranged at your convenience by our courier partners.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-charcoal">
                Customer Reviews ({product.reviewsCount + productReviews.length})
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars rating={product.rating} showNumber={true} size="md" />
                <span className="text-xs text-stone-500">• 98% Recommended by verified buyers</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 rounded-xl border border-charcoal hover:bg-charcoal hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors self-start"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Write a Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="my-6 p-5 bg-ivory-warm rounded-2xl border border-stone-200 space-y-4 animate-fade-in">
              <h3 className="font-serif text-base font-semibold text-charcoal">Write your verified review</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Maya S."
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Rating</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value={5}>★★★★★ (5 Stars - Outstanding)</option>
                    <option value={4}>★★★★☆ (4 Stars - Great)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Stunning gold luster and shower safe!"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Detailed Review</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share your experience wearing this piece in daily life..."
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-charcoal text-ivory-light text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gold-dark transition-colors"
                >
                  {reviewSubmitted ? 'Submitted!' : 'Post Review'}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="divide-y divide-stone-100 mt-4">
            {productReviews.map((rev) => (
              <div key={rev.id} className="py-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-charcoal">{rev.author}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <h4 className="text-xs font-semibold text-charcoal">{rev.title}</h4>
                <p className="text-xs text-stone-600 font-light leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* You May Also Like / Related Products */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-charcoal">
              You May Also Like
            </h2>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-gold-dark hover:underline"
            >
              Explore More Designs →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
