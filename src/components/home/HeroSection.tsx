import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Guarantee continuous playback full-time, looping, and never pausing on scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce initial muted property for browser autoplay policies
    video.muted = isMuted;
    video.defaultMuted = true;

    const playVideo = () => {
      if (video.paused) {
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }
    };

    // Immediate playback attempt
    playVideo();

    const handleLoadedData = () => {
      playVideo();
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        playVideo();
      }
    };

    const handleEnded = () => {
      if (video.duration && video.duration > 22) {
        video.currentTime = 4;
      } else {
        video.currentTime = 0;
      }
      playVideo();
    };

    const handleTimeUpdate = () => {
      // Continuous playback boundary clamp: if an untrimmed video is ever provided, maintain loop between 4s and duration - 5s
      if (video.duration && video.duration > 22) {
        const startTime = 4;
        const endTime = Math.max(startTime + 1, video.duration - 5);
        if (video.currentTime >= endTime) {
          video.currentTime = startTime;
          playVideo();
        } else if (video.currentTime < startTime - 0.2) {
          video.currentTime = startTime;
        }
      }
    };

    window.addEventListener('scroll', playVideo, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    video.addEventListener('canplay', handleLoadedData);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      window.removeEventListener('scroll', playVideo);
      document.removeEventListener('visibilitychange', handleVisibility);
      video.removeEventListener('canplay', handleLoadedData);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleSound = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <section className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex items-center pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-12 overflow-hidden border-b border-stone-200/80 bg-[#FAF7F2]">
      {/* ======================================================== */}
      {/* 1. Full-Time Background Video (Rich, Vibrant & Clear) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          src="/videos/Aura_Fine_Jewelry_trimmed.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.05] saturate-[1.08]"
        >
          <source src="/videos/Aura_Fine_Jewelry_trimmed.mp4" type="video/mp4" />
          <source src="/videos/Aura_Fine_Jewelry_30s_Commercial.mp4" type="video/mp4" />
          <source src="/Aura_Fine_Jewelry_30s_Commercial.mp4" type="video/mp4" />
        </video>

        {/* Soft targeted gradient behind text side only — video across center & right is fully visible and vibrant */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/90 via-[#FAF7F2]/55 to-transparent w-full lg:w-3/5" />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-1/3 bg-[#FAF7F2]/30 backdrop-blur-[0.5px]" />

        {/* Delicate top/bottom edge transitions into the page */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#FAF7F2]/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FAF7F2]/90 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full">
        {/* Top Controls Toolbar: TVC Badge & Audio Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pb-3 sm:pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-amber-300/50 shadow-xs text-[11px] font-sans text-stone-800 transition-all">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-serif tracking-wider uppercase font-semibold text-[10px] text-stone-900">
              DREAM WEAR TVC • 4K
            </span>
          </div>

          {/* Audio Mute/Unmute Control */}
          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#584128] backdrop-blur-md border border-amber-400/60 shadow-xs text-[11px] font-sans transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#B88E3A]" />
                <span className="text-[10px] uppercase font-serif tracking-wider font-semibold text-[#63481D]">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#B88E3A] animate-pulse" />
                <span className="text-[10px] uppercase font-serif tracking-wider font-semibold text-[#8E6A22]">Audio On</span>
              </>
            )}
          </button>
        </div>

        {/* Hero Editorial Content */}
        <div className="max-w-2xl lg:max-w-xl space-y-4 sm:space-y-5 text-left">
          {/* Eyebrow badge: Elegant Haute-Couture Announcement */}
          <Link
            to="/shop?collection=new-arrivals"
            className="group inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-amber-300/60 hover:border-amber-400 shadow-2xs transition-all duration-300"
            title="Explore New Arrivals"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] sm:text-[10.5px] font-serif uppercase tracking-[0.22em] text-stone-800 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>JUST DROPPED • EXPLORE NEW ARRIVALS</span>
              <ArrowRight className="w-3 h-3 text-amber-800 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Large Editorial Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.75rem] font-light text-[#2C2119] leading-[1.08] tracking-tight drop-shadow-xs">
            Jewelry That <br />
            <span className="font-serif italic font-normal bg-gradient-to-r from-[#3D3025] via-[#855B27] to-[#B88E3A] bg-clip-text text-transparent">
              Moves With You.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-black font-semibold sm:font-medium leading-relaxed max-w-xl tracking-normal text-stone-950">
            Minimal, timeless, and engineered for real life. Crafted in medical-grade 316L hypoallergenic surgical steel enveloped in real 18K gold.
          </p>

          {/* Highlighted Shop Collection & Elegant New Arrivals Action Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1.5">
            {/* PRIMARY HIGHLIGHTED: Shop Collection */}
            <div className="relative group/shop w-full sm:w-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-gold to-amber-500 rounded-xl blur-sm opacity-50 group-hover/shop:opacity-90 transition duration-500 animate-pulse pointer-events-none" />

              <Link to="/shop" className="relative block w-full sm:w-auto">
                <button
                  type="button"
                  className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white border border-amber-300/80 shadow-md font-serif tracking-[0.16em] uppercase font-bold text-xs sm:text-[13px] transition-all duration-300 overflow-hidden cursor-pointer select-none active:scale-[0.98]"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover/shop:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

                  <Sparkles className="w-4 h-4 text-amber-100 animate-pulse" />
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 text-amber-100 group-hover/shop:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* SECONDARY ELEGANT: Explore New Arrivals */}
            <Link to="/shop?collection=new-arrivals" className="w-full sm:w-auto group/arr block">
              <button
                type="button"
                className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-white/95 hover:bg-white text-black border border-stone-300 hover:border-amber-400 shadow-2xs font-serif tracking-[0.16em] uppercase font-bold text-xs sm:text-[13px] transition-all duration-300 cursor-pointer select-none active:scale-[0.98]"
              >
                <span className="text-black">Explore New Arrivals</span>
                <span className="ml-1 px-1.5 py-0.5 text-[8.5px] bg-amber-500/15 text-amber-950 border border-amber-400/40 rounded-full font-sans font-bold tracking-wider uppercase">
                  NEW
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-900 group-hover/arr:translate-x-1 transition-transform ml-0.5" />
              </button>
            </Link>
          </div>

          {/* Key Assurance Micro Metrics */}
          <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs max-w-xl">
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div className="space-y-0.5">
                <span className="font-serif text-2xl sm:text-3xl font-light text-black block tracking-tight">
                  100%
                </span>
                <span className="text-[10px] sm:text-[11.5px] text-stone-950 uppercase tracking-[0.16em] font-semibold block">
                  Anti-Tarnish
                </span>
              </div>
              <div className="space-y-0.5 border-l border-stone-200/90 pl-3 sm:pl-6">
                <span className="font-serif text-2xl sm:text-3xl font-light text-black block tracking-tight">
                  2-Year
                </span>
                <span className="text-[10px] sm:text-[11.5px] text-stone-950 uppercase tracking-[0.16em] font-semibold block">
                  Color Lock
                </span>
              </div>
              <div className="space-y-0.5 border-l border-stone-200/90 pl-3 sm:pl-6">
                <div className="flex items-center gap-1">
                  <span className="font-serif text-2xl sm:text-3xl font-light text-black tracking-tight">
                    4.9
                  </span>
                  <span className="text-amber-500 text-sm">★</span>
                </div>
                <span className="text-[10px] sm:text-[11.5px] text-stone-950 uppercase tracking-[0.16em] font-semibold block">
                  2,000+ Reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
