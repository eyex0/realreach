import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    zone: 'Milano Centro',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', zone: 'Milano Centro', message: '' });
    }, 600);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-16 pb-20 bg-slate-50 border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Milan Support Team
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0a0a0b] tracking-tight">
            Contact Realreach
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#4b5563] max-w-2xl mx-auto">
            Get in touch with our Milan operations and account management team. We respond within two business hours.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="py-20 max-w-[1200px] mx-auto px-5 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left: Office & Contact details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#0a0a0b]">Milan Headquarters</h2>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                Our Italian central dispatch and client support operations are located in the heart of Milan.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <MapPin className="h-5 w-5 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0a0a0b]">Office Address</h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Via Monte Napoleone 8<br />
                    20121 Milano (MI), Italy
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Phone className="h-5 w-5 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0a0a0b]">Phone Support</h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    <a href="tel:+390280031847" className="hover:underline font-semibold text-slate-900">
                      +39 02 800 318 47
                    </a>
                    <br />
                    <span className="text-xs text-slate-500">Numero Verde: 800 318 479</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Mail className="h-5 w-5 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0a0a0b]">Email Inquiries</h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    <a href="mailto:support@realreach.it" className="hover:underline">
                      support@realreach.it
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Clock className="h-5 w-5 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0a0a0b]">Operating Hours</h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Monday – Friday: 08:30 – 18:30 CET<br />
                    Walker Dispatch active 7 days a week
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
              <h3 className="text-2xl font-bold text-[#0a0a0b]">Send us a message</h3>
              <p className="mt-1 text-sm text-[#6b7280]">
                Tell us about your upcoming campaigns, agency requirements, or target suburbs.
              </p>

              {status === 'success' ? (
                <div className="py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#0a0a0b]">Grazie! Messaggio Inviato</h4>
                  <p className="mt-2 text-slate-600 text-sm max-w-sm mx-auto">
                    We have received your request. An account manager from our Milan office will call or email you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-6 rounded-xl bg-[#0a0a0b] text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                        placeholder="Marco Bianchi"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                        Company / Agency
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                        placeholder="e.g. Engel & Völkers / Remax"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                        placeholder="marco@agency.it"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                        placeholder="+39 02 ..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                      Target Area in Milan
                    </label>
                    <select
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                    >
                      <option value="Milano Centro">Milano Centro Storico (Duomo, Brera, Montenapoleone)</option>
                      <option value="Porta Nuova & Isola">Porta Nuova &amp; Isola</option>
                      <option value="Navigli & Porta Ticinese">Navigli &amp; Porta Ticinese</option>
                      <option value="CityLife & Portello">CityLife &amp; Portello</option>
                      <option value="Porta Romana">Porta Romana &amp; Guastalla</option>
                      <option value="Multiple Zones">Multiple Zones / Province of Milan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0a0a0b] mb-1.5">
                      Message / Campaign Details
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                      placeholder="Let us know your quantity, desired drop dates, and if you also need printing..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-xl bg-[#0a0a0b] text-white py-3.5 text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Invia Messaggio</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
