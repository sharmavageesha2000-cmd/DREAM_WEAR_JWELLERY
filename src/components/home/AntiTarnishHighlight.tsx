import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Droplets, Sparkles, ArrowRight, RotateCcw, Gem } from 'lucide-react';
import { Button } from '../ui/Button';

// Direct asset imports for guaranteed Vite bundling & loading
import womanBareNeckAsset from '../../assets/images/woman_bare_neck.jpg';
import womanWearingSilverAsset from '../../assets/images/woman_wearing_silver_only.jpg';
import womanWearingPearlAsset from '../../assets/images/woman_wearing_pearl_necklace.jpg';
import silver5CrystalAsset from '../../assets/images/silver_5crystal_chain.jpg';
import pearlNecklaceAsset from '../../assets/images/antitarnish_necklace_pearl.jpg';
import silverCutoutAsset from '../../assets/images/silver_crystal_cutout.png';
import pearlCutoutAsset from '../../assets/images/pearl_necklace_cutout.png';

type TryOnStage =
  | 'bare'           // Bare neckline
  | 'flying_silver'  // Silver chain flies from card to neck
  | 'wearing_silver' // Girl wears ONLY silver chain
  | 'flying_pearl'   // Pearl pendant flies from card to neck (silver disappears)
  | 'wearing_pearl'; // Girl wears ONLY pearl pendant (no silver overlap)

