import React from 'react';
import { ShieldCheck, MapPin, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-16 pb-20 bg-slate-50 border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Our Story &amp; Mission
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0a0a0b] tracking-tight">
            About REALREACH
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#4b5563] max-w-2xl mx-auto leading-relaxed">
            Rebuilding the flyer distribution industry with live GPS telemetry, complete transparency, and guaranteed delivery across Milan and Italy.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-20 max-w-4xl mx-auto px-5 sm:px-6">
        <div className="prose prose-lg text-slate-700 max-w-none space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a0a0b]">
            Why we founded REALREACH in Milan
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#4b5563]">
            For decades, local businesses, real estate agencies, and retailers relied on letterbox marketing without any real way to know if their flyers were actually delivered or dumped in recycling bins.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-[#4b5563]">
            We started REALREACH with a single goal: make pamphlet delivery as transparent and measurable as digital marketing. We engineered a platform that pairs every distributor with precision GPS telemetry, recording street-by-street breadcrumbs, speed, and house-count milestones in real time.
          </p>

          {/* Key Pillars */}
          <div className="my-12 grid sm:grid-cols-3 gap-6 not-prose">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-[#0a0a0b]">100% Guaranteed</h3>
              <p className="mt-2 text-sm text-[#4b5563]">
                If a delivery run isn't verified by GPS logs and completion photos, we re-run or refund completely.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-[#0a0a0b]">Milan Expertise</h3>
              <p className="mt-2 text-sm text-[#4b5563]">
                Deep geographic insights across Milan's 9 zones, filtering out commercial towers or inaccessible complexes.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-[#0a0a0b]">Fair Walker Pay</h3>
              <p className="mt-2 text-sm text-[#4b5563]">
                We pay distributors above standard market rates, fostering a reliable, motivated local delivery network.
              </p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a0a0b] pt-6">
            Milan Headquarters
          </h2>
          <p className="text-base text-[#4b5563] leading-relaxed">
            Our Italian dispatch and operations center is based in central Milan:
            <br />
            <strong>REALREACH S.r.l.</strong>
            <br />
            Via Monte Napoleone 8, 20121 Milano (MI), Italy
            <br />
            P.IVA IT 12849300965 &bull; Telefono: +39 02 800 318 47
          </p>

          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="rounded-xl bg-[#0a0a0b] text-white px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Get in Touch with our Milan Team
            </Link>
            <Link
              to="/#how-it-works"
              className="text-sm font-semibold text-slate-700 hover:text-black underline"
            >
              Learn How It Works &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
