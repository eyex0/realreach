import React from 'react';
import { Link } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import { 
  CloudSun, 
  Sun, 
  Cloud, 
  MapPin, 
  ArrowRight, 
  FileText, 
  Receipt, 
  User, 
  HelpCircle, 
  BookOpen, 
  LogIn,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';

const CONDITIONS = [
  { city: 'Milano Centro & Duomo', condition: 'Partly cloudy', icon: CloudSun, temp: '22°C', availability: 'Very High', status: 'On schedule' },
  { city: 'Milano Navigli & Ticinese', condition: 'Clear', icon: Sun, temp: '23°C', availability: 'Very High', status: 'On schedule' },
  { city: 'Milano Porta Nuova & Isola', condition: 'Partly cloudy', icon: CloudSun, temp: '22°C', availability: 'Very High', status: 'On schedule' },
  { city: 'Milano CityLife & Amendola', condition: 'Partly cloudy', icon: CloudSun, temp: '21°C', availability: 'Very High', status: 'On schedule' },
  { city: 'Monza & Brianza', condition: 'Overcast', icon: Cloud, temp: '20°C', availability: 'High', status: 'On schedule' },
  { city: 'Bergamo & Hinterland', condition: 'Partly cloudy', icon: CloudSun, temp: '19°C', availability: 'High', status: 'On schedule' },
  { city: 'Brescia Centro', condition: 'Clear', icon: Sun, temp: '21°C', availability: 'Very High', status: 'On schedule' },
  { city: 'Como & Cantù', condition: 'Partly cloudy', icon: CloudSun, temp: '18°C', availability: 'High', status: 'On schedule' },
];

export const DistributionPortalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#0a0a0b] flex font-sans">
      
      {/* 1. LEFT ICON SIDEBAR MATCHING IMAGE 9 */}
      <aside className="w-56 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-4 z-20 shrink-0">
        <div>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 px-3 py-3 mb-6">
            <RealReachLogo size={24} color="#0a0a0b" />
            <span className="font-bold text-base tracking-tight text-[#0a0a0b]">REALREACH</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold text-slate-600">
            <Link to="/campaigns/new" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 hover:text-black transition-colors">
              <FileText className="h-4 w-4" />
              <span>Design &amp; Areas</span>
            </Link>
            <Link to="/print" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 hover:text-black transition-colors">
              <Printer className="h-4 w-4" />
              <span>Order Print</span>
            </Link>
            <Link to="/signup" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 hover:text-black transition-colors">
              <Clock className="h-4 w-4" />
              <span>My Orders</span>
            </Link>
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-100 text-black font-bold">
              <MapPin className="h-4 w-4" />
              <span>Distribution</span>
            </span>
          </nav>
        </div>

        {/* Bottom Sidebar Links */}
        <div className="space-y-1 text-xs text-slate-500 font-semibold border-t border-slate-100 pt-4">
          <Link to="/signup" className="flex items-center gap-3 px-3 py-2 hover:text-black transition-colors">
            <LogIn className="h-4 w-4" />
            <span>Sign in</span>
          </Link>
          <Link to="/contact" className="flex items-center gap-3 px-3 py-2 hover:text-black transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span>Support</span>
          </Link>
          <Link to="/blog" className="flex items-center gap-3 px-3 py-2 hover:text-black transition-colors">
            <BookOpen className="h-4 w-4" />
            <span>Tutorial</span>
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (Matching Image 9) */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1300px] mx-auto overflow-y-auto space-y-8">
        
        {/* TOP DISTRIBUTION PORTAL CARD (Split: Actions Left, Map Right) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid lg:grid-cols-12">
          
          {/* Left Actions Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <MapPin className="h-3.5 w-3.5" />
                <span>Milano (MI), IT</span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-black font-semibold underline cursor-pointer">Change zone</span>
              </div>

              <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0a0a0b] tracking-tight">
                Distribution Portal
              </h1>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2.5">
              <Link
                to="/signup"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs font-semibold text-slate-900 group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span>View Orders</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/signup"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs font-semibold text-slate-900 group"
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="h-4 w-4 text-slate-500" />
                  <span>View Invoices</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/signup"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs font-semibold text-slate-900 group"
              >
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-slate-500" />
                  <span>My Account</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Log in CTA */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/signup"
                className="rounded-xl bg-[#0a0a0b] text-white px-6 py-2.5 text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Log in
              </Link>
              <span className="text-xs text-slate-500">Sign up to create distribution campaigns</span>
            </div>
          </div>

          {/* Right Map Graphic Column with Live Walker Pin Cluster */}
          <div className="lg:col-span-6 bg-blue-50/50 p-6 relative border-t lg:border-t-0 lg:border-l border-slate-200 flex items-center justify-center">
            
            {/* Live Distributors Badge */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>12.4k Distributors Active</span>
            </div>

            {/* Vector City Map with Dropper Pins */}
            <svg viewBox="0 0 400 240" className="w-full h-auto max-w-md drop-shadow-sm" fill="none">
              <rect width="400" height="240" rx="12" fill="#eff6ff" />
              {/* Roads */}
              <path d="M 0 120 Q 200 80 400 130" stroke="#bfdbfe" strokeWidth="8" />
              <path d="M 120 0 Q 150 120 180 240" stroke="#bfdbfe" strokeWidth="6" />
              <path d="M 280 0 Q 240 120 220 240" stroke="#bfdbfe" strokeWidth="6" />
              <path d="M 50 200 Q 200 160 380 40" stroke="#93c5fd" strokeWidth="4" />

              {/* Distributor Pins (Clusters matching Image 9) */}
              {[
                { x: 140, y: 70 }, { x: 190, y: 85 }, { x: 230, y: 65 }, { x: 280, y: 90 },
                { x: 120, y: 130 }, { x: 160, y: 145 }, { x: 200, y: 125 }, { x: 240, y: 150 },
                { x: 280, y: 140 }, { x: 180, y: 175 }, { x: 220, y: 185 }, { x: 270, y: 195 },
                { x: 310, y: 160 }, { x: 100, y: 165 }, { x: 330, y: 110 }
              ].map((pin, i) => (
                <g key={i} transform={`translate(${pin.x}, ${pin.y})`}>
                  <circle r="4" fill="#0f172a" />
                  <circle r="2" fill="#ffffff" />
                </g>
              ))}
            </svg>
          </div>

        </div>

        {/* BOTTOM DISTRIBUTION CONDITIONS TABLE (Matching Image 9) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0a0a0b] tracking-tight">Distribution Conditions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live weather across major Italian regions</p>
            </div>

            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live</span>
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">City / Zone</th>
                  <th className="pb-3">Conditions</th>
                  <th className="pb-3">Temp</th>
                  <th className="pb-3">Dropper Availability</th>
                  <th className="pb-3 text-right">Distribution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {CONDITIONS.map((row) => {
                  const Icon = row.icon;
                  return (
                    <tr key={row.city} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 font-bold text-[#0a0a0b]">{row.city}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-slate-500" />
                          <span>{row.condition}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono">{row.temp}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>{row.availability}</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{row.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </main>

    </div>
  );
};

export default DistributionPortalPage;
