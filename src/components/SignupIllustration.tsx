import React from 'react';

/**
 * The sign-in / sign-up scene.
 *
 * The walker is animated deliberately: a still figure on a login screen reads
 * as a stock image, and a walking one says "this product is in motion". Motion
 * is CSS on the SVG groups (not JS), so it costs nothing on a low-end phone and
 * is disabled wholesale for anyone who asks for reduced motion.
 */
export const SignupIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center p-6 sm:p-10 select-none">
      <style>{`
        @keyframes rr-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes rr-leg-a {
          0%, 100% { transform: rotate(4deg); }
          50%      { transform: rotate(-7deg); }
        }
        @keyframes rr-leg-b {
          0%, 100% { transform: rotate(-6deg); }
          50%      { transform: rotate(6deg); }
        }
        @keyframes rr-arm {
          0%, 100% { transform: rotate(3deg); }
          50%      { transform: rotate(-4deg); }
        }
        @keyframes rr-parcel {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-2px) rotate(3deg); }
        }
        @keyframes rr-pin {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.12); }
        }
        @keyframes rr-shadow {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50%      { transform: scaleX(0.9); opacity: 0.75; }
        }
        @keyframes rr-stack {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(1.5px); }
        }
        .rr-bob   { animation: rr-bob 1.6s ease-in-out infinite; transform-box: view-box; transform-origin: 130px 250px; }
        .rr-leg-a { animation: rr-leg-a 1.6s ease-in-out infinite; transform-box: view-box; transform-origin: 125px 215px; }
        .rr-leg-b { animation: rr-leg-b 1.6s ease-in-out infinite; transform-box: view-box; transform-origin: 135px 215px; }
        .rr-arm   { animation: rr-arm 1.6s ease-in-out infinite; transform-box: view-box; transform-origin: 140px 155px; }
        .rr-parcel{ animation: rr-parcel 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .rr-pin   { animation: rr-pin 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; }
        .rr-shadow{ animation: rr-shadow 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .rr-stack { animation: rr-stack 3.2s ease-in-out infinite; transform-box: view-box; transform-origin: 444px 311px; }
        @media (prefers-reduced-motion: reduce) {
          .rr-bob, .rr-leg-a, .rr-leg-b, .rr-arm, .rr-parcel, .rr-pin, .rr-shadow, .rr-stack {
            animation: none;
          }
        }
      `}</style>

      {/* Main Vector Scene: Walker stepping through device screen with globe & delivery parcels */}
      <svg
        viewBox="0 0 540 380"
        className="w-full h-auto max-w-[460px] drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A courier stepping out of a phone, carrying a parcel, next to a globe marked with a delivery pin"
      >
        {/* Floor Shadow — contracts as the walker "steps" */}
        <ellipse className="rr-shadow" cx="270" cy="340" rx="210" ry="12" fill="#f1f5f9" />

        {/* 1. TABLET / SCREEN FRAME (Backdrop) */}
        <rect x="70" y="70" width="130" height="230" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="4" />
        <rect x="76" y="76" width="118" height="218" rx="10" fill="#f8fafc" />
        <rect x="110" y="86" width="50" height="4" rx="2" fill="#cbd5e1" />

        {/* 2. WORLD GLOBE ON STAND (Center-Right) */}
        <path d="M370 290 L400 330 L340 330 Z" fill="#334155" />
        <line x1="370" y1="260" x2="370" y2="300" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
        <path d="M 320 200 A 70 70 0 0 0 370 270 A 70 70 0 0 0 420 200" fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

        <circle cx="370" cy="180" r="62" fill="#60a5fa" />

        {/* Continents (Europe & Mediterranean / Italy) */}
        <path
          d="M340 160 C345 150, 360 145, 370 150 C380 155, 395 150, 400 165 C405 175, 395 190, 385 195 C375 200, 360 215, 350 205 C340 195, 335 175, 340 160 Z"
          fill="#ffffff"
          opacity="0.9"
        />
        <path
          d="M365 210 C370 220, 385 225, 395 215 C400 205, 410 200, 415 190 C420 210, 400 230, 380 235 C370 230, 360 220, 365 210 Z"
          fill="#ffffff"
          opacity="0.9"
        />

        {/* Red Map Location Pin on Globe — pulses like a live delivery marker */}
        <g transform="translate(362, 162)">
          <g className="rr-pin">
            <path
              d="M 12 0 C 5.37 0 0 5.37 0 12 C 0 20 12 32 12 32 C 12 32 24 20 24 12 C 24 5.37 18.63 0 12 0 Z"
              fill="#ef4444"
            />
            <circle cx="12" cy="12" r="5" fill="#ffffff" />
          </g>
        </g>

        {/* 3. POTTED OFFICE PLANT */}
        <path d="M275 295 L295 295 L290 325 L280 325 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M285 295 Q275 270 265 260 Q280 275 285 295" fill="#93c5fd" />
        <path d="M285 295 Q295 265 305 255 Q295 275 285 295" fill="#60a5fa" />
        <path d="M285 295 Q285 255 285 240 Q290 265 285 295" fill="#3b82f6" />

        {/* 4. DELIVERY RUNNER STEPPING THROUGH SCREEN */}
        <g className="rr-bob">
          {/* Legs / Walking Stride — counter-swinging around the hips */}
          <g className="rr-leg-a">
            <path d="M125 215 L110 295 L95 300" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M90 295 L105 295 C110 295 112 302 108 305 L90 305 Z" fill="#ea580c" />
          </g>
          <g className="rr-leg-b">
            <path d="M135 215 L160 285 L180 295" stroke="#334155" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M175 290 L195 295 C198 297 196 304 190 304 L172 298 Z" fill="#ea580c" />
          </g>

          {/* Torso / Blue Courier Jacket */}
          <path d="M115 140 L155 145 L145 220 L115 215 Z" fill="#2563eb" />

          {/* Head & Cap */}
          <circle cx="132" cy="115" r="14" fill="#fed7aa" />
          <path d="M122 108 C122 100, 142 100, 145 106 L155 108 L142 114 Z" fill="#ea580c" />

          {/* Arm Holding Delivery Parcel Box — swings opposite the legs */}
          <g className="rr-arm">
            <path d="M140 155 L165 170 L185 160" stroke="#2563eb" strokeWidth="9" strokeLinecap="round" />
          </g>

          {/* Parcel Held by Runner.
              The positioning transform stays on the outer group: a CSS
              transform on the same element would replace it and drop the
              parcel into the corner of the viewBox. */}
          <g transform="translate(168, 148) rotate(-8)">
            <g className="rr-parcel">
              <rect width="36" height="28" rx="3" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
              <line x1="18" y1="0" x2="18" y2="28" stroke="#ffffff" strokeWidth="2.5" />
              <line x1="0" y1="14" x2="36" y2="14" stroke="#ffffff" strokeWidth="2.5" />
            </g>
          </g>
        </g>

        {/* 5. STACKED PARCEL BOXES (Right side) — a slow settle, well out of phase */}
        <g className="rr-stack">
          <rect x="420" y="275" width="48" height="36" rx="4" fill="#ea580c" />
          <line x1="444" y1="275" x2="444" y2="311" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
          <line x1="420" y1="293" x2="468" y2="293" stroke="#ffffff" strokeWidth="2" opacity="0.8" />

          <rect x="426" y="245" width="40" height="30" rx="3" fill="#2563eb" />
          <line x1="446" y1="245" x2="446" y2="275" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
          <line x1="426" y1="260" x2="466" y2="260" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
        </g>
      </svg>

      {/* "Trusted by businesses from" Brand Logos Strip */}
      <div className="mt-8 text-center w-full">
        <p className="text-xs font-bold text-slate-900 tracking-tight mb-5">
          Trusted by businesses from
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
          <span className="font-extrabold text-slate-800 text-sm tracking-tight">Raine&amp;Horne.</span>
          <span className="font-bold text-slate-900 text-sm tracking-tighter">McGrath</span>
          <span className="font-extrabold text-slate-800 text-xs tracking-tight">
            snap fitness <span className="text-[10px] text-red-600 font-black">24/7</span>
          </span>
          <span className="font-bold text-slate-700 text-xs tracking-tight">choicepharmacy</span>
          <div className="h-6 w-6 rounded-full border-2 border-slate-700 flex items-center justify-center font-bold text-[9px] text-slate-800">
            PB
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupIllustration;
