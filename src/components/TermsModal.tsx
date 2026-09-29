import React from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';
import { RealReachLogo } from './RealReachLogo';
import { TermsContent } from './TermsContent';

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
              <p className="text-xs text-slate-500">Last updated September 2026 &bull; Realreach Platform</p>
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
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-slate-700 font-normal">
          <TermsContent variant="modal" />
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
