import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Printer, 
  Calendar, 
  FileUp, 
  ShieldCheck, 
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import RealReachLogo from './RealReachLogo';

export interface CampaignData {
  city: string;
  suburb: string;
  quantity: number;
  serviceType: 'print_and_deliver' | 'deliver_only';
  format: string;
  paperStock: string;
  isSoloDrop: boolean;
  totalPrice: number;
  pricePerUnit: number;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData: CampaignData;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  campaignData,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [agencyName, setAgencyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('2026-10-05');
  const [instructions, setInstructions] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [campaignId] = useState(() => `RR-${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !contactName || !email || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 900);
  };

  const copyLiveTrackingLink = () => {
    navigator.clipboard?.writeText(`https://realreach.com.au/track/${campaignId.toLowerCase()}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Top Bar */}
        <div className="px-6 py-4 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RealReachLogo size={28} />
            <div>
              <span className="font-bold text-white text-sm">Launch Campaign · Realreach</span>
              <p className="text-[11px] text-neutral-400">Campaign ID: {campaignId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
            aria-label="Close Order Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Campaign summary bar */}
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block">Territory</span>
                  <span className="font-bold text-white block mt-0.5">{campaignData.suburb}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Letterboxes</span>
                  <span className="font-bold text-emerald-400 font-mono block mt-0.5">
                    {campaignData.quantity.toLocaleString()} Homes
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Service</span>
                  <span className="font-bold text-white block mt-0.5">
                    {campaignData.serviceType === 'print_and_deliver' ? 'Print & Deliver' : 'Deliver Only'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Total Ex. GST</span>
                  <span className="font-bold text-white font-mono block mt-0.5">
                    ${campaignData.totalPrice.toLocaleString()} AUD
                  </span>
                </div>
              </div>

              {/* Agency contact details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Agency & Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Agency / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ray White Woollahra"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Contact Agent / Manager *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Chen"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Work Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="marcus@raywhite.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Mobile Number (For Live SMS Updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0412 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Target Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Artwork Upload (PDF / High-Res)
                    </label>
                    <label className="w-full flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-400 cursor-pointer hover:border-neutral-700">
                      <span className="truncate">{fileName || 'Choose PDF artwork...'}</span>
                      <FileUp className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.ai"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Special Territory / Delivery Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Focus on freestanding houses near local school, skip commercial strip."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

              </div>

              {/* Guarantees */}
              <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  No immediate charge. We confirm artwork pre-flight proofs, lock in runner routes, and issue a tax invoice upon dispatch.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Runners & Scheduling...</span>
                ) : (
                  <>
                    <span>Confirm Campaign & Reserve Route</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  CAMPAIGN CONFIRMED
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Run #{campaignId} Scheduled Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-md mx-auto">
                  We have assigned your {campaignData.quantity.toLocaleString()} flyers in {campaignData.suburb} to our local Reach Runner fleet. Confirmation and pre-flight proofs sent to {email}.
                </p>
              </div>

              {/* Live Tracking Link Box */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-left space-y-2">
                <span className="text-[11px] font-semibold text-neutral-400">
                  Your Vendor Live GPS Tracking URL:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://realreach.com.au/track/${campaignId.toLowerCase()}`}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400"
                  />
                  <button
                    onClick={copyLiveTrackingLink}
                    className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500">
                  Share this link with your property vendor so they can watch runners live.
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('live-gps');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-400 text-neutral-950 font-bold text-xs hover:bg-emerald-300 transition-colors cursor-pointer"
                >
                  View Live GPS Tracking Simulator
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition-colors cursor-pointer border border-neutral-800"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default OrderModal;
