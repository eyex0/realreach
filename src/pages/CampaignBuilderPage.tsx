import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import { 
  ArrowLeft, 
  Search, 
  Trash2, 
  Globe, 
  Filter, 
  Home, 
  Layers, 
  Plus, 
  Share2, 
  MessageSquare, 
  User, 
  Check, 
  Building2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const CampaignBuilderPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'both' | 'houses' | 'units'>('both');
  const [activeArea, setActiveArea] = useState<number>(2);

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col font-sans overflow-hidden">
      
      {/* 1. TOP NAVBAR MATCHING IMAGE 7 & 8 */}
      <header className="h-14 bg-[#0a0a0b] border-b border-neutral-800 px-5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <RealReachLogo size={22} color="#ffffff" />
            <span className="text-base font-bold tracking-tight text-white">REALREACH</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-400">
            <Link to="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <Link to="/distribution-portal" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Layers className="h-3.5 w-3.5" />
              <span>Activity</span>
            </Link>
            <Link to="/print" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Building2 className="h-3.5 w-3.5" />
              <span>Billing &amp; Print</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl bg-white text-black px-4 py-1.5 text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Book Delivery
          </button>
          <div className="flex items-center gap-2 text-neutral-400">
            <button className="p-1.5 hover:text-white transition-colors cursor-pointer" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:text-white transition-colors cursor-pointer" aria-label="Messages">
              <MessageSquare className="h-4 w-4" />
            </button>
            <div className="h-7 w-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white">
              MA
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN SPLIT: LEFT SIDEBAR + FULL MAP CANVAS */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT SIDEBAR: CAMPAIGN STEPS & AREAS (Matching Image 7 & 8) */}
        <div className="w-80 sm:w-96 bg-white text-[#0a0a0b] border-r border-slate-200 flex flex-col justify-between z-20 shadow-xl overflow-y-auto">
          
          <div className="p-5 space-y-6">
            
            {/* Header: Back arrow & Campaign Title */}
            <div className="flex items-center gap-3">
              <Link to="/" className="p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h2 className="text-xl font-bold text-[#0a0a0b] tracking-tight">Campaign 12-Jan</h2>
            </div>

            {/* Step 1: Create Areas */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                <span className="h-5 w-5 rounded-full bg-black text-white text-[11px] flex items-center justify-center">1</span>
                <span>Create Areas</span>
              </div>

              {/* Area 1 Card */}
              <div 
                onClick={() => setActiveArea(1)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer mb-2.5 flex items-center justify-between ${
                  activeArea === 1 ? 'border-black bg-slate-50 shadow-2xs' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Milano Duomo</h4>
                    <p className="text-[11px] text-slate-500">1,100 Letterboxes &bull; 9km</p>
                    <span className="text-[10px] text-blue-600 font-semibold underline">View addresses</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-slate-900 block">€153.78</span>
                  <span className="text-[10px] text-slate-400">€0.14 per item</span>
                </div>
              </div>

              {/* Area 2 Card (Active) */}
              <div 
                onClick={() => setActiveArea(2)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeArea === 2 ? 'border-black ring-1 ring-black bg-slate-50 shadow-2xs' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Milano Brera &amp; Navigli</h4>
                    <p className="text-[11px] text-slate-500">1,000 Letterboxes &bull; 5km</p>
                    <span className="text-[10px] text-emerald-600 font-semibold underline">View addresses</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-slate-900 block">€91.75</span>
                  <span className="text-[10px] text-slate-400">€0.09 per item</span>
                </div>
              </div>
            </div>

            {/* Inactive Future Steps */}
            <div className="space-y-3 pt-2 text-xs text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full border border-slate-300 text-[11px] flex items-center justify-center">2</span>
                <span>Campaign Details</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full border border-slate-300 text-[11px] flex items-center justify-center">3</span>
                <span>Invoice Details</span>
              </div>
            </div>

          </div>

          {/* Help link at bottom */}
          <div className="p-4 border-t border-slate-200 text-center">
            <button className="text-xs text-slate-500 hover:text-black font-medium flex items-center justify-center gap-1.5 mx-auto">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Show help video</span>
            </button>
          </div>

        </div>

        {/* RIGHT FULL MAP CANVAS WITH POLYGON & BOTTOM CONTROLS (Matching Image 7 & 8) */}
        <div className="flex-1 relative bg-slate-950 overflow-hidden">
          
          {/* Map Vector Satellite Simulation */}
          <svg className="w-full h-full object-cover" viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg">
            {/* Dark Map Tiles Background */}
            <rect width="1000" height="700" fill="#1e293b" />

            {/* Street Grid Lines */}
            <g stroke="#334155" strokeWidth="2.5" opacity="0.6">
              <line x1="0" y1="120" x2="1000" y2="120" />
              <line x1="0" y1="240" x2="1000" y2="240" />
              <line x1="0" y1="360" x2="1000" y2="360" />
              <line x1="0" y1="480" x2="1000" y2="480" />
              <line x1="0" y1="600" x2="1000" y2="600" />
              <line x1="200" y1="0" x2="200" y2="700" />
              <line x1="380" y1="0" x2="380" y2="700" />
              <line x1="560" y1="0" x2="560" y2="700" />
              <line x1="740" y1="0" x2="740" y2="700" />
              <line x1="920" y1="0" x2="920" y2="700" />
            </g>

            {/* Milan Navigli Canal Waterway */}
            <path d="M 0 620 Q 300 520 600 560 T 1000 640" stroke="#0284c7" strokeWidth="18" fill="none" opacity="0.4" />

            {/* DRAWN POLYGON AREA 1 (Duomo) */}
            <path
              d="M 240 180 L 420 160 L 450 310 L 260 330 Z"
              fill="#2563eb"
              fillOpacity="0.25"
              stroke="#3b82f6"
              strokeWidth="3"
            />
            <circle cx="340" cy="245" r="16" fill="#0a0a0b" stroke="#ffffff" strokeWidth="2" />
            <text x="340" y="250" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>

            {/* DRAWN POLYGON AREA 2 (Active Brera & Navigli Area matching Image 7 & 8) */}
            <path
              d="M 480 220 L 780 240 L 740 440 L 460 410 Z"
              fill="#0a0a0b"
              fillOpacity="0.35"
              stroke="#0a0a0b"
              strokeWidth="4"
            />
            {/* Polygon Corner Pins */}
            <circle cx="480" cy="220" r="6" fill="#ffffff" stroke="#000000" strokeWidth="3" />
            <circle cx="780" cy="240" r="6" fill="#ffffff" stroke="#000000" strokeWidth="3" />
            <circle cx="740" cy="440" r="6" fill="#ffffff" stroke="#000000" strokeWidth="3" />
            <circle cx="460" cy="410" r="6" fill="#ffffff" stroke="#000000" strokeWidth="3" />
            
            {/* Area 2 Number Badge */}
            <circle cx="610" cy="330" r="16" fill="#0a0a0b" stroke="#ffffff" strokeWidth="2" />
            <text x="610" y="335" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
          </svg>

          {/* TOP ADDRESS SEARCH BAR & AREA PILL (Matching Image 7 & 8) */}
          <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4 pointer-events-none z-10">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-white text-slate-800 rounded-xl px-4 py-2.5 shadow-xl w-full max-w-md pointer-events-auto border border-slate-200">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                readOnly
                value="Search Milan address, zone or CAP..."
                className="w-full text-xs font-medium bg-transparent focus:outline-none cursor-default text-slate-600"
              />
            </div>

            {/* Area Address Counter Pill */}
            <div className="bg-white text-slate-900 rounded-xl px-4 py-2.5 shadow-xl border border-slate-200 pointer-events-auto flex items-center gap-2 text-xs font-bold">
              <span>Area 2: 1,018 addresses</span>
              <span className="text-slate-400 font-normal">(&#8962; 459 Houses, &#127970; 559 Units)</span>
            </div>
          </div>

          {/* LEFT MAP TOOLBAR ICONS (Matching Image 7 & 8) */}
          <div className="absolute top-24 left-5 bg-white text-slate-800 rounded-xl p-1.5 shadow-xl border border-slate-200 space-y-1 z-10 flex flex-col items-center">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Delete polygon">
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Satellite layer">
              <Globe className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Filter addresses">
              <Filter className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Residential only">
              <Home className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Multi-polygon">
              <Layers className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Add Area">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* "Finish" Polygon Button on Map */}
          <div className="absolute top-1/2 left-[58%] -translate-x-1/2 -translate-y-1/2 z-10">
            <button className="rounded-full bg-[#0a0a0b] text-white px-5 py-1.5 text-xs font-bold shadow-2xl border border-neutral-700 hover:bg-neutral-800 cursor-pointer">
              Finish
            </button>
          </div>

          {/* FLOATING BOTTOM ESTIMATION CARDS & NEXT BUTTON (Matching Image 7 & 8) */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4">
            
            {/* The 3 Audience Selection Cards */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Option 1: Houses + Units */}
              <button
                type="button"
                onClick={() => setSelectedType('both')}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer text-left flex items-center gap-3.5 ${
                  selectedType === 'both'
                    ? 'bg-white text-slate-900 border-2 border-black shadow-2xl scale-102'
                    : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-white'
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Houses + Units</span>
                    <span className="text-sm font-extrabold font-mono text-slate-950">€270.09</span>
                  </div>
                  <span className="text-[11px] text-slate-500">2,100 Letterboxes &bull; incl. IVA</span>
                </div>
              </button>

              {/* Option 2: Houses Only */}
              <button
                type="button"
                onClick={() => setSelectedType('houses')}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer text-left flex items-center gap-3.5 ${
                  selectedType === 'houses'
                    ? 'bg-white text-slate-900 border-2 border-black shadow-2xl scale-102'
                    : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-white'
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Home className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Houses Only</span>
                    <span className="text-sm font-extrabold font-mono text-slate-950">€138.45</span>
                  </div>
                  <span className="text-[11px] text-slate-500">950 Letterboxes &bull; incl. IVA</span>
                </div>
              </button>

              {/* Option 3: Units Only */}
              <button
                type="button"
                onClick={() => setSelectedType('units')}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer text-left flex items-center gap-3.5 ${
                  selectedType === 'units'
                    ? 'bg-white text-slate-900 border-2 border-black shadow-2xl scale-102'
                    : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-white'
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Units Only</span>
                    <span className="text-sm font-extrabold font-mono text-slate-950">€155.69</span>
                  </div>
                  <span className="text-[11px] text-slate-500">1,150 Letterboxes &bull; incl. IVA</span>
                </div>
              </button>

            </div>

            {/* [Next] Button */}
            <Link
              to="/signup"
              className="rounded-2xl bg-[#0a0a0b] text-white px-10 py-4 text-base font-bold hover:bg-neutral-800 transition-all shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-103"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CampaignBuilderPage;
