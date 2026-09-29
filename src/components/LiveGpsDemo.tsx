import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Camera, 
  Navigation, 
  BatteryMedium, 
  Wifi, 
  Maximize2,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';
import RealReachLogo from './RealReachLogo';

interface SuburbData {
  id: string;
  name: string;
  state: string;
  agency: string;
  targetCount: number;
  deliveredCount: number;
  runners: number;
  duration: string;
  streetCount: number;
  coords: string;
}

const MILAN_ZONES: SuburbData[] = [
  {
    id: 'duomo-brera',
    name: 'Milano Centro: Duomo & Brera',
    state: '20121 Milano (MI)',
    agency: 'Engel & Völkers Milano',
    targetCount: 8500,
    deliveredCount: 6842,
    runners: 3,
    duration: '3h 45m elapsed',
    streetCount: 48,
    coords: '45.4642° N, 9.1900° E',
  },
  {
    id: 'navigli',
    name: 'Milano Navigli & Porta Ticinese',
    state: '20123 Milano (MI)',
    agency: 'Tecnocasa Milano Centro Storico',
    targetCount: 10000,
    deliveredCount: 9410,
    runners: 4,
    duration: '5h 10m elapsed',
    streetCount: 62,
    coords: '45.4520° N, 9.1764° E',
  },
  {
    id: 'porta-nuova',
    name: 'Porta Nuova & Isola (Gae Aulenti)',
    state: '20124 Milano (MI)',
    agency: 'Gabetti Milano Nord',
    targetCount: 7500,
    deliveredCount: 5200,
    runners: 2,
    duration: '2h 50m elapsed',
    streetCount: 39,
    coords: '45.4842° N, 9.1904° E',
  },
  {
    id: 'citylife',
    name: 'CityLife & Tre Torri (Amendola)',
    state: '20145 Milano (MI)',
    agency: 'Sotheby’s International Realty Italy',
    targetCount: 6800,
    deliveredCount: 4950,
    runners: 2,
    duration: '2h 15m elapsed',
    streetCount: 34,
    coords: '45.4770° N, 9.1558° E',
  },
];

