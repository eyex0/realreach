import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  Search,
  Compass,
  Zap,
  TrendingUp,
  Maximize2
} from 'lucide-react';
import { RealReachLogo } from './RealReachLogo';

interface HeroMotionMapProps {
  onOpenOrder: () => void;
}

interface MilanWaypoint {
  x: number; // percentage in SVG coordinate space (0-1000)
  y: number; // percentage in SVG coordinate space (0-600)
  street: string;
  zone: string;
  angle: number;
}

// Milan Key Street Network Waypoints (Realistic path through Milan Centro, Duomo, Brera, Quadrilatero, Navigli)
const MILAN_ROUTE: MilanWaypoint[] = [
  { x: 500, y: 310, street: 'Piazza del Duomo', zone: 'Centro Storico', angle: 45 },
  { x: 520, y: 285, street: 'Galleria Vittorio Emanuele II', zone: 'Centro Storico', angle: 30 },
  { x: 545, y: 260, street: 'Piazza della Scala', zone: 'Centro Storico', angle: 40 },
  { x: 580, y: 230, street: 'Via Manzoni', zone: 'Quadrilatero', angle: 45 },
  { x: 625, y: 195, street: 'Via Monte Napoleone 8', zone: 'Quadrilatero della Moda', angle: 55 },
  { x: 655, y: 215, street: 'Via Sant’Andrea', zone: 'Quadrilatero della Moda', angle: 135 },
  { x: 615, y: 245, street: 'Via della Spiga', zone: 'Quadrilatero della Moda', angle: 225 },
  { x: 540, y: 215, street: 'Via Brera (Accademia)', zone: 'Brera', angle: 315 },
  { x: 505, y: 190, street: 'Via Fiori Chiari', zone: 'Brera', angle: 290 },
  { x: 460, y: 210, street: 'Via Ponte Vetero', zone: 'Brera', angle: 210 },
  { x: 420, y: 240, street: 'Castello Sforzesco (Piazza Castello)', zone: 'Castello', angle: 230 },
  { x: 450, y: 275, street: 'Via Dante', zone: 'Centro Storico', angle: 135 },
  { x: 480, y: 295, street: 'Piazza Cordusio', zone: 'Centro Storico', angle: 120 },
  { x: 465, y: 345, street: 'Via Torino', zone: 'Centro Storico', angle: 195 },
  { x: 435, y: 395, street: 'Corso di Porta Ticinese', zone: 'Porta Ticinese', angle: 210 },
  { x: 390, y: 440, street: 'Colonne di San Lorenzo', zone: 'Ticinese', angle: 215 },
  { x: 345, y: 485, street: 'Darsena / Piazza XXIV Maggio', zone: 'Navigli', angle: 230 },
  { x: 290, y: 505, street: 'Ripa di Porta Ticinese (Naviglio Grande)', zone: 'Navigli', angle: 240 },
  { x: 315, y: 470, street: 'Alzaia Naviglio Pavese', zone: 'Navigli', angle: 60 },
  { x: 375, y: 420, street: 'Via Molino delle Armi (Cerchia)', zone: 'Centro Storico', angle: 50 },
  { x: 430, y: 360, street: 'Piazza Missori', zone: 'Centro Storico', angle: 45 },
  { x: 480, y: 325, street: 'Corso Vittorio Emanuele II', zone: 'Centro Storico', angle: 35 },
];

const MILAN_DISTRICTS = [
  {
    id: 'centro',
    name: 'Milano Centro & Duomo',
    cap: '20121 / 20123',
    mailboxes: 8500,
    delivered: 6840,
    rate: '€0.12/drop',
    color: '#2563eb',
    accent: 'bg-blue-600',
    polygon: 'M 440 230 L 580 210 L 610 320 L 490 370 L 430 310 Z',
  },
  {
    id: 'brera',
    name: 'Brera & Quadrilatero',
    cap: '20121 Milano',
    mailboxes: 5200,
    delivered: 4190,
    rate: '€0.14/drop',
    color: '#059669',
    accent: 'bg-emerald-600',
    polygon: 'M 470 170 L 660 160 L 690 260 L 530 250 Z',
  },
  {
    id: 'navigli',
    name: 'Navigli & Ticinese',
    cap: '20123 / 20144',
    mailboxes: 9400,
    delivered: 7850,
    rate: '€0.12/drop',
    color: '#7c3aed',
    accent: 'bg-purple-600',
    polygon: 'M 250 450 L 410 400 L 450 490 L 300 560 Z',
  },
  {
    id: 'portanuova',
    name: 'Porta Nuova & Isola',
    cap: '20124 Milano',
    mailboxes: 7800,
    delivered: 5920,
    rate: '€0.13/drop',
    color: '#0284c7',
    accent: 'bg-sky-600',
    polygon: 'M 540 80 L 720 90 L 680 180 L 510 160 Z',
  },
];

