import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  ShoppingBag,
  X,
} from 'lucide-react';
import { OfficialInstagramLogo } from '../common/SocialIcons';

interface InstagramPost {
  id: number;
  image: string;
  likes: number;
  commentsCount: number;
  caption: string;
  tags: string[];
  location: string;
  timeAgo: string;
  productName: string;
  productPrice: string;
  stackAngle: number; // angle in stacked deck
  stackX: number; // horizontal offset in px
  stackY: number; // vertical offset in px
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 1,
    image: '/images/products/cand_tennis.jpg',
    likes: 1248,
    commentsCount: 38,
    caption: 'Golden hour brilliance in our 18K Diamond Tennis Bracelet. Shower-safe, sweat-proof, and designed to never tarnish. ✨💎',
    tags: ['#AureliaJewels', '#DiamondTennis', '#18kGold', '#WaterproofJewelry'],
    location: 'Place Vendôme, Paris',
    timeAgo: '2h ago',
    productName: 'Candice 18K Diamond Tennis Bracelet',
    productPrice: '$185',
    stackAngle: -10,
    stackX: -14,
    stackY: 8,
  },
  {
    id: 2,
    image: '/images/products/wave_cuff_1.jpg',
    likes: 892,
    commentsCount: 24,
    caption: 'Sculpted waves that echo organic Mediterranean contours. Vacuum PVD gold engineered for continuous everyday wear. 🌊',
    tags: ['#SculptedGold', '#WaveCuff', '#AtelierDesign', '#AntiTarnish'],
    location: 'Via Montenapoleone, Milano',
    timeAgo: '4h ago',
    productName: 'Aurelia Sculpted Wave Cuff',
    productPrice: '$145',
    stackAngle: 8,
    stackX: 16,
    stackY: -6,
  },
  {
    id: 3,
    image: '/images/products/aur_r_01_1.jpg',
    likes: 2135,
    commentsCount: 64,
    caption: 'Our signature Croissant Dome Ring catching natural sunlight. Heavy 18K gold luster that never fades or discolors skin. 🥐💛',
    tags: ['#DomeRing', '#CroissantRing', '#EverydayLuxury', '#GoldEssentials'],
    location: 'Bond Street, London',
    timeAgo: '6h ago',
    productName: 'Croissant Dome Statement Ring',
    productPrice: '$85',
    stackAngle: -6,
    stackX: -8,
    stackY: 12,
  },
  {
    id: 4,
    image: '/images/products/aur_b_03_1.jpg',
    likes: 1540,
    commentsCount: 42,
    caption: 'Hand-selected natural baroque marine pearls suspended on our ultra-fine 18K gold cable chain. Pure organic beauty. 🐚💫',
    tags: ['#BaroquePearl', '#PearlNecklace', '#NaturalLuster', '#FineJewelry'],
    location: 'Rue du Rhône, Genève',
    timeAgo: '12h ago',
    productName: 'Marine Baroque Pearl Drop Bracelet',
    productPrice: '$120',
    stackAngle: 11,
    stackX: 12,
    stackY: -10,
  },
  {
    id: 5,
    image: '/images/products/cand2_gold_bangle.jpg',
    likes: 3412,
    commentsCount: 91,
    caption: 'Celestial Stacking Bangle trio. Engineered with our triple-sealed gold alloy for guaranteed waterproof resilience. 🌙✨',
    tags: ['#StackingBangles', '#CelestialGold', '#SolidShine', '#LuxuryLifestyle'],
    location: '5th Avenue, New York',
    timeAgo: '1d ago',
    productName: 'Celestial Moonlight Stacking Bangle',
    productPrice: '$160',
    stackAngle: -8,
    stackX: -10,
    stackY: -4,
  },
  {
    id: 6,
    image: '/images/categories/cat_necklaces.jpg',
    likes: 984,
    commentsCount: 29,
    caption: 'Effortless morning layering. Minimalist paperclip chain combined with micro-pave pendant. Never take it off. ☕✨',
    tags: ['#LayeringChains', '#MinimalistJewels', '#MorningRitual', '#Waterproof'],
    location: 'Ginza, Tokyo',
    timeAgo: '2d ago',
    productName: 'Haute Paperclip Link Chain',
    productPrice: '$110',
    stackAngle: 5,
    stackX: 8,
    stackY: 6,
  },
];

