import React from 'react';
import { Link } from 'react-router-dom';
import { Map, BarChart3, Clock, ShieldCheck, Headphones, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { RealReachLogo } from './RealReachLogo';

interface CapabilitiesBentoProps {
  onOpenOrder: () => void;
  onOpenPortal: () => void;
}

export const CapabilitiesBento: React.FC<CapabilitiesBentoProps> = ({
  onOpenOrder,
  onOpenPortal,
}) => {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#f9fafb] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        
        {/* Section Header with User's Logo */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs mb-4">
            <RealReachLogo size={18} color="#0a0a0b" />
            <span>REALREACH Platform Suite</span>
          </div>

          <h2
            className="font-bold text-[#0a0a0b] leading-[1.12] tracking-[-0.03em] text-[clamp(2.2rem,4.5vw,3.5rem)]"
          >
            Free Features
          </h2>

          <p className="mt-3 text-base sm:text-xl text-[#4b5563]">
            When you create an account, get access to
          </p>
        </div>

        {/* Feature Grid with High-Resolution Visual Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Custom Map Area Insights */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Map className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                  <RealReachLogo size={13} color="#0a0a0b" />
                  <span>Free</span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-[#0a0a0b]">Custom map area insights</h3>
              <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
                Filter by Milan zones, postcodes (CAP), or draw custom street polygons with exact residential mailbox counts.
              </p>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <img
                src="https://realrun.com.au/__l5e/assets-v1/226dd3d2-8f86-4dd0-b55d-e313dca6333c/feature-map-insights.png"
                alt="Map area insights"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 2: Instant Campaign Pricing */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                  <RealReachLogo size={13} color="#0a0a0b" />
                  <span>Free</span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-[#0a0a0b]">Instant transparent pricing</h3>
              <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
                No waiting for manual sales quotes. Immediate per-letterbox rates calculated live on screen in € Euros.
              </p>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <img
                src="https://realrun.com.au/__l5e/assets-v1/c8fc078c-3611-479d-90ff-41fb54cd41f8/feature-campaigns-prices.png"
                alt="Campaign pricing"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 3: Unlimited Draft Campaigns */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                  <RealReachLogo size={13} color="#0a0a0b" />
                  <span>Free</span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-[#0a0a0b]">Unlimited draft campaigns</h3>
              <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
                Plan and save upcoming drops for property listings or product launches without committing upfront.
              </p>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <img
                src="https://realrun.com.au/__l5e/assets-v1/c6ba7a2d-10fa-4126-84bf-b1a7f09d43df/feature-draft-campaigns.png"
                alt="Draft campaigns"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 4: Accurate Residential Counts */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                  <RealReachLogo size={13} color="#0a0a0b" />
                  <span>Free</span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-[#0a0a0b]">Accurate residential counts</h3>
              <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
                Updated Italian &amp; Milan municipal cadastral data filtering out commercial complexes or no-junk-mail zones.
              </p>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <img
                src="https://realrun.com.au/__l5e/assets-v1/0c701650-6e26-457f-ad54-44c29380db8b/feature-map-house-counts.png"
                alt="House counts"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 5: Live Analytics & Audit Logs */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                  <RealReachLogo size={13} color="#0a0a0b" />
                  <span>Free</span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-[#0a0a0b]">Delivery insights dashboard</h3>
              <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
                Share live tracking links with property vendors so they see walkers delivering brochures in real-time.
              </p>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <img
                src="https://realrun.com.au/__l5e/assets-v1/b9469439-2c14-48dd-892c-cdd48992dd4f/feature-insights-dashboard.png"
                alt="Insights dashboard"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 6: Milan & Italy Support */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Headphones className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                  <RealReachLogo size={13} color="#0a0a0b" />
                  <span>Free</span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-[#0a0a0b]">Milan &amp; Italian support</h3>
              <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
                Direct Milan operations phone and chat line. If any route issue occurs, our team coordinates distributor re-runs instantly.
              </p>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <img
                src="https://realrun.com.au/__l5e/assets-v1/e009fceb-ab9d-4a43-92bd-1446ddabd907/feature-support.png"
                alt="Local support"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

        </div>

        {/* CTA Bar to Sign Up Page */}
        <div className="mt-14 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-8 py-3.5 text-base font-semibold hover:bg-neutral-800 transition-all shadow-md cursor-pointer hover:scale-102"
          >
            <RealReachLogo size={18} color="#ffffff" />
            <span>Create a free account to get started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={onOpenOrder}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <span>Explore pricing</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default CapabilitiesBento;
