import React from 'react';

export const SignupIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center p-6 sm:p-10 select-none">
      
      {/* Main Vector Scene: Walker stepping through device screen with globe & delivery parcels */}
      <svg
        viewBox="0 0 540 380"
        className="w-full h-auto max-w-[460px] drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Floor Shadow */}
        <ellipse cx="270" cy="340" rx="210" ry="12" fill="#f1f5f9" />

        {/* 1. TABLET / SCREEN FRAME (Backdrop) */}
        <rect x="70" y="70" width="130" height="230" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="4" />
        <rect x="76" y="76" width="118" height="218" rx="10" fill="#f8fafc" />
        <rect x="110" y="86" width="50" height="4" rx="2" fill="#cbd5e1" />

        {/* 2. WORLD GLOBE ON STAND (Center-Right) */}
        {/* Globe Base & Arm */}
        <path d="M370 290 L400 330 L340 330 Z" fill="#334155" />
        <line x1="370" y1="260" x2="370" y2="300" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
        <path d="M 320 200 A 70 70 0 0 0 370 270 A 70 70 0 0 0 420 200" fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

        {/* Globe Sphere */}
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

        {/* Red Map Location Pin on Globe */}
        <g transform="translate(362, 162)">
          <path
            d="M 12 0 C 5.37 0 0 5.37 0 12 C 0 20 12 32 12 32 C 12 32 24 20 24 12 C 24 5.37 18.63 0 12 0 Z"
            fill="#ef4444"
          />
          <circle cx="12" cy="12" r="5" fill="#ffffff" />
        </g>

        {/* 3. POTTED OFFICE PLANT */}
        <path d="M275 295 L295 295 L290 325 L280 325 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
        {/* Leaves */}
        <path d="M285 295 Q275 270 265 260 Q280 275 285 295" fill="#93c5fd" />
        <path d="M285 295 Q295 265 305 255 Q295 275 285 295" fill="#60a5fa" />
        <path d="M285 295 Q285 255 285 240 Q290 265 285 295" fill="#3b82f6" />

        {/* 4. DELIVERY RUNNER STEPPING THROUGH SCREEN */}
        {/* Legs / Walking Stride */}
        <path d="M125 215 L110 295 L95 300" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M135 215 L160 285 L180 295" stroke="#334155" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        {/* Shoes */}
        <path d="M90 295 L105 295 C110 295 112 302 108 305 L90 305 Z" fill="#ea580c" />
        <path d="M175 290 L195 295 C198 297 196 304 190 304 L172 298 Z" fill="#ea580c" />

        {/* Torso / Blue Courier Jacket */}
        <path d="M115 140 L155 145 L145 220 L115 215 Z" fill="#2563eb" rx="6" />

        {/* Head & Cap */}
        <circle cx="132" cy="115" r="14" fill="#fed7aa" />
        <path d="M122 108 C122 100, 142 100, 145 106 L155 108 L142 114 Z" fill="#ea580c" />

        {/* Arm Holding Delivery Parcel Box */}
        <path d="M140 155 L165 170 L185 160" stroke="#2563eb" strokeWidth="9" strokeLinecap="round" />
        
        {/* Parcel Held by Runner */}
        <g transform="translate(168, 148) rotate(-8)">
          <rect width="36" height="28" rx="3" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
          <line x1="18" y1="0" x2="18" y2="28" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="0" y1="14" x2="36" y2="14" stroke="#ffffff" strokeWidth="2.5" />
        </g>

        {/* 5. STACKED PARCEL BOXES (Right side) */}
        {/* Bottom Orange Box */}
        <rect x="420" y="275" width="48" height="36" rx="4" fill="#ea580c" />
        <line x1="444" y1="275" x2="444" y2="311" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
        <line x1="420" y1="293" x2="468" y2="293" stroke="#ffffff" strokeWidth="2" opacity="0.8" />

        {/* Top Blue Box */}
        <rect x="426" y="245" width="40" height="30" rx="3" fill="#2563eb" />
        <line x1="446" y1="245" x2="446" y2="275" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
        <line x1="426" y1="260" x2="466" y2="260" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
      </svg>

      {/* "Trusted by businesses from" Brand Logos Strip */}
      <div className="mt-8 text-center w-full">
        <p className="text-xs font-bold text-slate-900 tracking-tight mb-5">
          Trusted by businesses from
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
          <span className="font-extrabold text-slate-800 text-sm tracking-tight">Raine&amp;Horne.</span>
          <span className="font-bold text-slate-900 text-sm tracking-tighter">McGrath</span>
          <span className="font-extrabold text-slate-800 text-xs tracking-tight">snap fitness <span className="text-[10px] text-red-600 font-black">24/7</span></span>
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
