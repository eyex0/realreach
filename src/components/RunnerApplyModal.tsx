import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, Smartphone, ShieldCheck, MapPin } from 'lucide-react';
import RealReachLogo from './RealReachLogo';

interface RunnerApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunnerApplyModal: React.FC<RunnerApplyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Milano (Centro / Brera)',
    suburb: '',
    hasAbn: true,
    isOver18: true,
    hasSmartphone: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Top Bar */}
        <div className="px-6 py-4 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RealReachLogo size={28} />
            <div>
              <span className="font-bold text-white text-sm">Become a Reach Runner</span>
              <p className="text-[11px] text-neutral-400">Flexible Local Letterbox Deliveries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Join Our Independent Runner Fleet</h3>
                <p className="text-xs text-neutral-400">
                  Earn $90 – $180 per completed route. Work on your own schedule with no minimum hours.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Murphy"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="liam@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0423 456 789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Metro City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Milano (Centro / Brera)">Milano (Centro Storico / Brera)</option>
                    <option value="Milano (Navigli / Ticinese)">Milano (Navigli / Porta Ticinese)</option>
                    <option value="Milano (Porta Nuova / Isola)">Milano (Porta Nuova / Isola / Gae Aulenti)</option>
                    <option value="Milano (CityLife / Tre Torri)">Milano (CityLife / Amendola / Tre Torri)</option>
                    <option value="Monza & Brianza">Monza &amp; Brianza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Preferred Local Zone / Street *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Duomo, Brera, Navigli, Isola"
                    value={formData.suburb}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="pt-2 space-y-2 border-t border-neutral-800 text-xs text-neutral-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOver18}
                    onChange={(e) => setFormData({ ...formData, isOver18: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>I am 18 years of age or older</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasSmartphone}
                    onChange={(e) => setFormData({ ...formData, hasSmartphone: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>I have an iOS or Android smartphone with GPS location services</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasAbn}
                    onChange={(e) => setFormData({ ...formData, hasAbn: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>I possess a valid Codice Fiscale or Partita IVA (P.IVA) to work in Italy</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Submit Runner Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-white">Application Received!</h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mx-auto leading-relaxed">
                Welcome, {formData.fullName}. We have approved your initial registration for {formData.city}. Check your email ({formData.email}) for your app download link and your first route assignment.
              </p>

              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-left text-xs space-y-1">
                <div className="text-emerald-400 font-semibold">Next Step:</div>
                <p className="text-neutral-400">Download the REALREACH Runner App from the iOS App Store or Google Play and sign in with your mobile number.</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RunnerApplyModal;
