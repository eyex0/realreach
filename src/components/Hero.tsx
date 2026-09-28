import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import HeroMotionMap from './HeroMotionMap';

interface HeroProps {
  onOpenOrder: () => void;
  onScrollToHowItWorks?: () => void;
}

const ROTATING_PHRASES = [
  'On demand.',
  'With live GPS tracking.',
  'With measurable results.',
  'With simplicity.',
  'All in one place.',
];

const TRUSTED_AGENCIES = [
  'Engel & Völkers Milano',
  'Tecnocasa',
  'Gabetti',
  'Remax Italia',
  'Tempocasa',
  'Sotheby’s Italy',
  'Coldwell Banker',
  'Century 21',
];

const AGENT_AVATARS = [
  'https://realrun.com.au/assets/agent-profile-1-BboLlo2i.jpg',
  'https://realrun.com.au/assets/agent-profile-2-BzwzTikn.jpg',
  'https://realrun.com.au/assets/agent-profile-3-D3Pced-O.jpg',
  'https://realrun.com.au/assets/agent-profile-4-DRWoz9WD.jpg',
];

export const Hero: React.FC<HeroProps> = ({ onOpenOrder }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* PAGE 1: HERO TITLE & SUBTITLE */}
      <section
        className="relative overflow-hidden bg-white pt-14 sm:pt-20 md:pt-24 pb-8 sm:pb-12 text-center"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          
          {/* Main Headline from PDF Page 1 */}
          <h1
            id="hero-heading"
            className="font-bold text-[#0a0a0b] leading-[1.08] tracking-[-0.035em] text-[clamp(2.2rem,6vw,4rem)]"
          >
            <span className="block">Letterbox distribution</span>
            <span className="block relative overflow-hidden h-[1.25em] mt-1">
              <span
                key={phraseIndex}
                className="block text-[#6b7280] font-bold transition-all duration-500 animate-fadeIn"
              >
                {ROTATING_PHRASES[phraseIndex]}
              </span>
            </span>
          </h1>

          {/* Subtitle from PDF Page 1 */}
          <p className="mt-5 sm:mt-6 text-[#4b5563] text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Create campaigns, book verified walkers, track every run live.
          </p>
        </div>

        {/* PAGE 2: MAPPA GIUSTA CON IL MOTION (Right Map with Motion) */}
        <div className="relative mt-6 sm:mt-10 max-w-[1020px] mx-auto px-4">
          
          {/* Live Motion 3D Perspective Map */}
          <HeroMotionMap onOpenOrder={onOpenOrder} />

          {/* "Get instant pricing →" Black Pill Button (Page 2) */}
          <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={onOpenOrder}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-8 sm:px-12 py-3.5 text-base font-semibold hover:bg-neutral-800 transition-all shadow-md cursor-pointer hover:scale-102"
            >
              <span>Get instant pricing</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* "Join 2,500+ Businesses across Milan & Italy" (Page 2) */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {AGENT_AVATARS.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt="Agent"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  loading="lazy"
                />
              ))}
            </div>
            <p className="text-sm font-medium text-[#6b7280]">
              Join 2,500+ Businesses across Milan &amp; Italy
            </p>
          </div>
        </div>
      </section>

      {/* PAGE 3: BRAND MARQUEE */}
      <section
        aria-label="Trusted real estate agencies in Italy"
        className="bg-white py-6 border-b border-[var(--color-border)] overflow-hidden"
      >
        <div
          className="group relative mx-auto w-full max-w-[1400px] overflow-hidden px-4"
          aria-hidden="true"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)',
          }}
        >
          <div className="flex w-max gap-12 md:gap-16 animate-marquee">
            {[...TRUSTED_AGENCIES, ...TRUSTED_AGENCIES, ...TRUSTED_AGENCIES].map(
              (agency, i) => (
                <span
                  key={`${agency}-${i}`}
                  className="text-base sm:text-lg font-semibold text-[#0a0a0b] opacity-40 hover:opacity-90 whitespace-nowrap select-none transition-opacity"
                >
                  {agency}
                </span>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
};
export default Hero;