export const LiveGpsDemo: React.FC = () => {
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbData>(MILAN_ZONES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [currentDelivered, setCurrentDelivered] = useState<number>(MILAN_ZONES[0].deliveredCount);
  const [runnerPosition, setRunnerPosition] = useState<{ x: number; y: number }>({ x: 380, y: 220 });
  const [pathPoints, setPathPoints] = useState<Array<{ x: number; y: number }>>([
    { x: 120, y: 140 },
    { x: 210, y: 140 },
    { x: 210, y: 220 },
    { x: 310, y: 220 },
    { x: 380, y: 220 },
  ]);
  const [selectedPin, setSelectedPin] = useState<{
    street: string;
    time: string;
    status: string;
    flyer: string;
  } | null>(null);
  const [mapMode, setMapMode] = useState<'streets' | 'satellite' | 'heatmap'>('streets');

  // Handle zone change
  const handleZoneChange = (zone: SuburbData) => {
    setSelectedSuburb(zone);
    setCurrentDelivered(zone.deliveredCount);
    setSelectedPin(null);
  };

  // Simulation loop with active motion
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentDelivered((prev) => {
        if (prev >= selectedSuburb.targetCount) return selectedSuburb.targetCount;
        return prev + Math.floor(Math.random() * 3 + 1);
      });

      // Move runner coordinates along simulated Milan street grid
      setRunnerPosition((prev) => {
        const nextX = prev.x + (Math.random() * 5 - 2) * speed;
        const nextY = prev.y + (Math.random() * 4 - 1.6) * speed;
        const boundedX = Math.max(100, Math.min(680, nextX));
        const boundedY = Math.max(80, Math.min(420, nextY));
        
        // Append point to active breadcrumb trail
        if (Math.random() > 0.5) {
          setPathPoints((pts) => [...pts.slice(-35), { x: boundedX, y: boundedY }]);
        }

        return { x: boundedX, y: boundedY };
      });
    }, 1100 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, selectedSuburb]);

  const percentage = Math.min(100, ((currentDelivered / selectedSuburb.targetCount) * 100)).toFixed(1);

  return (
    <section id="live-tracking" className="relative py-20 md:py-28 bg-[#0a0a0b] text-white overflow-hidden border-b border-neutral-800">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Mappa dal Vivo &bull; Milano GPS Telemetry</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Live Distribution Map with Motion
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl">
            Watch Realreach distributors walk Milan's street grid in real time. Every letterbox drop is GPS-logged, time-stamped, and photo-verified.
          </p>
        </div>

        {/* Zone Selector Chips (Milan Key Areas) */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {MILAN_ZONES.map((zone) => {
            const isSelected = selectedSuburb.id === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleZoneChange(zone)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white text-black shadow-lg shadow-white/10 scale-102'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <MapPin className={`h-3.5 w-3.5 ${isSelected ? 'text-black' : 'text-neutral-500'}`} />
                <span>{zone.name}</span>
                <span className="text-[11px] opacity-70">({zone.state.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Map Frame */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/60">
            
            {/* Live Campaign Status */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{selectedSuburb.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                    IN CORSO
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Client: <strong className="text-neutral-300">{selectedSuburb.agency}</strong> &bull; {selectedSuburb.coords}
                </p>
              </div>
            </div>

            {/* Playback Controls & Speed Multiplier */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors cursor-pointer border border-neutral-700"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-white" />}
                <span>{isPlaying ? 'Pause Motion' : 'Resume Motion'}</span>
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                {[1, 2, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                      speed === s ? 'bg-neutral-800 text-emerald-400 font-bold' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Vector / Heatmap Layer toggle */}
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setMapMode('streets')}
                  className={`px-2.5 py-1 text-xs rounded cursor-pointer ${
                    mapMode === 'streets' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  Vector
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('heatmap')}
                  className={`px-2.5 py-1 text-xs rounded cursor-pointer ${
                    mapMode === 'heatmap' ? 'bg-neutral-800 text-emerald-400 font-semibold' : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  Heatmap
                </button>
              </div>
            </div>

          </div>

          {/* SVG Map Canvas with Milan Landmarks & Live Runner Motion */}
          <div className="relative h-[460px] sm:h-[500px] w-full bg-[#0a0e14] overflow-hidden select-none">
            
            <svg 
              className="w-full h-full"
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Subtle map grid pattern */}
                <pattern id="milan-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161f2e" strokeWidth="0.8" />
                </pattern>
                
                {/* Heatmap blur filter */}
                <filter id="milanHeatGlow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <rect width="100%" height="100%" fill="#090d13" />
              <rect width="100%" height="100%" fill="url(#milan-grid)" />

              {/* Waterway: Naviglio Grande / Darsena Canal */}
              <path
                d="M 0 410 Q 250 420, 500 440 T 800 470"
                fill="none"
                stroke="#0f2b3e"
                strokeWidth="14"
              />
              <text x="30" y="400" fill="#2d6f9a" fontSize="10" fontWeight="600" letterSpacing="0.05em">
                Naviglio Grande &bull; Darsena di Milano
              </text>

              {/* Green Park: Parco Sempione & Castello Sforzesco */}
              <rect x="60" y="60" width="180" height="120" rx="14" fill="#0c2016" stroke="#173f2b" strokeWidth="1.2" />
              <text x="80" y="95" fill="#38a169" fontSize="11" fontWeight="700">Parco Sempione</text>
              <text x="80" y="112" fill="#276749" fontSize="9">Castello Sforzesco &bull; Arco della Pace</text>

              {/* Green Park 2: Giardini Pubblici Indro Montanelli */}
              <rect x="580" y="60" width="160" height="100" rx="12" fill="#0c2016" stroke="#173f2b" strokeWidth="1.2" />
              <text x="595" y="90" fill="#38a169" fontSize="10" fontWeight="700">Giardini Montanelli</text>

              {/* Milan Primary Street Network */}
              {/* Primary Arterial: Corso Vittorio Emanuele II */}
              <line x1="40" y1="230" x2="760" y2="230" stroke="#2a3b50" strokeWidth="11" />
              <line x1="40" y1="230" x2="760" y2="230" stroke="#141c28" strokeWidth="6" strokeDasharray="12 6" />
              <text x="50" y="218" fill="#64748b" fontSize="11" fontWeight="700">Corso Vittorio Emanuele II</text>

              {/* Via Monte Napoleone (Luxury Fashion District) */}
              <line x1="240" y1="40" x2="240" y2="460" stroke="#1e293b" strokeWidth="8" />
              <text x="248" y="70" fill="#94a3b8" fontSize="10" fontWeight="600">Via Monte Napoleone</text>

              {/* Via Manzoni */}
              <line x1="430" y1="40" x2="430" y2="460" stroke="#1e293b" strokeWidth="8" />
              <text x="438" y="70" fill="#94a3b8" fontSize="10" fontWeight="600">Via Manzoni &bull; Teatro alla Scala</text>

              {/* Via Brera */}
              <line x1="610" y1="40" x2="610" y2="450" stroke="#1e293b" strokeWidth="7" />
              <text x="618" y="80" fill="#94a3b8" fontSize="10" fontWeight="600">Via Brera &bull; Pinacoteca</text>

              {/* Cross streets: Via Dante, Corso di Porta Ticinese, Via Torino */}
              <line x1="40" y1="150" x2="740" y2="150" stroke="#1e293b" strokeWidth="6" />
              <text x="50" y="142" fill="#64748b" fontSize="10">Via Dante &bull; Cordusio</text>

              <line x1="60" y1="320" x2="640" y2="320" stroke="#1e293b" strokeWidth="6" />
              <text x="270" y="312" fill="#64748b" fontSize="10">Via Torino &bull; Colonne di San Lorenzo</text>

              <line x1="120" y1="390" x2="720" y2="390" stroke="#1e293b" strokeWidth="6" />
              <text x="320" y="382" fill="#64748b" fontSize="10">Corso di Porta Ticinese</text>

              {/* Duomo Landmark Square */}
              <circle cx="340" cy="230" r="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="330" y="234" fill="#38bdf8" fontSize="10" fontWeight="bold">Duomo</text>

              {/* Residential & Commercial Building Parcels */}
              {[100, 140, 270, 310, 370, 470, 520, 560].map((bx, i) => (
                <rect
                  key={`milan-b1-${i}`}
                  x={bx}
                  y={170}
                  width="28"
                  height="42"
                  rx="3"
                  fill="#111827"
                  stroke="#1f2937"
                  strokeWidth="1"
                />
              ))}

              {[100, 140, 270, 310, 370, 480, 530, 570].map((bx, i) => (
                <rect
                  key={`milan-b2-${i}`}
                  x={bx}
                  y={255}
                  width="28"
                  height="42"
                  rx="3"
                  fill="#111827"
                  stroke="#1f2937"
                  strokeWidth="1"
                />
              ))}

              {/* Heatmap overlay (if enabled) */}
              {mapMode === 'heatmap' && (
                <g filter="url(#milanHeatGlow)" opacity="0.65">
                  <circle cx="240" cy="180" r="55" fill="#10b981" />
                  <circle cx="340" cy="230" r="70" fill="#10b981" />
                  <circle cx="430" cy="230" r="75" fill="#059669" />
                  <circle cx="160" cy="150" r="50" fill="#34d399" />
                  <circle cx="380" cy="220" r="60" fill="#10b981" />
                </g>
              )}

              {/* GPS Traversed Route Breadcrumbs (Active Green Glowing Trail) */}
              <polyline
                points={pathPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80"
              />

              {/* Past Delivered Letterbox Marker Pins */}
              {[
                { x: 140, y: 150, street: 'Via Dante 14', time: '10:14', status: 'Delivered', flyer: 'A5 Property Showcase' },
                { x: 240, y: 180, street: 'Via Monte Napoleone 8', time: '10:28', status: 'Delivered', flyer: 'Luxury Listing Brochure' },
                { x: 340, y: 230, street: 'Piazza del Duomo 3', time: '10:45', status: 'Delivered', flyer: 'Quarterly Market Report' },
                { x: 430, y: 220, street: 'Via Manzoni 12', time: '11:02', status: 'Delivered', flyer: 'Just Listed Flyer' },
                { x: 310, y: 320, street: 'Via Torino 28', time: '11:20', status: 'Delivered', flyer: 'Exclusive Mandate Flyer' },
              ].map((pin, i) => (
                <g 
                  key={`pin-${i}`} 
                  onClick={() => setSelectedPin(pin)} 
                  className="cursor-pointer group"
                >
                  <circle cx={pin.x} cy={pin.y} r="5" fill="#10b981" className="group-hover:scale-150 transition-transform" />
                  <circle cx={pin.x} cy={pin.y} r="2" fill="#ffffff" />
                </g>
              ))}

              {/* LIVE MOVING RUNNER DOT WITH MOTION */}
              <g 
                transform={`translate(${runnerPosition.x}, ${runnerPosition.y})`}
                className="transition-transform duration-700 ease-linear"
              >
                {/* Radar pulse ripples */}
                <circle cx="0" cy="0" r="22" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
                <circle cx="0" cy="0" r="14" fill="#10b981" fillOpacity="0.35" />
                
                {/* Runner Core Dot */}
                <circle cx="0" cy="0" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                
                {/* Walker Label Tag */}
                <rect x="12" y="-12" width="138" height="24" rx="6" fill="#0a0a0b" fillOpacity="0.9" stroke="#10b981" strokeWidth="1" />
                <text x="20" y="4" fill="#ffffff" fontSize="10" fontWeight="bold">
                  Marco V. (Runner #18)
                </text>
              </g>

            </svg>

            {/* Selected Drop Photo Inspection Card (Interactive popup) */}
            {selectedPin && (
              <div className="absolute top-4 right-4 z-30 max-w-xs rounded-2xl bg-neutral-900/95 backdrop-blur-md border border-neutral-700 p-4 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Conferma Consegna GPS</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedPin(null)}
                    className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <p className="font-bold text-white text-sm">{selectedPin.street}</p>
                  <p className="text-neutral-400">Timestamp: {selectedPin.time} CET &bull; Geotag Verificato</p>
                  <p className="text-neutral-400">Materiale: {selectedPin.flyer}</p>
                  <div className="mt-2 rounded-lg bg-neutral-800 p-2 text-[10px] text-emerald-300 flex items-center gap-1.5">
                    <Camera className="h-3 w-3" />
                    <span>Foto cassetta postale acquisita nel report</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Bottom Telemetry HUD */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 px-4 py-3 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>GPS Ping: 4.2s (Precisione &plusmn;1.8m)</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-neutral-400">
                  <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                  <span>5G Milano Rete Attiva</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-neutral-400">
                  <BatteryMedium className="h-3.5 w-3.5 text-neutral-300" />
                  <span>Dispositivo: 94%</span>
                </div>
              </div>

              {/* Progress Count */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Consegnati:</span>
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  {currentDelivered.toLocaleString()} / {selectedSuburb.targetCount.toLocaleString()} ({percentage}%)
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Progress Metrics Bar */}
          <div className="p-5 sm:p-6 bg-neutral-900/40 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-neutral-800">
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Copertura Vie
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-0.5 block">
                {selectedSuburb.streetCount} Strade
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Distributori Attivi
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-0.5 block">
                {selectedSuburb.runners} Realreach Walkers
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Tempo Trascorso
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-0.5 block">
                {selectedSuburb.duration.split(' ')[0]}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Garanzia Consegna
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-blue-400 font-mono mt-0.5 block flex items-center gap-1.5">
                <ShieldCheck className="h-5 w-5" />
                <span>100% Verificata</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LiveGpsDemo;