export const AntiTarnishHighlight: React.FC = () => {
  const [womanBareSrc, setWomanBareSrc] = useState(womanBareNeckAsset || '/images/woman_bare_neck.jpg');
  const [womanSilverOnlySrc, setWomanSilverOnlySrc] = useState(womanWearingSilverAsset || '/images/woman_wearing_silver_only.jpg');
  const [womanPearlOnlySrc, setWomanPearlOnlySrc] = useState(womanWearingPearlAsset || '/images/woman_wearing_pearl_necklace.jpg');

  const [silverImgSrc, setSilverImgSrc] = useState(silver5CrystalAsset || '/images/silver_5crystal_chain.jpg');
  const [pearlImgSrc, setPearlImgSrc] = useState(pearlNecklaceAsset || '/images/antitarnish_necklace_pearl.jpg');
  const [silverCutoutSrc, setSilverCutoutSrc] = useState(silverCutoutAsset || '/images/silver_crystal_cutout.png');
  const [pearlCutoutSrc, setPearlCutoutSrc] = useState(pearlCutoutAsset || '/images/pearl_necklace_cutout.png');

  // Animation Stage & Sparkles
  const [stage, setStage] = useState<TryOnStage>('bare');
  const [isSilverSparkling, setIsSilverSparkling] = useState<boolean>(false);
  const [isPearlSparkling, setIsPearlSparkling] = useState<boolean>(false);
  const [animCount, setAnimCount] = useState<number>(0);
  const [isInView, setIsInView] = useState<boolean>(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Alternating Sequence: Only ONE piece at a time!
  // When piece 1 arrives, piece 2 has disappeared.
  // When piece 2 arrives, piece 1 has disappeared.

  const playSilverPiece = () => {
    clearAllTimeouts();
    setAnimCount((prev) => prev + 1);
    setIsPearlSparkling(false);
    setIsSilverSparkling(false);

    // Pearl immediately disappears, neck is bare, silver glides over fast
    setStage('flying_silver');

    // Silver arrives at neck in 500ms
    const tLand = setTimeout(() => {
      setStage('wearing_silver');
      setIsSilverSparkling(true);
      const tSparkle = setTimeout(() => setIsSilverSparkling(false), 650);
      timeoutsRef.current.push(tSparkle);
    }, 500);
    timeoutsRef.current.push(tLand);

    // Alternate to pearl within 2 sec (2000ms)
    const tNext = setTimeout(() => {
      playPearlPiece();
    }, 2000);
    timeoutsRef.current.push(tNext);
  };

  const playPearlPiece = () => {
    clearAllTimeouts();
    setAnimCount((prev) => prev + 1);
    setIsSilverSparkling(false);
    setIsPearlSparkling(false);

    // Silver immediately disappears, neck is bare, pearl glides over fast
    setStage('flying_pearl');

    // Pearl arrives at neck in 500ms
    const tLand = setTimeout(() => {
      setStage('wearing_pearl');
      setIsPearlSparkling(true);
      const tSparkle = setTimeout(() => setIsPearlSparkling(false), 650);
      timeoutsRef.current.push(tSparkle);
    }, 500);
    timeoutsRef.current.push(tLand);

    // Alternate back to silver within 2 sec (2000ms)
    const tNext = setTimeout(() => {
      playSilverPiece();
    }, 2000);
    timeoutsRef.current.push(tNext);
  };

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      const tStart = setTimeout(() => {
        playSilverPiece();
      }, 350);
      timeoutsRef.current.push(tStart);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          const tStart = setTimeout(() => {
            playSilverPiece();
          }, 350);
          timeoutsRef.current.push(tStart);
        } else {
          setIsInView(false);
          clearAllTimeouts();
          setStage('bare');
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      clearAllTimeouts();
    };
  }, []);

  const handleRestart = () => {
    clearAllTimeouts();
    setStage('bare');
    setIsInView(false);
    setTimeout(() => {
      setIsInView(true);
      playSilverPiece();
    }, 60);
  };

  const benefits = [
    {
      title: 'Shower, Swim & Ocean Safe',
      desc: 'Wear without fear of green skin or color fading.',
      icon: ShieldCheck,
    },
    {
      title: 'Sweat & Humidity Resistant',
      desc: 'Real 18K gold & 925 rhodium PVD stops oxidation.',
      icon: Droplets,
    },
    {
      title: '2-Year Color Warranty',
      desc: 'Free replacement if your piece ever discolors.',
      icon: Sparkles,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="anti-tarnish"
      className="py-10 sm:py-12 lg:py-14 bg-gradient-to-b from-[#FAF7F2] via-[#F6EFE6] to-[#FAF7F2] text-[#3D312A] relative overflow-hidden border-b border-[#E3D8C8]"
    >
      {/* Subtle background ambient gold & champagne glows */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-10 right-0 w-72 h-72 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Whole Section Zoom-Out Animated Container */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 transform origin-center transition-all duration-[3000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isInView
            ? 'scale-100 opacity-100'
            : 'scale-[1.10] opacity-80'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* ======================================================== */}
          {/* LEFT: INTERACTIVE 3-IMAGE STAGE WITH ALTERNATING TRY-ON */}
          {/* ======================================================== */}
          <div
            className={`lg:col-span-7 order-2 lg:order-1 transform transition-all duration-[2600ms] delay-[250ms] ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative h-[380px] sm:h-[420px] lg:h-[450px] flex gap-3.5 sm:gap-5 w-full select-none">
              {/* ======================================================== */}
              {/* 1. REALISTIC WOMAN PORTRAIT (ONE PIECE AT A TIME) */}
              {/* ======================================================== */}
              <div className="w-[56%] sm:w-[58%] h-full relative rounded-3xl overflow-hidden shadow-xl border border-[#DFCEB7] group bg-white flex-shrink-0">
                {/* Scaled Wrapper for Cinematic Slow Zoom Out */}
                <div
                  className={`w-full h-full absolute inset-0 transform transition-transform duration-[3400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isInView ? 'scale-100' : 'scale-[1.32]'
                  }`}
                >
                  {/* Base Layer: Clean Bare Neck */}
                  <img
                    src={womanBareSrc}
                    onError={() => setWomanBareSrc('/images/woman_bare_neck.jpg')}
                    alt="Modern woman with elegant bare neck"
                    className="w-full h-full object-cover object-center absolute inset-0"
                    loading="eager"
                  />

                  {/* Piece 1: Woman wearing ONLY Silver 5-Crystal Chain (fades out when pearl comes) */}
                  <img
                    src={womanSilverOnlySrc}
                    onError={() => setWomanSilverOnlySrc('/images/woman_wearing_silver_only.jpg')}
                    alt="Modern woman wearing 925 Silver 5-Crystal Station Chain"
                    className={`w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-300 ease-in-out ${
                      stage === 'wearing_silver'
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none'
                    }`}
                    loading="eager"
                  />

                  {/* Piece 2: Woman wearing ONLY Baroque Pearl Drop Pendant (fades out when silver comes) */}
                  <img
                    src={womanPearlOnlySrc}
                    onError={() => setWomanPearlOnlySrc('/images/woman_wearing_pearl_necklace.jpg')}
                    alt="Modern woman wearing Baroque Pearl Drop Pendant"
                    className={`w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-300 ease-in-out ${
                      stage === 'wearing_pearl'
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none'
                    }`}
                    loading="eager"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2119]/75 via-transparent to-transparent pointer-events-none" />




              </div>

              {/* ======================================================== */}
              {/* 2 & 3: TWO FINE NECKLACE PRODUCT CARDS (RIGHT SIDE) */}
              {/* ======================================================== */}
              <div className="w-[44%] sm:w-[42%] h-full flex flex-col justify-between gap-3.5">
                {/* NECKLACE PIECE 1: Shining 5-Crystal Silver Chain */}
                <div
                  onClick={playSilverPiece}
                  className={`group relative h-[calc(50%-7px)] rounded-3xl overflow-hidden bg-white border transition-all duration-300 flex flex-col p-2.5 sm:p-3 shadow-xs cursor-pointer ${
                    stage === 'flying_silver' || stage === 'wearing_silver'
                      ? 'border-blue-400 shadow-[0_0_20px_rgba(147,197,253,0.35)] ring-1 ring-blue-400/50'
                      : 'border-[#E5DDD0] hover:border-blue-400/60'
                  }`}
                  title="Click to wear Silver 5-Crystal Chain"
                >
                  <div className="relative w-full h-[72%] rounded-2xl overflow-hidden bg-[#F8F4EE]">
                    <img
                      src={silverImgSrc}
                      onError={() => setSilverImgSrc('/images/silver_5crystal_chain.jpg')}
                      alt="925 Sterling Silver 5-Crystal Station Chain necklace"
                      className={`w-full h-full object-cover transform transition-transform duration-[3400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isInView ? 'scale-100' : 'scale-[1.25]'
                      } group-hover:scale-108`}
                      loading="eager"
                    />

                    {/* Active Origin Pulsing Ring */}
                    {(stage === 'flying_silver' || stage === 'wearing_silver') && (
                      <div className="absolute inset-0 border-2 border-blue-400/80 rounded-2xl animate-pulse pointer-events-none" />
                    )}

                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[8px] sm:text-[9px] font-bold text-blue-900 border border-blue-200 uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                      <Gem className="w-2.5 h-2.5 text-blue-600" />
                      <span>Piece 1: Silver</span>
                    </span>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold text-[#2C2119] border border-[#E5DDD0] shadow-2xs">
                      $110
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="min-w-0">
                      <h4 className="text-[11px] sm:text-xs font-semibold text-[#2C2119] truncate group-hover:text-blue-700 transition-colors">
                        5-Crystal Silver Chain
                      </h4>
                      <p className={`text-[9px] sm:text-[10px] font-medium truncate ${
                        stage === 'wearing_silver'
                          ? 'text-blue-700 font-semibold'
                          : stage === 'flying_silver'
                          ? 'text-blue-600'
                          : 'text-[#7C6C60]'
                      }`}>
                        {stage === 'wearing_silver'
                          ? '● Currently Worn'
                          : stage === 'flying_silver'
                          ? '✦ Gliding to neck...'
                          : '✦ Tap to wear'}
                      </p>
                    </div>
                    <RotateCcw className={`w-3.5 h-3.5 shrink-0 ml-1.5 transition-transform duration-500 ${
                      stage === 'wearing_silver'
                        ? 'text-blue-600 rotate-180'
                        : 'text-[#9E8E82] group-hover:text-blue-600'
                    }`} />
                  </div>
                </div>

                {/* NECKLACE PIECE 2: Marine Baroque Pearl Drop Pendant */}
                <div
                  onClick={playPearlPiece}
                  className={`group relative h-[calc(50%-7px)] rounded-3xl overflow-hidden bg-white border transition-all duration-300 flex flex-col p-2.5 sm:p-3 shadow-xs cursor-pointer ${
                    stage === 'flying_pearl' || stage === 'wearing_pearl'
                      ? 'border-[#B88E3A] shadow-gold-glow ring-1 ring-[#B88E3A]/50'
                      : 'border-[#E5DDD0] hover:border-[#B88E3A]/60'
                  }`}
                  title="Click to wear Baroque Pearl Pendant"
                >
                  <div className="relative w-full h-[72%] rounded-2xl overflow-hidden bg-[#F8F4EE]">
                    <img
                      src={pearlImgSrc}
                      onError={() => setPearlImgSrc('/images/antitarnish_necklace_pearl.jpg')}
                      alt="Marine Baroque Pearl Drop Pendant necklace"
                      className={`w-full h-full object-cover transform transition-transform duration-[3400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isInView ? 'scale-100' : 'scale-[1.25]'
                      } group-hover:scale-108`}
                      loading="eager"
                    />

                    {/* Active Origin Pulsing Ring */}
                    {(stage === 'flying_pearl' || stage === 'wearing_pearl') && (
                      <div className="absolute inset-0 border-2 border-[#B88E3A]/80 rounded-2xl animate-pulse pointer-events-none" />
                    )}

                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[8px] sm:text-[9px] font-bold text-[#8E6A22] border border-amber-300/60 uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5 text-[#B88E3A]" />
                      <span>Piece 2: 18K Pearl</span>
                    </span>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold text-[#2C2119] border border-[#E5DDD0] shadow-2xs">
                      $120
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="min-w-0">
                      <h4 className="text-[11px] sm:text-xs font-semibold text-[#2C2119] truncate group-hover:text-[#8E6A22] transition-colors flex items-center gap-1">
                        <span>Baroque Pearl Pendant</span>
                      </h4>
                      <p className={`text-[9px] sm:text-[10px] font-medium truncate ${
                        stage === 'wearing_pearl'
                          ? 'text-[#8E6A22] font-semibold'
                          : stage === 'flying_pearl'
                          ? 'text-[#B88E3A]'
                          : 'text-[#7C6C60]'
                      }`}>
                        {stage === 'wearing_pearl'
                          ? '● Currently Worn'
                          : stage === 'flying_pearl'
                          ? '✦ Gliding to neck...'
                          : '✦ Tap to wear'}
                      </p>
                    </div>
                    <RotateCcw className={`w-3.5 h-3.5 shrink-0 ml-1.5 transition-transform duration-500 ${
                      stage === 'wearing_pearl'
                        ? 'text-[#B88E3A] rotate-180'
                        : 'text-[#9E8E82] group-hover:text-[#B88E3A]'
                    }`} />
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* 1. FLYING SILVER 5-CRYSTAL CHAIN (Fresh Key Per Flight)  */}
              {/* ======================================================== */}
              {stage === 'flying_silver' && (
                <div
                  key={`flying-silver-${animCount}`}
                  className="absolute z-30 pointer-events-none"
                  style={{
                    animation: 'flySilverToNeck 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
                  }}
                >
                  <div className="relative">
                    <img
                      src={silverCutoutSrc}
                      onError={() => setSilverCutoutSrc('/images/silver_crystal_cutout.png')}
                      alt="Silver 5-Crystal Chain Flying Element"
                      className="w-[125px] sm:w-[145px] lg:w-[165px] h-auto select-none pointer-events-none filter contrast-125 brightness-110 drop-shadow-[0_8px_16px_rgba(255,255,255,0.4)]"
                    />
                  </div>
                </div>
              )}

              {/* Sparkle burst when Silver Chain connects */}
              {isSilverSparkling && (
                <div className="absolute top-[58%] left-[28%] z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <Sparkles className="w-9 h-9 text-blue-200 animate-ping absolute" />
                    <Sparkles className="w-6 h-6 text-white animate-bounce relative" />
                    <div className="absolute w-16 h-16 bg-blue-300/30 rounded-full blur-md animate-pulse" />
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* 2. FLYING BAROQUE PEARL PENDANT (Fresh Key Per Flight)   */}
              {/* ======================================================== */}
              {stage === 'flying_pearl' && (
                <div
                  key={`flying-pearl-${animCount}`}
                  className="absolute z-30 pointer-events-none"
                  style={{
                    animation: 'flyPearlToNeck 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
                  }}
                >
                  <div className="relative">
                    <img
                      src={pearlCutoutSrc}
                      onError={() => setPearlCutoutSrc('/images/pearl_necklace_cutout.png')}
                      alt="Baroque Pearl Pendant Flying Element"
                      className="w-[130px] sm:w-[150px] lg:w-[170px] h-auto select-none pointer-events-none filter contrast-110 brightness-105 drop-shadow-[0_8px_16px_rgba(212,175,55,0.4)]"
                    />
                  </div>
                </div>
              )}

              {/* Sparkle burst when Pearl Pendant connects */}
              {isPearlSparkling && (
                <div className="absolute top-[67%] left-[28%] z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <Sparkles className="w-9 h-9 text-amber-300 animate-ping absolute" />
                    <Sparkles className="w-6 h-6 text-gold-light animate-bounce relative" />
                    <div className="absolute w-20 h-20 bg-gold/25 rounded-full blur-md animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: STORY, COMPACT BENEFITS & CALL TO ACTION */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4 text-left">
            {/* Badge: Appears slowly */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-amber-300/70 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8E6A22] shadow-2xs transform transition-all duration-[2000ms] delay-[150ms] ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#B88E3A]" />
              <span>WHY ANTI-TARNISH?</span>
            </div>

            {/* Headline: Appears slowly */}
            <h2
              className={`font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#2C2119] tracking-tight leading-tight transform transition-all duration-[2400ms] delay-[350ms] ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Made For Real Life. <br />
              <span className="font-serif italic font-normal bg-gradient-to-r from-[#8E6A22] via-[#B88E3A] to-[#A37B2C] bg-clip-text text-transparent">
                Never Fades or Tarnishes.
              </span>
            </h2>

            {/* Description: Appears slowly */}
            <p
              className={`text-xs sm:text-[13px] text-[#6B5A4E] font-light leading-relaxed transform transition-all duration-[2600ms] delay-[600ms] ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              Traditional jewelry tarnishes when moisture oxidizes cheap brass. We engineer our pieces with{' '}
              <strong className="text-[#3D312A] font-semibold">18K Real Gold & Rhodium Vacuum PVD</strong> bonded to medical-grade 316L surgical steel — shower, sweat, and swim without worry.
            </p>

            {/* 3 Compact Benefit Cards: Appears slowly with staggered delays */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 pt-1">
              {benefits.map((b, index) => {
                const Icon = b.icon;
                const benefitDelay = 750 + index * 200;
                return (
                  <div
                    key={b.title}
                    style={{
                      transitionDelay: isInView ? `${benefitDelay}ms` : '0ms',
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl bg-white/90 border border-[#E5DDD0] shadow-2xs transform transition-all duration-[2200ms] ease-out ${
                      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#DFCBB5] flex items-center justify-center text-[#B88E3A] shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-semibold text-[#2C2119] leading-tight">{b.title}</h4>
                      <p className="text-[10px] text-[#6B5A4E] font-light mt-0.5 truncate">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons: Appears slowly */}
            <div
              className={`pt-2 flex flex-wrap items-center gap-3 transform transition-all duration-[2000ms] delay-[1100ms] ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <Link to="/shop?category=necklaces">
                <Button
                  variant="gold"
                  size="md"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Shop Waterproof Necklaces
                </Button>
              </Link>

              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8F4EE] text-[#4A3E39] hover:text-[#2C2119] border border-[#DFCEB7] text-xs font-medium transition-colors shadow-2xs cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#B88E3A]" />
                <span>Restart Try-On</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
