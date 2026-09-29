import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import RealBuilderMap from '../components/RealBuilderMap';
import {
  ArrowLeft,
  Search,
  Trash2,
  Globe,
  Filter,
  Home,
  Layers,
  Plus,
  Share2,
  MessageSquare,
  User,
  Check,
  Building2,
  HelpCircle,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { createCampaign, estimateCampaign, changeCampaignStatus, syncBackendUser, PriceEstimate } from '../lib/api';
import { useUser } from '@clerk/clerk-react';

/** Step 1 body: area cards + step navigation. Extracted so each step is a clean subtree. */
const StepAreas: React.FC<{
  activeArea: number;
  setActiveArea: (n: number) => void;
  setStep: (n: 1 | 2 | 3) => void;
}> = ({ activeArea, setActiveArea, setStep }) => {
  const card = (n: number, title: string, meta: string, price: string, perItem: string, tint: string) => (
    <div
      onClick={() => setActiveArea(n)}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer mb-2.5 flex items-center justify-between ${
        activeArea === n ? 'border-black bg-slate-50 shadow-2xs' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg border flex items-center justify-center font-bold text-xs ${tint}`}>
          {n}
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">{title}</h4>
          <p className="text-[11px] text-slate-500">{meta}</p>
          <span className="text-[10px] text-blue-600 font-semibold underline">View addresses</span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-bold font-mono text-slate-900 block">{price}</span>
        <span className="text-[10px] text-slate-400">{perItem}</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
        <span className="h-5 w-5 rounded-full bg-black text-white text-[11px] flex items-center justify-center">1</span>
        <span>Create Areas</span>
      </div>

      {card(1, 'Milano Duomo', '1,100 Letterboxes • 9km', '€153.78', '€0.14 per item', 'bg-blue-50 border-blue-200 text-blue-600')}
      {card(2, 'Milano Brera & Navigli', '1,000 Letterboxes • 5km', '€91.75', '€0.09 per item', 'bg-emerald-50 border-emerald-200 text-emerald-600')}

      <div className="space-y-3 pt-2 text-xs text-slate-400 font-semibold">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex items-center gap-2 hover:text-black cursor-pointer"
        >
          <span className="h-5 w-5 rounded-full border border-slate-300 text-[11px] flex items-center justify-center">2</span>
          <span>Campaign Details</span>
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className="flex items-center gap-2 hover:text-black cursor-pointer"
        >
          <span className="h-5 w-5 rounded-full border border-slate-300 text-[11px] flex items-center justify-center">3</span>
          <span>Invoice Details</span>
        </button>
      </div>
    </div>
  );
};

export const CampaignBuilderPage: React.FC = () => {
  const { user: clerkUser } = useUser();
  const [selectedType, setSelectedType] = useState<'both' | 'houses' | 'units'>('both');
  const [activeArea, setActiveArea] = useState<number>(2);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('Milano Centro Drop');
  const [objective, setObjective] = useState('Property listing launch');
  const [startDate, setStartDate] = useState('2026-10-05');
  const [endDate, setEndDate] = useState('2026-10-12');
  const [channels, setChannels] = useState({ print: true, qr: true, sampling: false });
  const [budgetCap, setBudgetCap] = useState('1500');
  const [kpi, setKpi] = useState('Verified coverage ≥ 95%');
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<'draft' | 'submitted'>('draft');
  const [submitting, setSubmitting] = useState(false);
  const [drawnRings, setDrawnRings] = useState<number[][][] | null>(null);
  const [estResult, setEstResult] = useState<PriceEstimate | null>(null);
  const [estLoading, setEstLoading] = useState(false);

  // Live backend estimate whenever step 3 is reached with a drawn area.
  useEffect(() => {
    if (step !== 3 || !drawnRings) {
      setEstResult(null);
      return;
    }
    let cancelled = false;
    setEstLoading(true);
    estimateCampaign(drawnRings)
      .then((r) => { if (!cancelled) setEstResult(r); })
      .catch(() => { if (!cancelled) setEstResult(null); })
      .finally(() => { if (!cancelled) setEstLoading(false); });
    return () => { cancelled = true; };
  }, [step, drawnRings]);

  const toggleChannel = (c: keyof typeof channels) =>
    setChannels((prev) => ({ ...prev, [c]: !prev[c] }));

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError('');
    try {
      if (!clerkUser) throw new Error('Signed out. Please sign in again.');
      if (!drawnRings) throw new Error('Draw your target area on the map first.');
      const clientId = await syncBackendUser({
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? `${clerkUser.id}@realreach.it`,
        name: clerkUser.fullName ?? undefined,
        role: 'client',
      });
      const channelList = [channels.print && 'Print flyers', channels.qr && 'QR tracking', channels.sampling && 'Sampling']
        .filter(Boolean)
        .join(', ');
      const res = await createCampaign({
        client_id: clientId,
        title: title || 'Milano Drop',
        area_geojson: { type: 'Polygon', coordinates: drawnRings },
        activity_type: 'flyer_distribution',
        objective,
        start_date: startDate,
        end_date: endDate,
        budget_cap: Number(budgetCap) || undefined,
        instructions: `Channels: ${channelList || '—'}. KPI: ${kpi}.`,
      });
      setPublishedId(res.id);
      setCampaignStatus('draft');
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : 'Publish failed. Is the API running on :4000?');
    } finally {
      setPublishing(false);
    }
  };

  // Client submits the draft for operations approval.
  const handleSubmitForApproval = async () => {
    if (!publishedId || !clerkUser) return;
    setSubmitting(true);
    setPublishError('');
    try {
      await changeCampaignStatus(publishedId, 'submitted', { changed_by: clerkUser.id });
      setCampaignStatus('submitted');
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : 'Submit failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col font-sans overflow-hidden">
      
      {/* 1. TOP NAVBAR MATCHING IMAGE 7 & 8 */}
      <header className="h-14 bg-[#0a0a0b] border-b border-neutral-800 px-5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <RealReachLogo size={22} color="#ffffff" />
            <span className="text-base font-bold tracking-tight text-white">Realreach</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-400">
            <Link to="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <Link to="/distribution-portal" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Layers className="h-3.5 w-3.5" />
              <span>Activity</span>
            </Link>
            <Link to="/print" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Building2 className="h-3.5 w-3.5" />
              <span>Billing &amp; Print</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl bg-white text-black px-4 py-1.5 text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Book Delivery
          </button>
          <div className="flex items-center gap-2 text-neutral-400">
            <button className="p-1.5 hover:text-white transition-colors cursor-pointer" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:text-white transition-colors cursor-pointer" aria-label="Messages">
              <MessageSquare className="h-4 w-4" />
            </button>
            <div className="h-7 w-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white">
              MA
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN SPLIT: LEFT SIDEBAR + FULL MAP CANVAS */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT SIDEBAR: CAMPAIGN STEPS & AREAS (Matching Image 7 & 8) */}
        <div className="w-80 sm:w-96 bg-white text-[#0a0a0b] border-r border-slate-200 flex flex-col justify-between z-20 shadow-xl overflow-y-auto">
          
          <div className="p-5 space-y-6">
            
            {/* Header: Back arrow & Campaign Title */}
            <div className="flex items-center gap-3">
              <Link to="/" className="p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h2 className="text-xl font-bold text-[#0a0a0b] tracking-tight">Campaign 12-Jan</h2>
            </div>

            {/* Step 1: Create Areas */}
            {step === 1 && <StepAreas activeArea={activeArea} setActiveArea={setActiveArea} setStep={setStep} />}
            {/* End Step 1 */}

            {/* Step 2: Campaign Details */}
            {step === 2 && (
            <div className="animate-fadeIn">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-bold text-slate-400 hover:text-black mb-3 cursor-pointer"
              >
                &larr; Back to areas
              </button>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                <span className="h-5 w-5 rounded-full bg-black text-white text-[11px] flex items-center justify-center">2</span>
                <span>Campaign Details</span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-900 mb-1">Campaign title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-900 mb-1">Objective</label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-black cursor-pointer"
                  >
                    <option>Property listing launch</option>
                    <option>Store opening</option>
                    <option>Event promotion</option>
                    <option>Brand awareness</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-900 mb-1">Start</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-900 mb-1">End</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-black"
                    />
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-900 mb-1.5">Channels</span>
                  <div className="flex flex-wrap gap-2">
                    {(['print', 'qr', 'sampling'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleChannel(c)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                          channels[c] ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-300'
                        }`}
                      >
                        {c === 'print' ? 'Print flyers' : c === 'qr' ? 'QR tracking' : 'Sampling'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-900 mb-1">Budget cap (€)</label>
                    <input
                      value={budgetCap}
                      onChange={(e) => setBudgetCap(e.target.value)}
                      inputMode="decimal"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-900 mb-1">KPI</label>
                    <select
                      value={kpi}
                      onChange={(e) => setKpi(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-black cursor-pointer"
                    >
                      <option>Verified coverage ≥ 95%</option>
                      <option>Verified coverage ≥ 90%</option>
                      <option>Reach 10k letterboxes</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full py-3 rounded-xl bg-[#0a0a0b] text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Continue to invoice
                </button>
              </div>
            </div>
            )}
            {/* End Step 2 */}

            {/* Step 3: Invoice + Publish */}
            {step === 3 && (
            <div className="animate-fadeIn">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[11px] font-bold text-slate-400 hover:text-black mb-3 cursor-pointer"
              >
                &larr; Back to details
              </button>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                <span className="h-5 w-5 rounded-full bg-black text-white text-[11px] flex items-center justify-center">3</span>
                <span>Invoice Details</span>
              </div>

              {publishedId ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                  <p className="mt-2 text-sm font-extrabold text-slate-900">
                    {campaignStatus === 'draft' ? 'Draft saved' : 'Submitted for approval'}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 font-mono break-all">{publishedId}</p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    {campaignStatus === 'draft'
                      ? 'Review your plan, then send it to operations for approval.'
                      : 'Operations will approve the plan, then split it into tasks for operators.'}
                  </p>

                  {campaignStatus === 'draft' && (
                    <button
                      type="button"
                      onClick={handleSubmitForApproval}
                      disabled={submitting}
                      className="mt-4 w-full py-2.5 rounded-xl bg-[#0a0a0b] text-white text-xs font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>Submit for approval</span>
                    </button>
                  )}

                  <Link
                    to="/dashboard"
                    className="mt-3 block w-full py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Open dashboard
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  {[
                    ['Campaign', title || 'Milano Drop'],
                    ['Objective', objective],
                    ['Window', `${startDate} → ${endDate}`],
                    ['Channels', [channels.print && 'Print', channels.qr && 'QR', channels.sampling && 'Sampling'].filter(Boolean).join(' · ') || '—'],
                    ['Budget cap', `€${budgetCap}`],
                    ['KPI', kpi],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5">
                      <span className="font-semibold text-slate-500">{k}</span>
                      <span className="font-bold text-right">{v}</span>
                    </div>
                  ))}

                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-700">Live estimate</span>
                      {estLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />}
                    </div>
                    {estResult ? (
                      <div className="mt-1.5 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-sm font-extrabold text-slate-900 font-mono">€{estResult.price_total.toFixed(2)}</p>
                          <p className="text-[10px] text-slate-500">Total</p>
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-900 font-mono">{estResult.estimated_mailboxes}</p>
                          <p className="text-[10px] text-slate-500">Letterboxes</p>
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-900 font-mono">€{estResult.price_per_mailbox.toFixed(3)}</p>
                          <p className="text-[10px] text-slate-500">Per item</p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-[11px] text-blue-700">
                        {drawnRings ? 'Calculating…' : 'Draw the target area on the map to price it.'}
                      </p>
                    )}
                  </div>

                  {publishError && (
                    <p className="text-[11px] font-medium text-red-600">{publishError}</p>
                  )}

                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={publishing}
                    className="w-full py-3 rounded-xl bg-[#0a0a0b] text-white text-xs font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    {publishing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>{publishing ? 'Saving…' : 'Save draft campaign'}</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    Saves a draft in your organization. Submit it for approval next.
                  </p>
                </div>
              )}
            </div>
            )}
            {/* End Step 3 */}

          </div>

          {/* Help link at bottom */}
          <div className="p-4 border-t border-slate-200 text-center">
            <button className="text-xs text-slate-500 hover:text-black font-medium flex items-center justify-center gap-1.5 mx-auto">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Show help video</span>
            </button>
          </div>

        </div>

        {/* RIGHT: REAL MILAN MAP WITH DRAW CONTROL */}
        <div className="flex-1 relative bg-slate-200 overflow-hidden">

          {/* Real map — click Draw area, click corners, Finish */}
          <div className="absolute inset-0">
            <RealBuilderMap rings={drawnRings} onChange={setDrawnRings} />
          </div>

          {/* TOP ADDRESS SEARCH BAR & AREA PILL (Matching Image 7 & 8) */}
          <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4 pointer-events-none z-10">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-white text-slate-800 rounded-xl px-4 py-2.5 shadow-xl w-full max-w-md pointer-events-auto border border-slate-200">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                readOnly
                value="Search Milan address, zone or CAP..."
                className="w-full text-xs font-medium bg-transparent focus:outline-none cursor-default text-slate-600"
              />
            </div>

            {/* Area Address Counter Pill */}
            <div className="bg-white text-slate-900 rounded-xl px-4 py-2.5 shadow-xl border border-slate-200 pointer-events-auto flex items-center gap-2 text-xs font-bold">
              <span>Area 2: 1,018 addresses</span>
              <span className="text-slate-400 font-normal">(&#8962; 459 Houses, &#127970; 559 Units)</span>
            </div>
          </div>

          {/* LEFT MAP TOOLBAR ICONS (Matching Image 7 & 8) */}
          <div className="absolute top-24 left-5 bg-white text-slate-800 rounded-xl p-1.5 shadow-xl border border-slate-200 space-y-1 z-10 flex flex-col items-center">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Delete polygon">
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Satellite layer">
              <Globe className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Filter addresses">
              <Filter className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Residential only">
              <Home className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Multi-polygon">
              <Layers className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-black cursor-pointer" title="Add Area">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* FLOATING BOTTOM ESTIMATION CARDS & NEXT BUTTON (Matching Image 7 & 8) */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4">
            
            {/* The 3 Audience Selection Cards */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Option 1: Houses + Units */}
              <button
                type="button"
                onClick={() => setSelectedType('both')}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer text-left flex items-center gap-3.5 ${
                  selectedType === 'both'
                    ? 'bg-white text-slate-900 border-2 border-black shadow-2xl scale-102'
                    : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-white'
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Houses + Units</span>
                    <span className="text-sm font-extrabold font-mono text-slate-950">€270.09</span>
                  </div>
                  <span className="text-[11px] text-slate-500">2,100 Letterboxes &bull; incl. IVA</span>
                </div>
              </button>

              {/* Option 2: Houses Only */}
              <button
                type="button"
                onClick={() => setSelectedType('houses')}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer text-left flex items-center gap-3.5 ${
                  selectedType === 'houses'
                    ? 'bg-white text-slate-900 border-2 border-black shadow-2xl scale-102'
                    : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-white'
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Home className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Houses Only</span>
                    <span className="text-sm font-extrabold font-mono text-slate-950">€138.45</span>
                  </div>
                  <span className="text-[11px] text-slate-500">950 Letterboxes &bull; incl. IVA</span>
                </div>
              </button>

              {/* Option 3: Units Only */}
              <button
                type="button"
                onClick={() => setSelectedType('units')}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer text-left flex items-center gap-3.5 ${
                  selectedType === 'units'
                    ? 'bg-white text-slate-900 border-2 border-black shadow-2xl scale-102'
                    : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-white'
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Units Only</span>
                    <span className="text-sm font-extrabold font-mono text-slate-950">€155.69</span>
                  </div>
                  <span className="text-[11px] text-slate-500">1,150 Letterboxes &bull; incl. IVA</span>
                </div>
              </button>

            </div>

            {/* [Next] Button — advances the studio steps */}
            {step < 3 && (
            <button
              type="button"
              onClick={() => setStep(step === 1 ? 2 : 3)}
              className="rounded-2xl bg-[#0a0a0b] text-white px-10 py-4 text-base font-bold hover:bg-neutral-800 transition-all shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-103"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default CampaignBuilderPage;
