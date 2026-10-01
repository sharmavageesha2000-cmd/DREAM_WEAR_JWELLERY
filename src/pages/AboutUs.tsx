import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Droplets,
  ArrowRight,
  Award,
  Gem,
  Layers,
  CheckCircle2,
  XCircle,
  Recycle,
  Leaf,
  Clock,
  ChevronDown,
  Check,
  Flame,
  Sparkle,
  Compass
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const AboutUs: React.FC = () => {
  useSEO({
    title: 'About DREAM WEAR — Our Atelier, PVD Metallurgy & Craftsmanship Manifesto',
    description:
      'Discover the science and craftsmanship behind DREAM WEAR. Engineered with 18K Real Gold Vacuum PVD on 316L surgical steel — waterproof, hypoallergenic fine jewelry made for real life. Backed by a 2-Year Color Guarantee.',
    keywords: [
      'about dream wear',
      'anti-tarnish jewelry story',
      'pvd gold technology',
      'hypoallergenic jewelry',
      'waterproof jewelry atelier',
      'sustainable fine jewelry',
    ],
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const milestones = [
    {
      year: '2022',
      title: 'The Kitchen Metallurgy Experiment',
      desc: 'Frustrated by cheap brass pieces tarnishing green after weekend ocean swims in Goa and sweaty yoga sessions, our founders teamed up with aerospace coating engineers to find an impervious solution.',
    },
    {
      year: '2023',
      title: 'The 10x Vacuum PVD Breakthrough',
      desc: 'After 84 lab iterations, we perfected our proprietary 400°C vacuum plasma chamber protocol. Our initial capsule of 500 tennis bracelets sold out in 48 hours with zero tarnish returns.',
    },
    {
      year: '2024',
      title: 'Global Atelier Expansion',
      desc: 'Partnered with design studios in Milan and Mumbai to fuse European minimalist silhouettes with medical-grade surgical metallurgy. Over 50,000 women adopted the 24/7 wear lifestyle.',
    },
    {
      year: '2025',
      title: 'The 730-Day Guarantee Standard',
      desc: 'Introduced the industry-leading 2-Year Full Replacement Warranty, proving fine jewelry can be durable, shower-safe, and affordable without compromising atelier aesthetics.',
    },
    {
      year: 'Today',
      title: '150+ Waterproof Designs Across 42 Countries',
      desc: 'From layered herringbone chains to freshwater baroque pearl drops and sculpted cuff bangles, worn continuously day and night around the globe.',
    },
  ];

  const faqs = [
    {
      q: 'Can I truly wear DREAM WEAR in daily hot showers, steam saunas, and chlorinated pools?',
      a: 'Yes, 100%. Our jewelry is engineered specifically for active, continuous wear. Traditional plating breaks down because moisture oxidizes cheap brass underneath. We use pure surgical-grade 316L stainless steel bonded to real 18K gold inside a high-vacuum plasma chamber, making it completely impervious to hot water, steam, shampoo, body oils, and pool chlorine.',
    },
    {
      q: 'Will DREAM WEAR pieces ever turn my skin green or cause allergic reactions?',
      a: 'Never. The green discoloration common with conventional jewelry is caused by copper or nickel reacting with your skin’s natural acidity. We are strictly 100% Nickel-Free, Lead-Free, and Cadmium-Free. 316L surgical steel is the exact hypoallergenic material certified for medical bone implants, making it safe for even ultra-sensitive skin.',
    },
    {
      q: 'How is Vacuum PVD Gold different from traditional Gold Plating or Gold Vermeil?',
      a: 'Standard gold plating uses electroplating chemical baths that leave a fragile 0.1 to 0.5-micron gold dust layer that rubs off in weeks. Gold Vermeil uses sterling silver which naturally oxidizes and turns black over time. Our Physical Vapor Deposition (PVD) vaporizes 18K real gold into high-energy plasma, fusing it into the atomic lattice of surgical steel up to 10x thicker. It cannot peel, chip, or flake.',
    },
    {
      q: 'Is real gold actually used in the coating process?',
      a: 'Yes. We use certified real 18-Karat yellow gold and rose gold, alongside 925 rhodium for our silver-tone pieces. You get the authentic warm luster, reflectivity, and richness of solid fine jewelry at a fraction of the cost and with 10x the durability.',
    },
    {
      q: 'How does the 2-Year Color Replacement Warranty work?',
      a: 'Every DREAM WEAR purchase is automatically backed by our 730-day guarantee. If your piece ever tarnishes, fades, or discolors under normal wear within two years, simply email support@dreamwear.com with a photo of your piece and your order number. We will immediately ship you a brand-new replacement free of charge.',
    },
    {
      q: 'Are your freshwater pearls genuine?',
      a: 'Yes. Every baroque pearl, drop pendant, and station bead is hand-selected from sustainably managed freshwater oyster cultivation farms. Because each pearl is naturally formed, no two pieces are identical, giving each wearer a unique natural treasure.',
    },
  ];

  const team = [
    {
      name: 'Aanya Mehta',
      role: 'Co-Founder & Creative Director',
      bio: 'Trained at the prestigious Istituto Marangoni in Milan, Aanya spent a decade designing haute couture bridal jewelry before launching DREAM WEAR to make luxury wearable for real life.',
      image: '/images/woman_wearing_pearl_necklace.jpg',
    },
    {
      name: 'Dr. Marcus Vance',
      role: 'Head of Metallurgy & Engineering',
      bio: 'Aerospace materials scientist specializing in high-vacuum plasma physics. Marcus engineered our proprietary 10x PVD bonding protocol to withstand extreme environments.',
      image: '/images/products/cand_tennis.jpg',
    },
    {
      name: 'Elena Rostova',
      role: 'Master Gemologist & Quality Director',
      bio: 'GIA-certified gemologist overseeing our conflict-free stone sourcing and 48-point atelier inspection process for flawless mirror polish and clasp resilience.',
      image: '/images/products/wave_cuff_1.jpg',
    },
  ];

  return (
    <div className="py-8 sm:py-14 bg-[#FCFBF8] text-[#2C2119]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'About Our Maison' },
          ]}
        />

        {/* ======================================================== */}
        {/* HERO: MAISON MANIFESTO & PHILOSOPHY                      */}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE1] border border-[#E3D7C5] text-[#8E6A22] text-[11px] font-bold uppercase tracking-[0.25em] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E3A]" />
            <span>MAISON MANIFESTO • EST. 2022</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#221914] tracking-tight leading-[1.15]">
            Liberating Fine Jewelry From Velvet Lockboxes.
          </h1>

          <p className="text-sm sm:text-base text-[#6B5A4E] font-light leading-relaxed max-w-2xl mx-auto">
            Engineered for hot showers, ocean swims, intense workout routines, and executive boardrooms. Real 18K gold crafted to never tarnish, irritate, or demand caution.
          </p>

          {/* Quick-Jump Section Navigation Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'Our Story', href: '#story' },
              { label: 'PVD Science', href: '#science' },
              { label: '3-Way Comparison', href: '#comparison' },
              { label: 'Sustainability', href: '#sustainability' },
              { label: 'Milestones', href: '#timeline' },
              { label: 'Care Guide', href: '#care' },
              { label: 'FAQ', href: '#faq' },
            ].map((nav) => (
              <a
                key={nav.label}
                href={nav.href}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8F4EE] border border-[#E5DDD0] text-xs font-medium text-[#57493E] hover:text-[#2C2119] transition-all shadow-2xs cursor-pointer"
              >
                {nav.label}
              </a>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* STATS STRIP: PROVEN ATELIER IMPACT                       */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { number: '100,000+', label: 'Pieces Adorned Worldwide', sub: 'Across 42 countries' },
            { number: '730 Days', label: 'Color Replacement Warranty', sub: '100% No-questions asked' },
            { number: '10x', label: 'Thicker Vacuum PVD Layer', sub: 'Vs. conventional electroplate' },
            { number: '0% Nickel', label: 'Medical-Grade 316L Steel', sub: 'Zero green skin guarantee' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE4D8] shadow-xs text-center space-y-1 hover:border-[#DFCBB5] transition-all"
            >
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#8E6A22]">{stat.number}</p>
              <p className="text-xs sm:text-[13px] font-semibold text-[#2C2119]">{stat.label}</p>
              <p className="text-[10px] sm:text-[11px] text-[#7C6C60] font-light">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: OUR FOUNDING STORY (#story)                   */}
        {/* ======================================================== */}
        <div id="story" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-6 rounded-3xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-square relative bg-stone-900 border border-[#E5DDD0] group">
            <img
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80"
              alt="DREAM WEAR Craftsmanship Atelier"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 inset-x-5 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#E8C882] font-bold block mb-1">
                HAND-CRAFTED ATELIER
              </span>
              <p className="font-serif text-lg font-light text-white">
                Merging century-old goldsmith artistry with aerospace plasma deposition.
              </p>
            </div>
          </div>

          <div className="md:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#E5DDD0] text-[#8E6A22] text-[10px] font-bold uppercase tracking-wider">
              <Compass className="w-3 h-3 text-[#B88E3A]" />
              <span>OUR ORIGIN</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#221914] leading-tight">
              Why We Rebelled Against The Fast-Fashion Jewelry Trap
            </h2>

            <div className="space-y-3.5 text-xs sm:text-[13.5px] text-[#635347] font-light leading-relaxed">
              <p>
                Like countless modern women, our founders faced a perpetual dilemma: spend thousands on delicate solid gold that felt too precious to wear while traveling, working out, or swimming — or settle for brass fast-fashion pieces that tarnished into a dull, copper-green residue after three humid weeks.
              </p>
              <p>
                Jewelry should celebrate your everyday moments, not demand constant caution. Why should you have to take your favorite necklace off before your morning hot shower? Why should swimming in the ocean ruin a birthday gift?
              </p>
              <p>
                We spent two years consulting metallurgical scientists, aerospace engineers, and European master jewelers. The answer was revolutionary: discard brass entirely, forge our pieces in medical-grade 316L hypoallergenic surgical steel, and bond real 18K gold under intense plasma vacuum pressure.
              </p>
            </div>

            <div className="pt-2 border-t border-[#EBE4D8] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF5EC] border border-[#DFCBB5] flex items-center justify-center text-[#B88E3A] shrink-0 font-serif font-bold text-lg">
                DW
              </div>
              <div>
                <p className="font-serif font-semibold text-sm text-[#2C2119]">The DREAM WEAR Atelier Promise</p>
                <p className="text-[11px] text-[#7C6C60] font-light">Engineered for morning workouts, ocean dips, and black-tie galas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: THE 4 PILLARS OF CRAFTSMANSHIP (#science)      */}
        {/* ======================================================== */}
        <div id="science" className="scroll-mt-24 space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#8E6A22] font-bold">THE SCIENCE</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#221914]">
              The 4 Pillars of DREAM WEAR Metallurgy
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A4E] font-light">
              Conventional plating chips because brass oxidizes with air. Our high-vacuum plasma fusion creates an impenetrable molecular bond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                icon: Layers,
                title: '10x Atomic Vacuum PVD',
                tag: 'AEROSPACE TECH',
                desc: 'Real 18-karat gold vaporizes into high-energy plasma inside a 400°C vacuum chamber, penetrating the steel’s crystal lattice so it never peels or rubs off.',
              },
              {
                icon: ShieldCheck,
                title: '316L Surgical Implant Steel',
                tag: 'HYPOALLERGENIC',
                desc: 'The exact medical-grade alloy trusted for surgical implants. 100% impervious to rust, perspiration, seawater, and chlorine. Zero green skin guarantee.',
              },
              {
                icon: Gem,
                title: 'AAA Cultured Pearls & Gems',
                tag: 'ETHICAL SOURCING',
                desc: 'Each baroque pearl and brilliant 5A cubic zirconia is hand-selected for deep orient luster and mirror-grade facet symmetry, set in solid prong clasps.',
              },
              {
                icon: Award,
                title: '48-Point Atelier Inspection',
                tag: 'MASTER FINISHING',
                desc: 'Every bracelet, hoop, and pendant undergoes rigorous ultrasonic cleaning, salt-fog corrosion testing, and clasp-resilience tests before packaging.',
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 rounded-3xl bg-white border border-[#EBE4D8] shadow-xs hover:border-[#DFCBB5] hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF5EC] border border-[#DFCBB5] flex items-center justify-center text-[#B88E3A]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#8E6A22] block">
                      {pillar.tag}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[#221914]">{pillar.title}</h3>
                    <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: 3-WAY COMPARISON MATRIX (#comparison)         */}
        {/* ======================================================== */}
        <div id="comparison" className="scroll-mt-24 bg-white rounded-3xl p-6 sm:p-10 border border-[#EBE4D8] shadow-sm space-y-6 text-left">
          <div className="max-w-2xl space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8E6A22] font-bold">HEAD-TO-HEAD</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#221914]">
              How DREAM WEAR Compares
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A4E] font-light">
              See why hundreds of thousands of jewelry lovers have switched to our waterproof atomic PVD pieces.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#EBE4D8] text-[11px] uppercase tracking-wider text-[#7C6C60]">
                  <th className="py-3 px-3 sm:px-4 font-semibold">Key Criteria</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold text-rose-800">Fast Fashion (Brass)</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold text-stone-700">Solid 18K Gold</th>
                  <th className="py-3 px-3 sm:px-4 font-bold text-[#8E6A22] bg-[#FAF5EC] rounded-t-xl">
                    DREAM WEAR PVD
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE0] text-xs">
                <tr>
                  <td className="py-3.5 px-3 sm:px-4 font-medium text-[#221914]">Core Base Metal</td>
                  <td className="py-3.5 px-3 sm:px-4 text-[#7C6C60]">Cheap Brass / Zinc Alloy</td>
                  <td className="py-3.5 px-3 sm:px-4 text-[#7C6C60]">75% Gold / 25% Soft Alloy</td>
                  <td className="py-3.5 px-3 sm:px-4 font-semibold text-[#8E6A22] bg-[#FAF5EC]">
                    316L Surgical Stainless Steel
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 sm:px-4 font-medium text-[#221914]">Gold Application</td>
                  <td className="py-3.5 px-3 sm:px-4 text-[#7C6C60]">0.05µm Flash Electroplate</td>
                  <td className="py-3.5 px-3 sm:px-4 text-[#7C6C60]">Solid Metal throughout</td>
                  <td className="py-3.5 px-3 sm:px-4 font-semibold text-[#8E6A22] bg-[#FAF5EC]">
                    10x Atomic Vacuum PVD Real 18K
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 sm:px-4 font-medium text-[#221914]">Shower & Pool Safe</td>
                  <td className="py-3.5 px-3 sm:px-4 text-rose-600 font-medium">
                    <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 shrink-0" /> Fades in weeks</span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-emerald-700">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Safe but soft/dents</span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 font-bold text-emerald-700 bg-[#FAF5EC]">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 100% Shower, Pool & Ocean Safe</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 sm:px-4 font-medium text-[#221914]">Green Skin Guarantee</td>
                  <td className="py-3.5 px-3 sm:px-4 text-rose-600 font-medium">
                    <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 shrink-0" /> High risk (Copper/Nickel)</span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-emerald-700">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Hypoallergenic</span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 font-bold text-emerald-700 bg-[#FAF5EC]">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 100% Medical Grade (0% Nickel)</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 sm:px-4 font-medium text-[#221914]">Color Warranty</td>
                  <td className="py-3.5 px-3 sm:px-4 text-[#7C6C60]">None (14-day return max)</td>
                  <td className="py-3.5 px-3 sm:px-4 text-[#7C6C60]">Lifetime (Natural metal)</td>
                  <td className="py-3.5 px-3 sm:px-4 font-bold text-[#8E6A22] bg-[#FAF5EC]">
                    2-Year No-Questions Replacement
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 sm:px-4 font-medium text-[#221914]">Average Price</td>
                  <td className="py-3.5 px-3 sm:px-4 text-[#7C6C60]">$20 – $50 (Thrown away in 2 months)</td>
                  <td className="py-3.5 px-3 sm:px-4 text-[#7C6C60]">$800 – $4,500+</td>
                  <td className="py-3.5 px-3 sm:px-4 font-bold text-[#8E6A22] bg-[#FAF5EC] rounded-b-xl">
                    $45 – $140 (Years of continuous wear)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: SUSTAINABILITY & ETHICS (#sustainability)     */}
        {/* ======================================================== */}
        <div id="sustainability" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE4D8] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#221914]">80% Recycled Surgical Steel</h3>
            <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">
              Traditional gold mining involves open-pit excavation and massive carbon emissions. By utilizing recycled 316L medical stainless steel, we eliminate destructive mining practices while delivering unmatched structural durability.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE4D8] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#8E6A22] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#221914]">Clean Plasma, Zero Toxic Runoff</h3>
            <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">
              Traditional electroplating utilizes toxic cyanide liquid chemical baths that pose severe runoff hazards to local water tables. Vacuum PVD is a dry, plasma-based vacuum process with zero hazardous chemical effluents.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE4D8] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#221914]">Keepsake Vanity Packaging</h3>
            <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">
              Our signature unboxing packaging uses FSC-certified recycled rigid cardstock and reusable velvet travel pouches designed to live on your dresser forever rather than filling landfills.
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 5: MILESTONES TIMELINE (#timeline)               */}
        {/* ======================================================== */}
        <div id="timeline" className="scroll-mt-24 space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#8E6A22] font-bold">OUR JOURNEY</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#221914]">
              From Bold Experiment to Global Movement
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A4E] font-light">
              How a stubborn refusal to accept fragile jewelry created a modern anti-tarnish fine jewelry revolution.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto text-left">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#EBE4D8] shadow-xs flex flex-col sm:flex-row sm:items-start gap-4 hover:border-[#DFCBB5] transition-all"
              >
                <div className="px-3.5 py-1.5 rounded-xl bg-[#FAF5EC] border border-[#DFCBB5] text-[#8E6A22] font-serif font-bold text-base sm:text-lg shrink-0 self-start">
                  {m.year}
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#221914]">{m.title}</h3>
                  <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 6: THE 2-YEAR WARRANTY GUARANTEE (#warranty)     */}
        {/* ======================================================== */}
        <div id="warranty" className="scroll-mt-24 rounded-3xl bg-[#221914] text-white p-8 sm:p-12 shadow-2xl border border-stone-800 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#B88E3A]/20 border border-[#B88E3A]/40 text-[#E8C882] text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#E8C882]" />
                <span>730-DAY PEACE OF MIND</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-white leading-tight">
                The 2-Year Ironclad Anti-Tarnish Guarantee
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Most jewelry brands offer a 14 or 30-day return policy because they know electroplated brass begins to discolor immediately. We back our jewelry with a comprehensive 2-Year Color Warranty. If your piece discolors, we replace it with a brand-new item free of charge.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-700 text-center shrink-0 self-center sm:self-auto space-y-1">
              <p className="font-serif text-4xl sm:text-5xl font-light text-[#E8C882]">730</p>
              <p className="text-[11px] font-bold text-white uppercase tracking-widest">Days Guarantee</p>
              <p className="text-[10px] text-stone-400 font-light">Free worldwide replacement</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-800 text-xs text-stone-300 font-light">
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#E8C882] shrink-0 mt-0.5" />
              <span>Covers all discoloration, tarnishing, and green skin reactions.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#E8C882] shrink-0 mt-0.5" />
              <span>No return shipping fees or complex RMA forms required.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#E8C882] shrink-0 mt-0.5" />
              <span>Email support@dreamwear.com with your order number to claim.</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 7: JEWELRY CARE GUIDE (#care)                    */}
        {/* ======================================================== */}
        <div id="care" className="scroll-mt-24 space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#8E6A22] font-bold">LIFESPAN & CARE</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#221914]">
              How To Care For Your 24/7 Jewelry
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A4E] font-light">
              Unlike fragile brass, DREAM WEAR pieces are made to be worn with zero anxiety. Here is how to keep them sparkling for a lifetime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-[#EBE4D8] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#221914]">Water & Exercise</h3>
              <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">
                Shower, swim, and sweat freely. After swimming in salty ocean water or heavily chlorinated public pools, simply rinse your piece under fresh tap water and pat dry with a soft cloth to remove residual salt crystals.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EBE4D8] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#8E6A22] flex items-center justify-center">
                <Sparkle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#221914]">Lotions & Perfumes</h3>
              <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">
                Our atomic PVD gold bond is impervious to cosmetic alcohol, moisturizers, and sunscreens. While it won't tarnish, frequent cosmetic buildup can temporarily mute diamond sparkle — clean with mild dish soap to restore atelier glow.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EBE4D8] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#221914]">Storage & Stacking</h3>
              <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">
                Store in your included DREAM WEAR keepsake microfiber pouch or jewelry tray when not wearing. When layering multiple delicate link chains, fasten clasps to prevent knotting.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 8: MEET OUR ATELIER TEAM                         */}
        {/* ======================================================== */}
        <div className="space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#8E6A22] font-bold">THE ATELIER TEAM</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#221914]">
              The Artisans & Engineers Behind Every Piece
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A4E] font-light">
              Bridging decades of luxury Milanese jewelry design with cutting-edge material physics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-3xl bg-white border border-[#EBE4D8] overflow-hidden shadow-xs hover:border-[#DFCBB5] transition-all space-y-4 p-5 sm:p-6"
              >
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-[#F0EAE0]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#221914]">{member.name}</h3>
                  <p className="text-[11px] font-semibold text-[#8E6A22] uppercase tracking-wider">{member.role}</p>
                </div>
                <p className="text-xs text-[#6B5A4E] font-light leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 9: CRAFTSMANSHIP FAQ ACCORDIONS (#faq)           */}
        {/* ======================================================== */}
        <div id="faq" className="scroll-mt-24 space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#8E6A22] font-bold">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#221914]">
              Everything You Need To Know About Our Craft
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A4E] font-light">
              Clear, transparent answers about our metallurgy, waterproofing, materials, and warranty.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 text-left">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[#EBE4D8] bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-[#FAF7F2] transition-colors"
                  >
                    <span className="font-serif text-sm sm:text-base font-medium text-[#221914]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8E6A22] transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-[13px] text-[#635347] font-light leading-relaxed border-t border-[#F0EAE0] pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 10: BOTTOM CALL TO ACTION                        */}
        {/* ======================================================== */}
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#FAF5EC] via-[#F3ECE1] to-[#EBE0D0] border border-[#DFCBB5] shadow-md text-center max-w-4xl mx-auto space-y-6">
          <Gem className="w-10 h-10 text-[#8E6A22] mx-auto" />
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#8E6A22] font-bold">
              EXPERIENCE ATELIER FREEDOM
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#221914] leading-tight">
              Jewelry You Never Have To Take Off.
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A4E] font-light max-w-xl mx-auto leading-relaxed">
              Explore over 150 shower-safe, anti-tarnish 18K gold designs backed by our 2-Year Color Replacement Guarantee.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#B88E3A] via-[#C5A059] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#8E6A22] text-white text-xs font-semibold uppercase tracking-[0.18em] rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <Link
              to="/shop?category=necklaces"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FAF7F2] text-[#3D312A] border border-[#DFCEB7] text-xs font-semibold uppercase tracking-wider rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <span>Shop Waterproof Necklaces</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
