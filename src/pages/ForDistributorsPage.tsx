import React, { useState } from 'react';
import { Apple, Calendar, DollarSign, Navigation2, PackageCheck, Smartphone, CheckCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export const ForDistributorsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zone: 'Milano Centro (Duomo, Brera)',
    transport: 'Walking',
    hours: '10-20 hrs/week',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-16 pb-20 bg-slate-50 border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Milan Walker &amp; Runner Network
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0a0a0b] tracking-tight">
            Earn Money, Stay Active
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#4b5563] max-w-2xl mx-auto">
            Pick up delivery jobs in Milan, walk your route with our GPS app, and get paid up to €25–€35/hour twice a week.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#apply"
              className="rounded-xl bg-[#0a0a0b] text-white px-8 py-3.5 text-base font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Apply as a Walker
            </a>
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Paid every Tuesday &amp; Friday directly to IBAN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="py-20 max-w-[1200px] mx-auto px-5 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0a0a0b]">Why deliver with Realreach?</h2>
          <p className="mt-2 text-[#4b5563]">The fairest, most reliable flyer distribution community in Italy.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-[#0a0a0b]">Your Schedule</h3>
            <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
              No fixed shifts or minimum commitments. Select runs that fit your university schedule or free time.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
              <Navigation2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-[#0a0a0b]">GPS Tracking App</h3>
            <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
              Our mobile app logs your walked route automatically. No paper manifests or manual drop reporting.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-[#0a0a0b]">Paid 2x a Week</h3>
            <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
              Earnings are deposited straight into your bank account every Tuesday and Friday without invoicing.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
              <PackageCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-[#0a0a0b]">No Bundling</h3>
            <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
              Flyers arrive counted, packed, and ready. Grab the boxed materials from the pickup hub and go.
            </p>
          </div>
        </div>
      </section>

      {/* Milan Application Form */}
      <section id="apply" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Milan Distributor Application
              </span>
              <h2 className="mt-2 text-2xl font-bold text-[#0a0a0b]">Start walking next week</h2>
              <p className="mt-1 text-sm text-[#6b7280]">Complete this quick form to receive your onboarding invite.</p>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0a0a0b]">Application Received!</h3>
                <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
                  Grazie {formData.name}. Our Milan dispatch coordinator will review your profile and text you with app credentials within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                    placeholder="Mario Rossi"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                      placeholder="mario@example.it"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                      Italian Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                      placeholder="+39 340 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                    Preferred Milan Zone
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                  >
                    <option value="Milano Centro (Duomo, Brera)">Milano Centro (Duomo, Brera, Montenapoleone)</option>
                    <option value="Porta Nuova & Isola">Porta Nuova &amp; Isola</option>
                    <option value="Navigli & Porta Ticinese">Navigli &amp; Porta Ticinese</option>
                    <option value="CityLife & Portello">CityLife &amp; Portello</option>
                    <option value="Porta Romana & Guastalla">Porta Romana &amp; Guastalla</option>
                    <option value="Lambrate & Città Studi">Lambrate &amp; Città Studi</option>
                    <option value="Monza & Hinterland">Monza &amp; Hinterland</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                      Transportation
                    </label>
                    <select
                      value={formData.transport}
                      onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                    >
                      <option value="Walking">Walking / On Foot</option>
                      <option value="Bicycle">Bicycle / Cargo Bike</option>
                      <option value="E-Scooter">E-Scooter</option>
                      <option value="Car">Car / Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                      Availability
                    </label>
                    <select
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                    >
                      <option value="5-10 hrs/week">5-10 hrs/week</option>
                      <option value="10-20 hrs/week">10-20 hrs/week</option>
                      <option value="20-30 hrs/week">20-30 hrs/week</option>
                      <option value="30+ hrs/week">Full Time (30+ hrs)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 rounded-xl bg-[#0a0a0b] text-white py-3.5 text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForDistributorsPage;