type MotionPhase = 'stack' | 'splitting' | 'grid';

export const InstagramGrid: React.FC = () => {
  // Motion phase: 'stack' (cards layered on top of each other at different angles) -> 'splitting' -> 'grid' (settled)
  const [motionPhase, setMotionPhase] = useState<MotionPhase>('grid');
  const [visibleStackIndex, setVisibleStackIndex] = useState<number>(INSTAGRAM_POSTS.length);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});
  const [heartBursts, setHeartBursts] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(() => {
    const counts: Record<number, number> = {};
    INSTAGRAM_POSTS.forEach((p) => {
      counts[p.id] = p.likes;
    });
    return counts;
  });
  const [activeModalPost, setActiveModalPost] = useState<InstagramPost | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isAutoPlayRef = useRef<boolean>(true);
  const isHoveredRef = useRef<boolean>(false);
  const modalOpenRef = useRef<boolean>(false);
  const isInViewRef = useRef<boolean>(false);
  const motionPhaseRef = useRef<MotionPhase>('grid');

  // Keep refs in sync with state
  isAutoPlayRef.current = isAutoPlay;
  isHoveredRef.current = isHovered;
  modalOpenRef.current = !!activeModalPost;
  motionPhaseRef.current = motionPhase;

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Run the sequence: Dealing into stack one by one at different angles -> Split and settle into grid -> Repeat after 2s
  const playMotionSequence = () => {
    clearAllTimeouts();
    setMotionPhase('stack');
    setVisibleStackIndex(0);

    // Deal cards one by one into the stack
    INSTAGRAM_POSTS.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleStackIndex(idx + 1);
      }, (idx + 1) * 200);
      timeoutsRef.current.push(t);
    });

    const totalDealTime = INSTAGRAM_POSTS.length * 200;

    // Hold the stacked deck with all angles visible for a moment
    const splitTimer = setTimeout(() => {
      setMotionPhase('splitting');
    }, totalDealTime + 700);
    timeoutsRef.current.push(splitTimer);

    // Settle smoothly into the final grid
    const gridTimer = setTimeout(() => {
      setMotionPhase('grid');
      setVisibleStackIndex(INSTAGRAM_POSTS.length);
    }, totalDealTime + 1300);
    timeoutsRef.current.push(gridTimer);

    // Repeat the sequence every 2 seconds (2000ms) after grid settles
    const repeatTimer = setTimeout(() => {
      if (
        isAutoPlayRef.current &&
        !isHoveredRef.current &&
        !modalOpenRef.current &&
        isInViewRef.current
      ) {
        playMotionSequence();
      }
    }, totalDealTime + 1300 + 2000);
    timeoutsRef.current.push(repeatTimer);
  };

  // Trigger automatically when scrolled into view and manage visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInViewRef.current = true;
            playMotionSequence();
          } else {
            isInViewRef.current = false;
            clearAllTimeouts();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      clearAllTimeouts();
    };
  }, []);

  // Resume 2-second repeat when user closes modal or toggles auto play
  useEffect(() => {
    if (!activeModalPost && isAutoPlay && isInViewRef.current && motionPhase === 'grid') {
      clearAllTimeouts();
      const t = setTimeout(() => {
        if (!isHoveredRef.current && !modalOpenRef.current && isInViewRef.current && isAutoPlayRef.current) {
          playMotionSequence();
        }
      }, 2000);
      timeoutsRef.current.push(t);
    }
  }, [activeModalPost, isAutoPlay]);

  // Handle Like Button & Double Click Heart
  const handleToggleLike = (postId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const isCurrentlyLiked = !!likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: isCurrentlyLiked ? prev[postId] - 1 : prev[postId] + 1,
    }));

    if (!isCurrentlyLiked) {
      setHeartBursts((prev) => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setHeartBursts((prev) => ({ ...prev, [postId]: false }));
      }, 700);
    }
  };

  // Handle Save
  const handleToggleSave = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Handle Share / Copy Link
  const handleShare = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('https://instagram.com/aurelia.jewels');
    setCopiedToast(`Post #${postId} link copied to clipboard! 📋`);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  return (
    <section
      ref={containerRef}
      className="py-9 sm:py-12 lg:py-14 bg-white border-b border-stone-200/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ======================================================== */}
        {/* HEADER: SIMPLE, ELEGANT, LUXURY INSTAGRAM LOGO & HANDLE */}
        {/* ======================================================== */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-stone-500 block mb-1.5">
            COMMUNITY & INSPIRATION
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-950 tracking-tight mb-2">
            Follow Our Atelier
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto leading-relaxed mb-4">
            Discover daily fine jewelry styling, new arrivals, and studio moments from our Paris & London ateliers.
          </p>

          {/* SIMPLE & CLEAN INSTAGRAM BADGE (Minimalist Luxury Gold & Charcoal) */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-2.5 sm:p-3 px-5 sm:px-6 rounded-2xl bg-ivory-warm border border-stone-200 shadow-xs">
            {/* Official Instagram Icon with Original Brand Gradient */}
            <a
              href="https://instagram.com/aurelia.jewels"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-xs shrink-0 hover:scale-105 transition-transform duration-200"
              aria-label="Instagram Atelier"
            >
              <OfficialInstagramLogo className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shadow-xs" />
            </a>

            {/* Handle & Verification */}
            <div className="text-left">
              <a
                href="https://instagram.com/aurelia.jewels"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-sm sm:text-base tracking-wider text-charcoal-dark hover:text-gold-dark transition-colors flex items-center gap-1.5"
              >
                <span>@AURELIA.JEWELS</span>
                <CheckCircle2 className="w-4 h-4 text-gold fill-gold text-white" />
              </a>
              <span className="text-[10px] sm:text-[11px] text-stone-500 block">
                148K followers • Fine Jewelry Atelier
              </span>
            </div>

            {/* Clean Action Buttons */}
            <div className="flex items-center gap-2 sm:pl-3 sm:border-l sm:border-stone-300">
              <a
                href="https://instagram.com/aurelia.jewels"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal-dark hover:bg-charcoal text-white text-xs font-semibold tracking-wide transition-colors shadow-2xs"
              >
                <span>Follow</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-300" />
              </a>

              {/* Auto Loop Toggle */}
              <button
                onClick={() => setIsAutoPlay((prev) => !prev)}
                title={isAutoPlay ? 'Auto-repeating every 2 seconds (click to pause)' : 'Paused (click to enable 2s auto-repeat)'}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-charcoal-dark border border-stone-200 text-xs font-medium transition-colors shadow-2xs"
                aria-label="Toggle auto replay"
              >
                {isAutoPlay ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-dark"></span>
                    </span>
                    <span className="text-[11px] font-semibold text-charcoal-dark">Auto (2s)</span>
                  </>
                ) : (
                  <span className="text-[11px] text-stone-400">Loop Paused</span>
                )}
              </button>

              {/* Replay Sequence Button */}
              <button
                onClick={playMotionSequence}
                title="Replay card stacking and splitting motion"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-charcoal-dark border border-stone-200 text-xs font-medium transition-colors shadow-2xs"
                aria-label="Replay motion sequence"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gold-dark" />
                <span className="hidden sm:inline text-[11px]">Replay</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ANIMATED POSTS: STACKED ANGLES -> SPLIT & SETTLE TO GRID */}
        <div
          className="relative w-full"
          onMouseEnter={() => {
            isHoveredRef.current = true;
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            setIsHovered(false);
            if (motionPhaseRef.current === 'grid' && isAutoPlayRef.current) {
              clearAllTimeouts();
              const nextTimer = setTimeout(() => {
                if (
                  !isHoveredRef.current &&
                  !modalOpenRef.current &&
                  isInViewRef.current &&
                  isAutoPlayRef.current
                ) {
                  playMotionSequence();
                }
              }, 2000);
              timeoutsRef.current.push(nextTimer);
            }
          }}
        >
          {/* Toast Notification */}
          {copiedToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-charcoal-dark text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2 border border-stone-700 animate-fade-in-up">
              <span>{copiedToast}</span>
            </div>
          )}

          {/* VIEW 1: STACKED DECK VIEW (Cards layered above each other at different angles) */}
          {motionPhase === 'stack' && (
            <div className="relative min-h-[460px] sm:min-h-[480px] flex items-center justify-center my-6">
              <div className="relative w-[280px] sm:w-[320px] h-[400px]">
                {INSTAGRAM_POSTS.map((post, idx) => {
                  const isVisible = idx < visibleStackIndex;
                  if (!isVisible) return null;

                  return (
                    <div
                      key={post.id}
                      style={{
                        transform: `translate(${post.stackX}px, ${post.stackY}px) rotate(${post.stackAngle}deg)`,
                        zIndex: 10 + idx,
                      }}
                      onClick={() => setActiveModalPost(post)}
                      className="absolute inset-0 bg-white rounded-2xl border border-stone-300/80 shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-50"
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-gold/40">
                            <img
                              src={post.image}
                              alt="Aurelia Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[11px] font-bold text-charcoal-dark">
                            aurelia.jewels
                          </span>
                        </div>
                        <span className="text-[9px] text-stone-400">{post.location}</span>
                      </div>

                      {/* Fully Visible High Quality Image */}
                      <div className="relative aspect-square w-full bg-stone-100">
                        <img
                          src={post.image}
                          alt={post.caption}
                          className="w-full h-full object-cover block"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#B88E3A] text-[9px] font-bold text-white uppercase tracking-wider shadow-2xs">
                          18K PVD
                        </div>
                      </div>

                      {/* Post Footer */}
                      <div className="p-2.5 bg-white">
                        <div className="flex items-center justify-between text-xs text-charcoal-dark mb-1">
                          <span className="font-bold text-[11px]">♥ {likeCounts[post.id]} likes</span>
                          <span className="text-[10px] text-gold-dark font-semibold">
                            {post.productPrice}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-600 line-clamp-1">
                          {post.caption}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: SPLITTING & SETTLED GRID VIEW (Crystal clear post images with full visibility) */}
          {motionPhase !== 'stack' && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-4 transition-all duration-700 ${
                motionPhase === 'splitting' ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
              }`}
            >
              {INSTAGRAM_POSTS.map((post, idx) => {
                const isLiked = !!likedPosts[post.id];
                const isSaved = !!savedPosts[post.id];
                const hasBurst = !!heartBursts[post.id];
                const currentLikes = likeCounts[post.id];

                return (
                  <div
                    key={post.id}
                    style={{
                      transitionDelay: `${idx * 60}ms`,
                    }}
                    className="group relative rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* ---------------------------------------------------- */}
                    {/* INSTAGRAM POST HEADER */}
                    {/* ---------------------------------------------------- */}
                    <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-stone-100">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gold/40 shrink-0">
                          <img
                            src={post.image}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="leading-tight overflow-hidden">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-charcoal-dark truncate">
                              aurelia.jewels
                            </span>
                            <CheckCircle2 className="w-3 h-3 text-gold fill-gold text-white shrink-0" />
                          </div>
                          <span className="text-[8px] text-stone-400 truncate block">
                            {post.location}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalPost(post);
                        }}
                        className="text-stone-400 hover:text-stone-700 p-0.5"
                        aria-label="Post options"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* CLEAR, UNBLURRED JEWELRY POST IMAGE */}
                    {/* ---------------------------------------------------- */}
                    <div
                      className="relative aspect-square w-full bg-stone-100 overflow-hidden cursor-pointer select-none"
                      onClick={() => setActiveModalPost(post)}
                      onDoubleClick={(e) => handleToggleLike(post.id, e)}
                    >
                      <img
                        src={post.image}
                        alt={post.caption}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Double-Click Heart Burst Keyframe */}
                      {hasBurst && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                          <Heart className="w-14 h-14 text-rose-500 fill-rose-500 animate-heart-burst drop-shadow-lg" />
                        </div>
                      )}

                      {/* Product Price Tag Badge */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                        <span className="px-2 py-0.5 rounded bg-charcoal-dark/85 backdrop-blur-xs text-[10px] font-medium text-white flex items-center gap-1 shadow-xs">
                          <ShoppingBag className="w-2.5 h-2.5 text-gold-light" />
                          <span>{post.productPrice}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded bg-white/95 text-charcoal-dark text-[9px] font-semibold uppercase tracking-wider shadow-xs">
                          View
                        </span>
                      </div>

                      {/* Anti-Tarnish Pill */}
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-charcoal-dark/75 text-[8px] font-bold text-amber-300 border border-amber-300/30">
                        18K PVD
                      </div>
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* INSTAGRAM ACTION BUTTONS & ENGAGEMENT */}
                    {/* ---------------------------------------------------- */}
                    <div className="p-3 flex flex-col flex-1 justify-between bg-white text-charcoal-dark">
                      <div>
                        {/* Interactive Buttons Row */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2.5">
                            {/* Heart / Like Button */}
                            <button
                              onClick={(e) => handleToggleLike(post.id, e)}
                              className={`p-0.5 rounded-full transition-transform active:scale-125 ${
                                isLiked
                                  ? 'text-rose-500'
                                  : 'text-stone-700 hover:text-rose-500'
                              }`}
                              aria-label="Like post"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isLiked
                                    ? 'fill-rose-500 text-rose-500 animate-heart-burst'
                                    : 'text-stone-700'
                                }`}
                              />
                            </button>

                            {/* Comment Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModalPost(post);
                              }}
                              className="p-0.5 text-stone-700 hover:text-charcoal-dark transition-colors"
                              aria-label="View comments"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            {/* Share Button */}
                            <button
                              onClick={(e) => handleShare(post.id, e)}
                              className="p-0.5 text-stone-700 hover:text-charcoal-dark transition-colors"
                              aria-label="Share post"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Save Bookmark Button */}
                          <button
                            onClick={(e) => handleToggleSave(post.id, e)}
                            className={`p-0.5 transition-transform active:scale-125 ${
                              isSaved
                                ? 'text-gold-dark'
                                : 'text-stone-700 hover:text-gold-dark'
                            }`}
                            aria-label="Save post"
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                isSaved ? 'fill-gold-dark text-gold-dark' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {/* Likes Counter */}
                        <div className="text-[11px] font-bold text-charcoal-dark mb-1">
                          {currentLikes.toLocaleString()} likes
                        </div>

                        {/* Caption */}
                        <p className="text-[11px] text-stone-700 leading-snug line-clamp-2">
                          <span className="font-bold text-charcoal-dark mr-1">
                            aurelia.jewels
                          </span>
                          {post.caption}
                        </p>
                      </div>

                      {/* Bottom Time & Instagram Link */}
                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                        <span>{post.timeAgo}</span>
                        <a
                          href="https://instagram.com/aurelia.jewels"
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-gold-dark hover:underline flex items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Instagram</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* FOOTER CTA BANNER: JOIN OUR HASHTAG GALLERY */}
        {/* ======================================================== */}
        <div className="mt-12 sm:mt-14 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-5 py-3 rounded-2xl bg-ivory-warm border border-stone-200">
            <span className="text-xs font-semibold text-charcoal-dark">
              Wear Aurelia your way?
            </span>
            <span className="text-xs text-stone-500 font-light">
              Tag <span className="font-bold text-charcoal-dark">#AureliaJewels</span> on your Instagram posts to get featured.
            </span>
            <a
              href="https://instagram.com/aurelia.jewels"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-charcoal-dark hover:text-gold-dark hover:underline flex items-center gap-1 ml-1"
            >
              <span>Explore #AureliaJewels</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULL INSTAGRAM POST MODAL PREVIEW */}
      {/* ======================================================== */}
      {activeModalPost && (
        <div
          className="fixed inset-0 z-50 bg-[#2C2119]/55 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setActiveModalPost(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Left Side */}
            <div className="md:w-3/5 bg-[#F8F4EE] border-r border-[#E5DDD0] relative flex items-center justify-center min-h-[300px] md:min-h-[480px]">
              <img
                src={activeModalPost.image}
                alt={activeModalPost.caption}
                className="w-full h-full object-contain max-h-[520px]"
              />

              {/* Close Button Mobile */}
              <button
                onClick={() => setActiveModalPost(null)}
                className="absolute top-4 left-4 md:hidden p-2 rounded-full bg-white/90 text-[#2C2119] border border-stone-200 shadow-sm"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Atelier Watermark */}
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#3D312A] border border-[#DFCEB7] shadow-xs text-[11px] font-medium flex items-center gap-1.5">
                <OfficialInstagramLogo className="w-4 h-4 rounded-xs" />
                <span>@dreamwear.jewels on Instagram</span>
              </div>
            </div>

            {/* Modal Details Right Side */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between bg-white overflow-y-auto">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-gold/40">
                      <img
                        src={activeModalPost.image}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-charcoal-dark">
                          aurelia.jewels
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold fill-gold text-white" />
                      </div>
                      <span className="text-xs text-stone-500">{activeModalPost.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModalPost(null)}
                    className="p-1 text-stone-400 hover:text-charcoal-dark transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Caption & Comments Stream */}
                <div className="py-4 space-y-4 text-xs text-stone-700 leading-relaxed">
                  <p>
                    <span className="font-bold text-charcoal-dark mr-1.5">aurelia.jewels</span>
                    {activeModalPost.caption}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeModalPost.tags.map((t, idx) => (
                      <span key={idx} className="text-stone-500 font-medium hover:text-gold-dark cursor-pointer">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Comments */}
                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-bold text-[10px] text-charcoal-dark shrink-0">
                        E
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-charcoal-dark mr-1.5">elena_v</span>
                        <span>Does the gold really not tarnish in seawater? ✨</span>
                        <div className="text-[10px] text-stone-400 mt-0.5">1h ago • 14 likes</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-charcoal-dark text-gold flex items-center justify-center text-[8px] font-bold shrink-0">
                        A
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-charcoal-dark mr-1.5">aurelia.jewels</span>
                        <span>
                          @elena_v Yes! Crafted with surgical steel core + 18K Vacuum PVD Gold, backed by our 2-Year Full Color Warranty. 💛
                        </span>
                        <div className="text-[10px] text-stone-400 mt-0.5">45m ago • 8 likes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Bottom: Product Strip + Actions */}
              <div className="pt-4 border-t border-stone-200">
                {/* Featured Product Box */}
                <div className="p-3 rounded-xl bg-ivory-warm border border-stone-200/80 mb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                      FEATURED IN THIS POST
                    </span>
                    <span className="text-xs font-semibold text-charcoal-dark block truncate max-w-[180px]">
                      {activeModalPost.productName}
                    </span>
                    <span className="text-xs font-bold text-charcoal-dark">
                      {activeModalPost.productPrice}
                    </span>
                  </div>

                  <a
                    href="/shop"
                    className="px-3.5 py-1.5 rounded-lg bg-charcoal-dark hover:bg-gold-dark text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>Shop Look</span>
                    <ShoppingBag className="w-3 h-3" />
                  </a>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleLike(activeModalPost.id)}
                      className="flex items-center gap-1 text-charcoal-dark hover:text-rose-500 font-semibold"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          likedPosts[activeModalPost.id]
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-stone-700'
                        }`}
                      />
                      <span>{likeCounts[activeModalPost.id].toLocaleString()}</span>
                    </button>

                    <button
                      onClick={(e) => handleShare(activeModalPost.id, e)}
                      className="flex items-center gap-1 text-stone-600 hover:text-charcoal-dark"
                    >
                      <Send className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  <a
                    href="https://instagram.com/aurelia.jewels"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-xs text-charcoal-dark hover:text-gold-dark flex items-center gap-1"
                  >
                    <span>View on Instagram</span>
                    <ExternalLink className="w-3 h-3 text-gold-dark" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