export const HeroMotionMap: React.FC<HeroMotionMapProps> = ({ onOpenOrder }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 4>(1);
  const [selectedDistrict, setSelectedDistrict] = useState(MILAN_DISTRICTS[0]);
  const [deliveredCount, setDeliveredCount] = useState(14842);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ x: number; y: number }>>([]);
  const [recentDropAlert, setRecentDropAlert] = useState<string | null>(null);

  const waypoint = MILAN_ROUTE[currentIdx];

  // Motion animation loop: moves runner along Milan waypoints
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 1600 / speedMultiplier;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => {
        const next = (prev + 1) % MILAN_ROUTE.length;
        const currentWp = MILAN_ROUTE[next];

        // Add breadcrumb point
        setBreadcrumbs((crumbs) => [...crumbs.slice(-28), { x: currentWp.x, y: currentWp.y }]);

        // Ticking mailbox deliveries
        const addDrops = Math.floor(Math.random() * 3) + 1;
        setDeliveredCount((c) => c + addDrops);

        // Flash intermittent "+1 Drop" feedback
        if (Math.random() > 0.4) {
          setRecentDropAlert(`+${addDrops} Letterbox: ${currentWp.street}`);
          setTimeout(() => setRecentDropAlert(null), 1200);
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speedMultiplier]);

  // Initial breadcrumbs seed
  useEffect(() => {
    const initial = MILAN_ROUTE.slice(0, 6).map((w) => ({ x: w.x, y: w.y }));
    setBreadcrumbs(initial);
  }, []);

  return (
    <div className="relative w-full max-w-[1040px] mx-auto select-none mt-4 sm:mt-6">
      
      {/* 3D Floating Perspective Frame with Motion */}
      <div 
        className={`relative transition-all duration-700 ease-out ${
          is3DMode ? 'transform-gpu md:[perspective:1200px]' : ''
        }`}
      >
        <div 
          className={`relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-2xl transition-transform duration-700 ${
            is3DMode ? 'md:[transform:rotateX(6deg)_scale(0.99)] md:hover:[transform:rotateX(2deg)_scale(1)]' : ''
          }`}
        >

          {/* 1. TOP BROWSER / SAAS NAVIGATION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50/90 backdrop-blur-md">
            
            {/* Search Milan Address / Zone Input */}
            <div className="flex items-center gap-2.5 flex-1 max-w-md bg-white border border-slate-300/80 rounded-xl px-3 py-1.5 shadow-2xs">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                readOnly
                value="Milano, 20121 - Centro Storico & Navigli"
                aria-label="Active Milan Campaign Area"
                className="w-full text-xs sm:text-sm font-medium text-slate-800 bg-transparent focus:outline-none cursor-default"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 shrink-0">
                ACTIVE MILAN
              </span>
            </div>

            {/* Live Telemetry Ping & Mode Toggles */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Telemetry Status Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="hidden sm:inline">REALREACH Live Telemetry</span>
                <span className="sm:hidden">LIVE GPS</span>
              </div>

              {/* 3D vs Flat View Toggle */}
              <button
                type="button"
                onClick={() => setIs3DMode(!is3DMode)}
                className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1 hover:text-black hover:border-slate-300 transition-colors cursor-pointer"
                title="Toggle 3D Perspective"
              >
                <Layers className="h-3 w-3" />
                <span>{is3DMode ? '3D View' : 'Flat Map'}</span>
              </button>
            </div>

          </div>

          {/* 2. MAIN MAP CANVAS AREA */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.2] bg-[#f8fafc] overflow-hidden">
            
            {/* SVG Base Vector Map of Milan */}
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-full object-cover select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Subtle map pattern */}
                <pattern id="urbanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.6" />
                </pattern>
                
                {/* Radial Glow Gradient */}
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>

                {/* Delivery Zone Fill Pattern */}
                <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#3b82f6" strokeWidth="1.5" opacity="0.15" />
                </pattern>
              </defs>

              {/* Background Grid */}
              <rect width="1000" height="600" fill="#f8fafc" />
              <rect width="1000" height="600" fill="url(#urbanGrid)" />
              <circle cx="500" cy="300" r="320" fill="url(#centerGlow)" />

              {/* WATERWAY: Naviglio Grande & Darsena canal in Milan */}
              <path
                d="M 120 590 Q 240 520 330 490 Q 380 480 410 495 T 480 540"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="16"
                strokeLinecap="round"
                className="opacity-70"
              />
              <path
                d="M 120 590 Q 240 520 330 490 Q 380 480 410 495 T 480 540"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <text x="210" y="545" fill="#3b82f6" fontSize="11" fontWeight="700" letterSpacing="1" className="select-none">
                NAVIGLIO GRANDE
              </text>
              <text x="350" y="475" fill="#2563eb" fontSize="10" fontWeight="700" className="select-none">
                DARSENA MILANO
              </text>

              {/* GREEN PARKS: Parco Sempione & Giardini Pubblici Montanelli */}
              {/* Parco Sempione */}
              <path
                d="M 360 130 C 400 110, 470 140, 460 210 C 420 220, 370 200, 360 130 Z"
                fill="#dcfce7"
                stroke="#86efac"
                strokeWidth="2"
              />
              <text x="395" y="165" fill="#15803d" fontSize="10" fontWeight="700" className="select-none">
                PARCO SEMPIONE
              </text>

              {/* Giardini Pubblici Indro Montanelli */}
              <path
                d="M 680 180 C 720 160, 780 190, 770 240 C 730 250, 690 230, 680 180 Z"
                fill="#dcfce7"
                stroke="#86efac"
                strokeWidth="2"
              />
              <text x="700" y="215" fill="#15803d" fontSize="9" fontWeight="700" className="select-none">
                GIARDINI PUBBLICI
              </text>

              {/* MILAN CONCENTRIC RINGS (Cerchia dei Navigli & Bastioni) */}
              <ellipse
                cx="500"
                cy="300"
                rx="230"
                ry="170"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="3.5"
                strokeDasharray="6 6"
              />
              <text x="500" y="125" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="2">
                CERCHIA DEI BASTIONI &bull; MILANO
              </text>

              {/* Inner Ring: Cerchia dei Navigli */}
              <ellipse
                cx="500"
                cy="295"
                rx="145"
                ry="105"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* MAJOR RADIAL ARTERIES / STREETS IN MILAN */}
              {/* 1. Corso Vittorio Emanuele & Corso Buenos Aires */}
              <line x1="500" y1="300" x2="820" y2="180" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
              <line x1="500" y1="300" x2="820" y2="180" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
              <text x="710" y="200" fill="#64748b" fontSize="9" fontWeight="600" transform="rotate(-18 710 200)">
                Corso Buenos Aires &rarr;
              </text>

              {/* 2. Via Dante to Castello Sforzesco */}
              <line x1="500" y1="300" x2="410" y2="230" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
              <line x1="500" y1="300" x2="410" y2="230" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              <text x="430" y="270" fill="#64748b" fontSize="9" fontWeight="600" transform="rotate(38 430 270)">
                Via Dante
              </text>

              {/* 3. Via Manzoni & Via Monte Napoleone */}
              <line x1="500" y1="300" x2="640" y2="190" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
              <line x1="500" y1="300" x2="640" y2="190" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <text x="585" y="225" fill="#0f172a" fontSize="10" fontWeight="700" transform="rotate(-38 585 225)">
                Via Monte Napoleone
              </text>

              {/* 4. Via Torino to Corso di Porta Ticinese */}
              <line x1="500" y1="300" x2="340" y2="480" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
              <line x1="500" y1="300" x2="340" y2="480" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              <text x="400" y="405" fill="#64748b" fontSize="9" fontWeight="600" transform="rotate(48 400 405)">
                Corso di Porta Ticinese
              </text>

              {/* 5. Corso di Porta Romana */}
              <line x1="500" y1="300" x2="670" y2="490" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
              <line x1="500" y1="300" x2="670" y2="490" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <text x="560" y="390" fill="#64748b" fontSize="9" fontWeight="600" transform="rotate(45 560 390)">
                Corso di Porta Romana &rarr;
              </text>

              {/* 6. Via Brera */}
              <line x1="520" y1="260" x2="520" y2="160" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="520" y1="260" x2="520" y2="160" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <text x="510" y="200" fill="#0f172a" fontSize="9" fontWeight="700" transform="rotate(-90 510 200)">
                Via Brera
              </text>

              {/* 7. Porta Nuova cluster to Gae Aulenti */}
              <line x1="550" y1="180" x2="620" y2="70" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
              <line x1="550" y1="180" x2="620" y2="70" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              <text x="615" y="110" fill="#0284c7" fontSize="10" fontWeight="700">
                Piazza Gae Aulenti / Porta Nuova
              </text>

              {/* ACTIVE DELIVERY POLYGONS (SELECTED AUDIENCE ZONES) */}
              {MILAN_DISTRICTS.map((dist) => {
                const isSelected = selectedDistrict.id === dist.id;
                return (
                  <g key={dist.id} className="cursor-pointer transition-opacity duration-300">
                    <path
                      d={dist.polygon}
                      fill={dist.color}
                      fillOpacity={isSelected ? '0.22' : '0.08'}
                      stroke={dist.color}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      strokeDasharray={isSelected ? 'none' : '4 4'}
                      onClick={() => setSelectedDistrict(dist)}
                    />
                  </g>
                );
              })}

              {/* MILAN LANDMARK PINS */}
              {/* Duomo di Milano */}
              <g transform="translate(500, 300)">
                <circle r="12" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
                <circle r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                <rect x="-32" y="-28" width="64" height="18" rx="4" fill="#0a0a0b" />
                <text x="0" y="-16" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">
                  DUOMO
                </text>
              </g>

              {/* Castello Sforzesco */}
              <g transform="translate(410, 230)">
                <circle r="5" fill="#475569" stroke="#ffffff" strokeWidth="1.5" />
                <text x="-4" y="-10" fill="#334155" fontSize="8" fontWeight="700">
                  Castello Sforzesco
                </text>
              </g>

              {/* Galleria Vittorio Emanuele II */}
              <g transform="translate(525, 275)">
                <circle r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="8" y="4" fill="#92400e" fontSize="8" fontWeight="700">
                  Galleria Vitt. Emanuele
                </text>
              </g>

              {/* LIVE BREADCRUMB TRAIL (GPS Walked Path in Milan) */}
              {breadcrumbs.length > 1 && (
                <path
                  d={breadcrumbs.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-80"
                />
              )}

              {/* Milestone Dots along the route */}
              {breadcrumbs.map((crumb, idx) => (
                <circle
                  key={idx}
                  cx={crumb.x}
                  cy={crumb.y}
                  r={idx === breadcrumbs.length - 1 ? 0 : 2.5}
                  fill="#059669"
                  opacity={0.7}
                />
              ))}

              {/* LIVE MOVING RUNNER WITH COMPASS & MOTION (MARCO V. #18) */}
              <g
                transform={`translate(${waypoint.x}, ${waypoint.y})`}
                className="transition-all duration-700 ease-out cursor-pointer"
                onClick={() => setShowPhotoModal(true)}
              >
                {/* Concentric Radar Pulsing Rings */}
                <circle r="26" fill="#10b981" fillOpacity="0.15" className="animate-ping" />
                <circle r="16" fill="#10b981" fillOpacity="0.3" />
                
                {/* Main GPS Dot */}
                <circle r="8" fill="#0a0a0b" stroke="#ffffff" strokeWidth="2.5" className="shadow-lg" />
                
                {/* Direction Heading Pointer */}
                <path
                  d="M 0 -11 L 4 -4 L -4 -4 Z"
                  fill="#10b981"
                  transform={`rotate(${waypoint.angle})`}
                />

                {/* Floating Live Telemetry Tooltip on Runner */}
                <g transform="translate(0, -22)">
                  <rect
                    x="-90"
                    y="-28"
                    width="180"
                    height="28"
                    rx="8"
                    fill="#0a0a0b"
                    stroke="#334155"
                    strokeWidth="1"
                    className="shadow-xl"
                  />
                  <circle cx="-74" cy="-14" r="3.5" fill="#10b981" className="animate-pulse" />
                  <text x="-64" y="-18" fill="#ffffff" fontSize="9" fontWeight="700">
                    Marco V. (Runner #18)
                  </text>
                  <text x="-64" y="-7" fill="#94a3b8" fontSize="8" fontWeight="500">
                    {waypoint.street}
                  </text>
                  <text x="74" y="-12" fill="#10b981" fontSize="8" fontWeight="700" textAnchor="end">
                    4.3 km/h
                  </text>
                </g>
              </g>

            </svg>

            {/* 3. FLOATING AUDIENCE CARD (MATCHING PDF PAGE 2 REALREACH DESIGN) */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 max-w-[270px] sm:max-w-[310px] w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${selectedDistrict.accent}`} />
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {selectedDistrict.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {selectedDistrict.cap}
                </span>
              </div>

              {/* Mailbox Volume & Stats */}
              <div className="mt-3.5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Audience Letterboxes</span>
                  <span className="text-base sm:text-lg font-extrabold text-[#0a0a0b]">
                    {selectedDistrict.mailboxes.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Progress Delivered</span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    {deliveredCount.toLocaleString()} drops
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (deliveredCount / 18500) * 100)}%` }} 
                  />
                </div>
              </div>

              {/* Walker & Instant Book Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-600">
                  Rate: <strong className="text-slate-900 font-bold">{selectedDistrict.rate}</strong>
                </div>

                <button
                  type="button"
                  onClick={onOpenOrder}
                  className="rounded-xl bg-[#0a0a0b] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                >
                  Book Zone
                </button>
              </div>

            </div>

            {/* 4. FLOATING TOP-RIGHT LIVE TELEMETRY BADGE */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex flex-col items-end gap-2">
              <div className="bg-slate-950/90 text-white backdrop-blur-md rounded-xl px-3 py-2 border border-slate-800 shadow-xl flex items-center gap-2.5">
                <Navigation className="h-4 w-4 text-emerald-400 rotate-45" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Current Milan Street
                  </div>
                  <div className="text-xs font-bold text-white">
                    {waypoint.street}
                  </div>
                </div>
              </div>

              {/* "+1 Drop" Transient Alert */}
              {recentDropAlert && (
                <div className="bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-lg animate-bounce flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{recentDropAlert}</span>
                </div>
              )}
            </div>

            {/* 5. BOTTOM INTERACTIVE MOTION CONTROLS */}
            <div className="absolute bottom-3 sm:bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2.5 shadow-lg">
              
              {/* Play / Pause & Speed Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isPlaying 
                      ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' 
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                  title={isPlaying ? 'Pause Motion Simulation' : 'Play Live Motion'}
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                  <span className="hidden sm:inline">{isPlaying ? 'Pause Motion' : 'Play Motion'}</span>
                </button>

                {/* Speed Multiplier */}
                <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-[11px] font-bold">
                  {([1, 2, 4] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeedMultiplier(s)}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        speedMultiplier === s ? 'bg-white text-black shadow-2xs' : 'text-slate-500 hover:text-black'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Milan Zone Switcher Chips */}
              <div className="hidden lg:flex items-center gap-1.5">
                {MILAN_DISTRICTS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDistrict(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedDistrict.id === d.id
                        ? 'bg-[#0a0a0b] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {d.name.split('&')[0]}
                  </button>
                ))}
              </div>

              {/* View Verified Photo Proof Button */}
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5 text-blue-600" />
                <span>Photo Proof</span>
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* PHOTO PROOF MODAL (Milan Delivery Drop Verification) */}
      {showPhotoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowPhotoModal(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-left animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RealReachLogo size={20} color="#0a0a0b" />
                <h3 className="font-bold text-sm text-[#0a0a0b]">GPS Photo Verification &bull; Milano</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="text-slate-400 hover:text-black font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="mt-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80"
                  alt="Verified letterbox drop in Milan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs rounded-lg px-2.5 py-1.5 text-[11px] text-white flex items-center justify-between">
                  <span>GPS: 45.4678° N, 9.1965° E</span>
                  <span className="text-emerald-400 font-bold">&check; Mailbox Confirmed</span>
                </div>
              </div>

              <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                <p><strong>Street Address:</strong> {waypoint.street}, 20121 Milano (MI)</p>
                <p><strong>Distributor:</strong> Marco V. (REALREACH Runner #18)</p>
                <p><strong>Time Stamp:</strong> {new Date().toLocaleTimeString('it-IT')} &bull; Verified Walk</p>
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#0a0a0b] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Close Audit Proof
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HeroMotionMap;
