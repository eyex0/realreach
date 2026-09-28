import React from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';
import { RealReachLogo } from './RealReachLogo';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <RealReachLogo size={22} color="#0a0a0b" />
            <div>
              <h3 className="font-bold text-base text-[#0a0a0b]">Terms &amp; Conditions</h3>
              <p className="text-xs text-slate-500">Last updated September 2026 &bull; REALREACH Platform</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-slate-700 space-y-5 leading-relaxed font-normal">
          <p className="font-medium text-slate-900">
            REALREACH operates an online platform to facilitate letterbox delivery service agreements between Clients and Distributors.
          </p>

          <p>
            These Terms and Conditions (Terms) constitute a legally binding agreement between REALREACH S.r.l. (P.IVA IT 12849300965) (REALREACH, we, our or us) and each person (User or you) who accesses or uses the REALREACH website, mobile application, or associated services (collectively, the Platform).
          </p>

          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-sm text-[#0a0a0b]">1. Amendment of Terms</h4>
            <p>
              1.1 We reserve the right to amend these Terms or the Policies at any time in our discretion by publishing an updated version on the Platform. Except for changes required by law, we will endeavour to provide at least 30 days' notice of material amendments.
            </p>
            <p>
              1.2 The next time you log in to the Platform you will be prompted to review and agree to the updated Terms. Continuing to use the Platform constitutes acceptance.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-sm text-[#0a0a0b]">2. Nature of the Platform and REALREACH Services</h4>
            <p>
              2.1 REALREACH operates an online marketplace enabling Clients to publish Runs and Distributors to accept Runs and perform flyer distribution services with precision GPS verification.
            </p>
            <p>
              2.2 REALREACH does not employ Distributors as permanent staff. Users are independent contractors responsible for compliance with local distribution regulations and signage (including "No Pubblicità" / "No Junk Mail").
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-sm text-[#0a0a0b]">3. Distribution Contract &amp; GPS Telemetry</h4>
            <p>
              3.1 Once a run is matched to a distributor, the runner collects the materials from the designated pickup depot or agency office.
            </p>
            <p>
              3.2 GPS tracking data is logged automatically through the walker smartphone app, recording timestamps, route breadcrumbs, walking pace, and milestone confirmation photos.
            </p>
            <p>
              3.3 If GPS telemetry reveals an incomplete delivery or skipped streets within the contracted polygon, REALREACH guarantees re-delivery or a complete refund.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-sm text-[#0a0a0b]">4. Privacy &amp; Data Protection (GDPR)</h4>
            <p>
              4.1 REALREACH processes client and distributor data in strict compliance with the European General Data Protection Regulation (GDPR) 2016/679.
            </p>
            <p>
              4.2 Location data and telemetry breadcrumbs are collected solely for delivery auditing and proof-of-performance purposes.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-black cursor-pointer"
          >
            Close
          </button>

          {onAccept && (
            <button
              type="button"
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0a0a0b] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>I Accept Terms &amp; Conditions</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
