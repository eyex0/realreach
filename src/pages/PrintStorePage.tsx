import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import { 
  Upload, 
  ChevronDown, 
  Printer, 
  Check, 
  ArrowRight,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export const PrintStorePage: React.FC = () => {
  const [format, setFormat] = useState('DL Flyer — 99 × 210 mm');
  const [quantity, setQuantity] = useState('500');
  const [paperWeight, setPaperWeight] = useState('150gsm');
  const [sides, setSides] = useState<'single' | 'double'>('double');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);

  const price = sides === 'double' ? '104.89' : '78.50';

  return (
    <div className="min-h-screen bg-white text-[#0a0a0b] flex flex-col font-sans">
      
      {/* Top Header matching Image 6 */}
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white z-20">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <RealReachLogo size={24} color="#0a0a0b" />
            <span className="text-xl font-bold tracking-tight text-[#0a0a0b]">Realreach</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/campaigns/new" className="hover:text-black transition-colors flex items-center gap-1.5">
              <span>Dashboard</span>
            </Link>
            <span className="text-black font-bold flex items-center gap-1.5 border-b-2 border-black pb-4 pt-4">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </span>
            <Link to="/distribution-portal" className="hover:text-black transition-colors flex items-center gap-1.5">
              <span>Distribution</span>
            </Link>
          </nav>
        </div>

        {/* User Profile Avatar matching Image 6 */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
            MA
          </div>
          <span className="text-xs font-semibold text-slate-900 hidden sm:inline">Montaser Abdalla</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </div>
      </header>

      {/* Main 2-Column Split: Config on Left, Preview Canvas on Right */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN: PRINT CONFIGURATION (Matching Image 6) */}
        <div className="w-full lg:w-[380px] p-6 lg:p-8 border-r border-slate-200 bg-white space-y-6">
          <h1 className="text-3xl font-extrabold text-[#0a0a0b] tracking-tight">Print</h1>

          <div className="space-y-4 text-xs">
            {/* Format Selector */}
            <div>
              <div className="relative">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-800 pr-10 focus:outline-none focus:border-slate-400"
                >
                  <option>DL Flyer — 99 × 210 mm</option>
                  <option>A5 Flyer — 148 × 210 mm</option>
                  <option>A6 Postcard — 105 × 148 mm</option>
                  <option>A4 Brochure Folded to DL</option>
                </select>
                <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <div className="relative">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-800 pr-10 focus:outline-none focus:border-slate-400"
                >
                  <option>500</option>
                  <option>1,000</option>
                  <option>2,500</option>
                  <option>5,000</option>
                  <option>10,000</option>
                </select>
                <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Paper Weight Selector */}
            <div>
              <div className="relative">
                <select
                  value={paperWeight}
                  onChange={(e) => setPaperWeight(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-800 pr-10 focus:outline-none focus:border-slate-400"
                >
                  <option>150gsm</option>
                  <option>250gsm Premium Silk</option>
                  <option>350gsm Heavy Artboard</option>
                </select>
                <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Finish */}
            <div>
              <input
                type="text"
                readOnly
                value="Gloss"
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-xs font-medium text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 italic mt-1 block">
                Finish is determined by paper weight
              </span>
            </div>

            {/* Single Sided / Double Sided Toggle */}
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setSides('single')}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  sides === 'single' ? 'bg-white text-black shadow-2xs' : 'text-slate-500 hover:text-black'
                }`}
              >
                Single Sided
              </button>
              <button
                type="button"
                onClick={() => setSides('double')}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  sides === 'double' ? 'bg-white text-black shadow-2xs' : 'text-slate-500 hover:text-black'
                }`}
              >
                Double Sided
              </button>
            </div>

            {/* Portrait / Landscape Toggle */}
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  orientation === 'portrait' ? 'bg-white text-black shadow-2xs' : 'text-slate-500 hover:text-black'
                }`}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  orientation === 'landscape' ? 'bg-white text-black shadow-2xs' : 'text-slate-500 hover:text-black'
                }`}
              >
                Landscape
              </button>
            </div>

            {/* Continue Action Button */}
            <div className="pt-4">
              <button
                type="button"
                className="w-full py-3.5 rounded-xl bg-slate-400 hover:bg-slate-900 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Continue
              </button>
              <div className="mt-3 text-center">
                <Link to="/#pricing" className="text-xs text-slate-500 hover:text-black underline">
                  My Orders
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT CANVAS: BLUE GRID WITH 2-PAGE UPLOAD PREVIEW (Matching Image 6) */}
        <div className="flex-1 bg-[#dbeafe]/40 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(147, 197, 253, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(147, 197, 253, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Two Flyer Preview Cards */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto w-full my-auto">
            
            {/* Front Page Card */}
            <div 
              onClick={() => setFrontUploaded(!frontUploaded)}
              className="w-full max-w-[240px] aspect-[1/2.1] bg-white rounded-xl shadow-lg border border-slate-200 p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 transition-all group"
            >
              <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
                <Upload className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                {frontUploaded ? 'front_design.pdf' : 'Click to upload'}
              </h4>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {frontUploaded ? '✓ Uploaded Ready' : 'PDF only'}
              </span>
            </div>

            {/* Back Page Card */}
            <div 
              onClick={() => setBackUploaded(!backUploaded)}
              className="w-full max-w-[240px] aspect-[1/2.1] bg-white rounded-xl shadow-lg border border-slate-200 p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 transition-all group"
            >
              <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
                <Upload className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                {backUploaded ? 'back_design.pdf' : 'Click to upload'}
              </h4>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {backUploaded ? '✓ Uploaded Ready' : 'PDF only'}
              </span>
            </div>

          </div>

          <div className="text-center text-[10px] text-slate-400 select-none pb-4">
            CMYK conversion applied at print production
          </div>

          {/* Bottom Bar: Earliest Delivery & Live Price matching Image 6 */}
          <div className="flex items-center justify-between border-t border-blue-200/60 pt-4 bg-white/70 backdrop-blur-xs px-6 py-3 rounded-2xl">
            <div>
              <span className="block text-[11px] font-bold text-slate-700">Earliest Delivery:</span>
              <span className="block text-xs font-medium text-slate-900">Wednesday, 30th September</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 line-through mr-2 font-mono">€117.47</span>
              <span className="text-2xl font-black font-mono text-slate-950">€{price}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PrintStorePage;
