import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  ShieldCheck,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';

interface EarringPair {
  id: string;
  name: string;
  category: string;
  material: string;
  price: string;
  image: string;
  tag: string;
  description: string;
}

const EARRING_PAIRS: EarringPair[] = [
  {
    id: 'flora-pave',
    name: 'Flora Pavé 18K Solitaires',
    category: 'Pair of 2 Earrings',
    material: '18K Yellow Gold • Diamond Pavé Petals',
    price: '₹14,990',
    image: '/images/packaging/pair_gold.png',
    tag: 'Signature Pair',
    description: 'Six brilliant-cut diamond petals centering a solitaire diamond in 18K yellow gold.',
  },
  {
    id: 'south-sea-pearl',
    name: 'South Sea Pearl Diamond Clusters',
    category: 'Pair of 2 Earrings',
    material: '18K White Gold • South Sea Pearls',
    price: '₹18,490',
    image: '/images/packaging/pair_pearl.png',
    tag: 'Haute Atelier',
    description: 'Lustrous South Sea pearls suspended from pavé floral cluster tops.',
  },
  {
    id: 'molten-teardrop',
    name: 'Molten Gold Pavé Teardrops',
    category: 'Pair of 2 Earrings',
    material: '18K Yellow Gold • Micro-Pavé Inset',
    price: '₹12,990',
    image: '/images/packaging/pair_teardrop.png',
    tag: 'Bestseller Pair',
    description: 'Hand-sculpted organic molten drops accented with radiant pavé diamonds.',
  },
];

type RitualStage =
  | 'approaching'   // Pair glides in above the open 3D box
  | 'setting'       // Pair settles into the plush velvet cushion slots
  | 'closing'       // 3D box lid closes automatically
  | 'next_incoming'; // Next pair glides in from the right side

