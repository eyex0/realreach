import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Download, 
  ExternalLink, 
  Activity, 
  Building2, 
  User, 
  ShieldCheck, 
  FileText,
  Calendar,
  Layers
} from 'lucide-react';
import RealReachLogo from './RealReachLogo';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrder: () => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'analytics' | 'invoices'>('campaigns');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadReport = (campaignId: string) => {
    setDownloadSuccess(campaignId);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RealReachLogo size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base">REALREACH Client Portal</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 rounded px-1.5 py-0.5">
                  Live Agency Environment
                </span>
              </div>
              <p className="text-xs text-neutral-400">Engel &amp; Völkers &amp; Tecnocasa Milano Partner Workspace</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
            aria-label="Close Portal Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-neutral-950 border-b border-neutral-800 flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'campaigns'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Active &amp; Past Campaigns (3)
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Milan Agency Reach Analytics
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'invoices'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Billing &amp; Invoices (€)
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              
              {/* Active Campaign Card */}
              <div className="rounded-xl bg-neutral-900/90 border border-emerald-500/40 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-emerald-400">RUN #RR-8492 · ACTIVE IN FLIGHT</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">
                      Milano Centro &amp; Brera · Spring Listing Showcase
                    </h4>
                    <p className="text-xs text-neutral-400">Agent: Matteo Rossi · 8,500 Homes · 250 GSM Silk A5</p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">7,240 / 8,500</span>
                    <p className="text-[11px] text-neutral-400">85.2% Delivered · 3 Runners Active</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[85.2%] rounded-full transition-all duration-500" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-4 text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      Started Today 8:30 AM
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      99.8% Route Match
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        const el = document.getElementById('live-tracking');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Live Milan GPS</span>
                    </button>
                    <button
                      onClick={() => handleDownloadReport('RR-8492')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadSuccess === 'RR-8492' ? 'PDF Generating...' : 'Interim PDF Report'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Completed Campaign 1 */}
              <div className="rounded-xl bg-neutral-900/60 border border-neutral-800 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-neutral-400">RUN #RR-8120 · COMPLETED &amp; AUDITED</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">
                      Navigli &amp; Porta Ticinese · Just Listed Exclusive Drive
                    </h4>
                    <p className="text-xs text-neutral-400">Agent: Sofia Brambilla · 10,000 Homes · Solo Drop</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-white tabular-nums">10,000 / 10,000</span>
                    <p className="text-[11px] text-emerald-400">100% Completed · GPS Verified</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
                  <span>Delivered on 14 September 2026 · 4 Runners · 48 Streets</span>
                  <button
                    onClick={() => handleDownloadReport('RR-8120')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{downloadSuccess === 'RR-8120' ? 'Audit PDF Downloaded ✓' : 'Download Vendor Audit Pack (PDF)'}</span>
                  </button>
                </div>
              </div>

              {/* Completed Campaign 2 */}
              <div className="rounded-xl bg-neutral-900/60 border border-neutral-800 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-neutral-400">RUN #RR-7904 · COMPLETED &amp; AUDITED</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">
                      Porta Nuova &amp; Isola · Luxury Penthouse Appraisals
                    </h4>
                    <p className="text-xs text-neutral-400">Agent: Gianluca Colombo · 6,000 Homes · 250 GSM Silk</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-white tabular-nums">6,000 / 6,000</span>
                    <p className="text-[11px] text-emerald-400">100% Completed · GPS Verified</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
                  <span>Delivered on 02 September 2026 · 2 Runners · 31 Streets</span>
                  <button
                    onClick={() => handleDownloadReport('RR-7904')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{downloadSuccess === 'RR-7904' ? 'Audit PDF Downloaded ✓' : 'Download Vendor Audit Pack (PDF)'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-xs text-neutral-400">Total Letterboxes Reached</span>
                  <span className="text-2xl font-bold font-mono text-white block mt-1">24,500</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">+32% vs last month</span>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-xs text-neutral-400">Average GPS Audit Score</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 block mt-1">99.7%</span>
                  <span className="text-[10px] text-neutral-400 mt-1 block">Zero non-compliance flags</span>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-xs text-neutral-400">Average Drop Cost</span>
                  <span className="text-2xl font-bold font-mono text-white block mt-1">€0.108</span>
                  <span className="text-[10px] text-neutral-400 mt-1 block">Offset print + delivery</span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <h4 className="text-sm font-bold text-white">Top Performing Territory Zones in Milan</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-950">
                    <span className="text-neutral-300">Milano Centro: Duomo &amp; Brera (20121)</span>
                    <span className="font-mono text-emerald-400 font-bold">14 Appraisal Calls</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-950">
                    <span className="text-neutral-300">Milano Navigli &amp; Ticinese (20123)</span>
                    <span className="font-mono text-emerald-400 font-bold">11 Appraisal Calls</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-950">
                    <span className="text-neutral-300">Milano Porta Nuova &amp; Isola (20124)</span>
                    <span className="font-mono text-emerald-400 font-bold">8 Appraisal Calls</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-white">INV-RR-2026-089</span>
                  <p className="text-neutral-400 text-[11px]">Milano Centro &amp; Brera (8,500 Flyers)</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white">€1.133,00 EUR</span>
                  <span className="text-[10px] text-emerald-400 block">Paid via SEPA Direct Debit</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-white">INV-RR-2026-081</span>
                  <p className="text-neutral-400 text-[11px]">Navigli &amp; Ticinese Drop (10,000 Flyers)</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white">€1.452,00 EUR</span>
                  <span className="text-[10px] text-emerald-400 block">Paid via SEPA Direct Debit</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-5 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            Need a recurring weekly drop schedule? <span className="text-white font-medium">Contact your dedicated account manager</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenOrder();
            }}
            className="px-4 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg cursor-pointer"
          >
            Launch New Campaign
          </button>
        </div>

      </div>
    </div>
  );
};

export default ClientPortalModal;