export const LuxuryPackagingUnboxing: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [stage, setStage] = useState<RitualStage>('approaching');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentPair = EARRING_PAIRS[activeIdx];
  const nextIdx = (activeIdx + 1) % EARRING_PAIRS.length;
  const nextPair = EARRING_PAIRS[nextIdx];

  // Stage durations for seamless automatic cycle (deliberate & luxurious pace)
  const STAGE_DURATIONS: Record<RitualStage, number> = {
    approaching: 2400,  // Pair floats above box with gentle sparkle
    setting: 2800,      // Pair locks into cushion slots + sparkles
    closing: 3200,      // Box lid closes automatically, sealed emblem
    next_incoming: 2000,// Next pair slides in smoothly from the right
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const duration = STAGE_DURATIONS[stage];

    timerRef.current = setTimeout(() => {
      switch (stage) {
        case 'approaching':
          setStage('setting');
          break;
        case 'setting':
          setStage('closing');
          break;
        case 'closing':
          setStage('next_incoming');
          break;
        case 'next_incoming':
          // Advance to the next earring pair and restart cycle
          setActiveIdx((prev) => (prev + 1) % EARRING_PAIRS.length);
          setStage('approaching');
          break;
      }
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, isPlaying, activeIdx]);

  const handleSelectPair = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveIdx(index);
    setStage('approaching');
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveIdx(0);
    setStage('approaching');
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Determine visual states
  const isBoxClosed = stage === 'closing';
  const areEarringsInCushion = stage === 'setting' || stage === 'closing';

  return (
    <section
      id="packaging-unboxing"
      className="relative w-full py-8 sm:py-12 bg-gradient-to-b from-[#FAF7F2] via-[#F4ECE1] to-[#FAF7F2] text-[#2C2119] overflow-hidden border-y border-[#DFCEB7]/50"
    >
      {/* Preload 3D Packaging Images */}
      <link rel="preload" as="image" href="/images/packaging/box_empty.png" />
      <link rel="preload" as="image" href="/images/packaging/box_closed.png" />
      <link rel="preload" as="image" href="/images/packaging/pair_gold.png" />
      <link rel="preload" as="image" href="/images/packaging/pair_pearl.png" />
      <link rel="preload" as="image" href="/images/packaging/pair_teardrop.png" />

      {/* Ambient Luxury Lighting & Glow (Seamless, no card container) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-200/25 via-[#ECD7BA]/30 to-amber-100/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* COMPACT SECTION HEADER (Minimal Gaps) */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-[#E8DCcb]/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-[#D8C7B0] shadow-2xs mb-1.5">
              <Sparkles className="w-3 h-3 text-[#B88E3A]" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#B88E3A]">
                3D Atelier Packaging Ritual
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-light text-[#2C2119] tracking-tight">
              A Pair in Every Keepsake Box,{' '}
              <span className="italic font-normal text-[#B88E3A]">Sealed Automatically</span>
            </h2>
          </div>

          {/* Interactive Play & Replay Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#2C2119] border border-[#D8C7B0] text-xs font-medium transition-all shadow-2xs"
              title={isPlaying ? 'Pause ritual' : 'Play ritual'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 text-[#B88E3A]" />
                  <span className="text-[11px]">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-[#B88E3A] fill-[#B88E3A]" />
                  <span className="text-[11px]">Auto-Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#B88E3A] to-[#C5A059] hover:from-[#A87E2A] hover:to-[#B59049] text-white text-xs font-medium transition-all shadow-xs"
              title="Restart packaging sequence"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="text-[11px]">Replay</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SEAMLESS ATELIER PRESENTATION (NO CARD / BOX FORMAT) */}
        {/* ======================================================== */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[420px] sm:min-h-[440px]">
          
          {/* ------------------------------------------------------ */}
          {/* LEFT: ACTIVE PAIR EDITORIAL DETAILS */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-3 flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left space-y-3">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#B88E3A]/10 text-[#B88E3A] text-[10px] font-bold tracking-wider uppercase mb-1">
                {currentPair.tag}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C2119] leading-snug">
                {currentPair.name}
              </h3>
              <p className="text-xs text-[#8C7A6B] mt-0.5 font-light">
                {currentPair.category} • {currentPair.material}
              </p>
            </div>

            <p className="text-xs text-[#6B5A4E] leading-relaxed font-light hidden sm:block">
              {currentPair.description}
            </p>

            <div className="flex items-baseline justify-center lg:justify-start gap-2 pt-1">
              <span className="text-lg font-serif font-bold text-[#2C2119]">
                {currentPair.price}
              </span>
              <span className="text-[11px] text-[#A87E2A] font-medium tracking-wide">
                (Complete Pair)
              </span>
            </div>

            {/* Ritual Status Indicator Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border border-[#E2D5C3] shadow-2xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B88E3A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B88E3A]" />
                </span>
                <span className="text-[11px] font-serif text-[#2C2119] font-medium">
                  {stage === 'approaching' && 'Pair gliding toward box...'}
                  {stage === 'setting' && 'Nestled in velvet cushion slots ✨'}
                  {stage === 'closing' && '3D Box sealed automatically 🔒'}
                  {stage === 'next_incoming' && 'Next pair arriving from right →'}
                </span>
              </div>
            </div>

            {/* Quick Pair Selector Pills */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 pt-2">
              {EARRING_PAIRS.map((pair, idx) => (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => handleSelectPair(idx)}
                  className={`w-7 h-7 rounded-full text-xs font-serif font-bold transition-all border ${
                    activeIdx === idx
                      ? 'bg-[#B88E3A] text-white border-[#A87E2A] shadow-xs scale-105'
                      : 'bg-white/80 hover:bg-white text-[#6B5A4E] border-[#D8C7B0]'
                  }`}
                  title={pair.name}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* CENTER: 3D JEWELRY BOX & PAIR SETTING ANIMATION */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative order-1 lg:order-2">
            
            {/* Stage Pedestal Platform / Ambient Surface Reflection */}
            <div className="relative w-[300px] sm:w-[380px] md:w-[420px] h-[300px] sm:h-[380px] md:h-[420px] flex items-center justify-center mx-auto">
              
              {/* Deep 3D Contact Shadow beneath Box */}
              <div className="absolute bottom-6 w-[75%] h-12 bg-gradient-to-r from-stone-900/30 via-[#4A321E]/40 to-stone-900/30 blur-2xl rounded-full transform -rotate-3 pointer-events-none" />

              {/* 3D Open Jewelry Box (Base + Velvet Cushion Slots) */}
              <img
                src="/images/packaging/box_empty.png"
                alt="3D Luxury Open Jewelry Box with Velvet Earring Cushion"
                className={`absolute inset-0 w-full h-full object-contain select-none transition-all duration-700 ease-in-out ${
                  isBoxClosed
                    ? 'opacity-0 scale-95 pointer-events-none'
                    : 'opacity-100 scale-100'
                }`}
                style={{
                  filter: 'drop-shadow(0 15px 30px rgba(74, 50, 30, 0.18))',
                }}
              />

              {/* The Active Pair of 2 Earrings (Gliding & Settling into Velvet Slots) */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-all duration-1200 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  stage === 'approaching'
                    ? '-translate-y-20 -translate-x-4 scale-110 opacity-90'
                    : stage === 'setting'
                    ? 'translate-y-[22px] translate-x-[-14px] scale-[0.52] rotate-[8deg] opacity-100'
                    : stage === 'closing'
                    ? 'translate-y-[22px] translate-x-[-14px] scale-[0.52] rotate-[8deg] opacity-0'
                    : 'translate-y-[-10px] scale-90 opacity-0'
                }`}
                style={{
                  filter: areEarringsInCushion
                    ? 'drop-shadow(0 6px 10px rgba(35, 25, 15, 0.55))'
                    : 'drop-shadow(0 16px 20px rgba(184, 142, 58, 0.45))',
                }}
              >
                <div className="relative">
                  <img
                    src={currentPair.image}
                    alt={`${currentPair.name} pair`}
                    className="w-56 sm:w-64 h-auto object-contain"
                  />

                  {/* Sparkle Glimmer FX when settled into cushion */}
                  {stage === 'setting' && (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300 absolute -top-2 left-6 animate-ping" />
                      <Sparkles className="w-6 h-6 text-white absolute top-4 right-6 animate-pulse" />
                    </>
                  )}
                </div>
              </div>

              {/* 3D Closed Jewelry Box (Closed Lid with Gold DREAM WEAR Emblem & Latch) */}
              <img
                src="/images/packaging/box_closed.png"
                alt="3D Luxury Closed Jewelry Box Sealed with Gold Emblem"
                className={`absolute inset-0 w-full h-full object-contain select-none transition-all duration-1000 ease-in-out z-30 ${
                  isBoxClosed
                    ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                    : 'opacity-0 scale-105 -translate-y-6 pointer-events-none'
                }`}
                style={{
                  filter: 'drop-shadow(0 20px 35px rgba(74, 50, 30, 0.25))',
                }}
              />

              {/* Box Closed Gold Emblem Flash Highlight */}
              {isBoxClosed && (
                <div className="absolute top-[28%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
                  <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
                </div>
              )}
            </div>

            {/* Seamless Under-Box Caption */}
            <div className="mt-2 text-center">
              <span className="text-xs font-serif font-medium text-[#2C2119]">
                {brandConfig.name} Bespoke Keepsake Box
              </span>
              <p className="text-[10px] text-[#8C7A6B]">
                Dual Velvet Cushion Slots • Brushed Gold Rim & Latch
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* RIGHT: NEXT EARRING PAIR COMES AUTOMATICALLY */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center order-3 text-center lg:text-right space-y-3">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-[#B88E3A]/20 border border-[#D5BE9E] text-[#B88E3A]">
              <ArrowRight className="w-3 h-3 text-[#B88E3A]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Up Next In Ritual
              </span>
            </div>

            {/* The Upcoming Pair Card (Floating seamlessly, no rigid container) */}
            <div
              onClick={() => handleSelectPair(nextIdx)}
              className={`group cursor-pointer relative p-3 sm:p-4 rounded-2xl transition-all duration-700 flex flex-col items-center lg:items-end ${
                stage === 'next_incoming'
                  ? 'scale-105 -translate-x-4 bg-white/90 shadow-md border border-[#B88E3A]'
                  : 'hover:scale-102 bg-white/50 hover:bg-white/80 border border-[#E4D6C4]/80'
              }`}
              title="Click to pack this pair now"
            >
              {/* Upcoming Pair Image */}
              <div className="relative w-28 sm:w-32 h-28 sm:h-32 flex items-center justify-center mb-2">
                <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-md group-hover:bg-amber-400/20 transition-all" />
                <img
                  src={nextPair.image}
                  alt={nextPair.name}
                  className={`w-full h-full object-contain filter drop-shadow-sm transition-transform duration-500 ${
                    stage === 'next_incoming'
                      ? 'scale-110 -translate-x-2'
                      : 'group-hover:scale-105'
                  }`}
                />
              </div>

              {/* Upcoming Pair Details */}
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A87E2A]">
                {nextPair.tag}
              </span>
              <h4 className="font-serif font-bold text-sm text-[#2C2119]">
                {nextPair.name}
              </h4>
              <span className="text-xs font-serif font-semibold text-[#8C7A6B]">
                {nextPair.price}
              </span>

              {/* Action Hint */}
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#B88E3A] font-medium group-hover:underline">
                <span>Incoming Next</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Automated Cycle Note */}
            <p className="text-[10px] text-[#8C7A6B] max-w-[200px] font-light leading-snug">
              Pairs auto-rotate continuously. Click any pair to view its packaging ritual.
            </p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* COMPACT LUXURY VALUE PROP STRIP (NO UNNECESSARY GAPS) */}
        {/* ======================================================== */}
        <div className="mt-6 pt-5 border-t border-[#E8DCcb]/70 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-[#E8DDCF]/80">
            <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-[#D5BE9E] text-[#B88E3A] flex items-center justify-center shrink-0">
              <Gift className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#2C2119]">
                Complimentary 3D Box
              </h5>
              <p className="text-[10px] text-[#6B5A4E] font-light">
                Custom velvet slots protect your earring pairs during travel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-[#E8DDCF]/80">
            <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-[#D5BE9E] text-[#B88E3A] flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#2C2119]">
                Gold Foil Seal
              </h5>
              <p className="text-[10px] text-[#6B5A4E] font-light">
                Embossed {brandConfig.name} crest with brushed brass latch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-[#E8DDCF]/80">
            <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-[#D5BE9E] text-[#B88E3A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#2C2119]">
                Anti-Tarnish Sealed
              </h5>
              <p className="text-[10px] text-[#6B5A4E] font-light">
                Atmospheric anti-oxidation guarantee from atelier to doorstep.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LuxuryPackagingUnboxing;
