import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import {
  LayoutDashboard,
  Megaphone,
  BarChart3,
  Printer,
  Receipt,
  HelpCircle,
  Plus,
  LogOut,
  CheckCircle2,
  Clock,
  Send,
  MapPin,
  Split,
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { LiveCampaigns } from '../components/dashboard/LiveCampaigns';

type Tab = 'dashboard' | 'campaigns' | 'analytics' | 'billing' | 'support';

interface Area {
  name: string;
  letterboxes: string;
  km: string;
  price: string;
  perItem: string;
  coverage: number;
}

interface Campaign {
  name: string;
  tag: string;
  status: 'In flight' | 'Completed';
  areas: Area[];
  total: string;
}

const CAMPAIGNS: Campaign[] = [
  {
    name: 'Duomo & Brera · Spring Showcase',
    tag: 'Flyering',
    status: 'In flight',
    total: '€1,133.00',
    areas: [
      { name: 'Duomo & Brera', letterboxes: '2,900 Letterboxes', km: '9km', price: '€412.40', perItem: '€0.14 per item', coverage: 85 },
      { name: 'Quadrilatero', letterboxes: '2,750 Letterboxes', km: '8km', price: '€398.20', perItem: '€0.14 per item', coverage: 92 },
      { name: 'Porta Nuova', letterboxes: '2,850 Letterboxes', km: '10km', price: '€322.40', perItem: '€0.11 per item', coverage: 78 },
    ],
  },
  {
    name: 'Navigli & Ticinese · Just Listed',
    tag: 'Flyering',
    status: 'Completed',
    total: '€1,452.00',
    areas: [
      { name: 'Navigli & Porta Ticinese', letterboxes: '5,200 Letterboxes', km: '12km', price: '€756.00', perItem: '€0.15 per item', coverage: 100 },
      { name: 'Darsena & Tortona', letterboxes: '4,800 Letterboxes', km: '10km', price: '€696.00', perItem: '€0.15 per item', coverage: 100 },
    ],
  },
  {
    name: 'Porta Nuova & Isola · Penthouse',
    tag: 'Flyering',
    status: 'Completed',
    total: '€864.00',
    areas: [
      { name: 'Porta Nuova & Isola', letterboxes: '3,100 Letterboxes', km: '9km', price: '€449.50', perItem: '€0.15 per item', coverage: 99 },
      { name: 'Garibaldi & Corso Como', letterboxes: '2,900 Letterboxes', km: '8km', price: '€414.50', perItem: '€0.14 per item', coverage: 99 },
    ],
  },
];

const ACTIVITY = [
  { title: 'Run started today at 8:30 AM', detail: 'Duomo & Brera · 3 runners active' },
  { title: 'Proof approved for Navigli & Ticinese', detail: 'Coverage 100% · Yesterday' },
  { title: 'Invoice INV-RR-2026-081 paid', detail: '€1,452.00 via SEPA Direct Debit' },
  { title: '5,000 flyers sent to print', detail: '250 GSM Silk · CityLife & Portello' },
];

const INVOICES = [
  { id: 'INV-RR-2026-089', desc: 'Duomo & Brera (8,500 flyers)', amount: '€1,133.00', status: 'Paid via SEPA Direct Debit', paid: true },
  { id: 'INV-RR-2026-081', desc: 'Navigli & Ticinese (10,000 flyers)', amount: '€1,452.00', status: 'Paid via SEPA Direct Debit', paid: true },
  { id: 'INV-RR-2026-092', desc: 'CityLife & Portello (5,000 flyers)', amount: '€712.00', status: 'Due 12 October 2026', paid: false },
];

const MONTHLY_FLYERS = [9.5, 26, 4, 2, 2, 3, 5, 16, 8, 3, 2, 1.5];

export const DashboardPage: React.FC = () => {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSent, setSupportSent] = useState(false);
  const [requests, setRequests] = useState([
    { title: 'Could I please have help with this Run?', detail: 'Duomo & Brera · Updated 18 minutes ago', status: 'Open' },
  ]);

  const displayName = clerkUser?.fullName ?? clerkUser?.primaryEmailAddress?.emailAddress ?? 'there';
  const displayEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? '';
  const firstName = displayName.split(' ')[0];
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;
    setRequests([{ title: supportMsg.trim(), detail: 'Just now', status: 'Open' }, ...requests]);
    setSupportMsg('');
    setSupportSent(true);
    setTimeout(() => setSupportSent(false), 3000);
  };

  const chartPoints = MONTHLY_FLYERS.map((v, i) => `${(i * 600) / (MONTHLY_FLYERS.length - 1)},${170 - (v / 26) * 150}`).join(' ');

  const menuItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Megaphone className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
  ];
  const serviceItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'billing', label: 'Billing', icon: <Receipt className="h-4 w-4" /> },
    { id: 'support', label: 'Support', icon: <HelpCircle className="h-4 w-4" /> },
  ];

  const renderNavButton = (id: Tab, label: string, icon: React.ReactNode) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer text-sm ${
        tab === id ? 'bg-slate-100 text-black font-bold' : 'font-semibold text-slate-600 hover:bg-slate-100 hover:text-black'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#0a0a0b] flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-60 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-4 shrink-0">
        <div>
          <Link to="/" className="flex items-center gap-2.5 px-3 py-3 mb-6">
            <RealReachLogo size={24} color="#0a0a0b" />
            <span className="font-bold text-base tracking-tight">Realreach</span>
          </Link>

          <nav className="space-y-1">
            {menuItems.map((item) => renderNavButton(item.id, item.label, item.icon))}
          </nav>

          <p className="px-3 mt-6 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Services</p>
          <nav className="space-y-1">
            <Link
              to="/print"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-black transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Store</span>
            </Link>
            <Link
              to="/distribution-portal"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-black transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>Distribution</span>
            </Link>
          </nav>

          <p className="px-3 mt-6 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Account</p>
          <nav className="space-y-1">
            {serviceItems.map((item) => renderNavButton(item.id, item.label, item.icon))}
          </nav>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{displayName}</p>
              <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-black transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1300px] mx-auto w-full overflow-y-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {tab === 'dashboard' ? `Welcome back, ${firstName}` : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </h1>
          <div className="flex items-center gap-2">
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link
              to="/ops"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Split className="h-4 w-4" />
              <span>Operations console</span>
            </Link>
            <Link
              to="/campaigns/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-5 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create new campaign</span>
            </Link>
          </div>
        </div>

        {/* Mobile tab switcher */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto">
          {(['dashboard', 'campaigns', 'analytics', 'billing', 'support'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap cursor-pointer ${
                tab === t ? 'bg-black text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Overview KPI cards */}
              <section className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h2 className="text-sm font-bold mb-4">Overview</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500 font-medium">Total campaigns</p>
                    <p className="text-2xl sm:text-3xl font-bold font-mono mt-1">12</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500 font-medium">Flyers distributed</p>
                    <p className="text-2xl sm:text-3xl font-bold font-mono mt-1">88.3k</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500 font-medium">Avg. verified coverage</p>
                    <p className="text-2xl sm:text-3xl font-bold font-mono mt-1 text-emerald-600">96%</p>
                  </div>
                </div>
              </section>

              {/* Active campaigns */}
              <section className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold">
                    Active campaigns{' '}
                    <span className="ml-1 text-[11px] font-bold bg-slate-100 rounded-full px-2 py-0.5">
                      {CAMPAIGNS.filter((c) => c.status === 'In flight').length}
                    </span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setTab('campaigns')}
                    className="text-xs font-semibold text-slate-500 hover:text-black cursor-pointer"
                  >
                    View all &gt;
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {CAMPAIGNS.map((c) => (
                    <div key={c.name} className="p-4 rounded-xl border border-slate-200">
                      <p className="text-[11px] text-slate-500 font-medium">{c.tag}</p>
                      <p className="text-sm font-bold mt-0.5">{c.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {c.areas.length} areas · {c.total} · {c.status}
                      </p>
                      <button
                        type="button"
                        onClick={() => setTab('campaigns')}
                        className="mt-3 w-full py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:border-black transition-colors cursor-pointer"
                      >
                        View Dashboard
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              {/* Recent activity */}
              <section className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold">Recent activity</h2>
                  <button
                    type="button"
                    onClick={() => setTab('campaigns')}
                    className="text-xs font-semibold text-slate-500 hover:text-black cursor-pointer"
                  >
                    View all &gt;
                  </button>
                </div>
                <ul className="space-y-4">
                  {ACTIVITY.map((a) => (
                    <li key={a.title} className="flex gap-3 text-xs">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <Clock className="h-3 w-3 text-slate-500" />
                      </span>
                      <div>
                        <p className="font-bold">{a.title}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{a.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Help card */}
              <section className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h2 className="text-sm font-bold">Have any questions?</h2>
                <p className="text-xs text-slate-500 mt-1">Schedule a consultation with our Milan success team.</p>
                <Link
                  to="/contact"
                  className="mt-3 block w-full py-2 rounded-xl border border-slate-200 text-xs font-semibold text-center hover:border-black transition-colors"
                >
                  Schedule now
                </Link>
              </section>
            </div>
          </div>
        )}

        {tab === 'campaigns' && (
          <div className="space-y-6">
            <LiveCampaigns />

            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider pt-2">
              Previous runs · sample data
            </p>
            {CAMPAIGNS.map((c) => (
              <section key={c.name} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">{c.tag}</p>
                    <h2 className="text-base font-bold">{c.name}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold">{c.total}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        c.status === 'In flight' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
                <ul className="divide-y divide-slate-50">
                  {c.areas.map((a) => (
                    <li key={a.name} className="p-4 sm:p-5 flex flex-wrap items-center gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <MapPin className="h-5 w-5 text-slate-500" />
                      </span>
                      <div className="flex-1 min-w-[160px]">
                        <p className="text-sm font-bold">{a.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {a.letterboxes} · {a.km}
                        </p>
                        <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${a.coverage >= 99 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${a.coverage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-sm">{a.price}</p>
                        <p className="text-[11px] text-slate-500">{a.perItem}</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> {a.coverage}% verified
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {tab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">Quality</p>
                <h3 className="text-sm font-bold">Run outcomes</h3>
                <div className="mt-4 flex items-center gap-5">
                  <div className="relative h-28 w-28 shrink-0">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={`${0.91 * 339.3} 339.3`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold">91%</span>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Successful</span>
                      <span className="font-mono font-bold">79</span>
                    </li>
                    <li className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Failed</span>
                      <span className="font-mono font-bold">8</span>
                    </li>
                    <li className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> In flight</span>
                      <span className="font-mono font-bold">1</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">Last 12 months</p>
                <h3 className="text-sm font-bold">Flyers distributed</h3>
                <svg viewBox="0 0 600 180" className="mt-3 w-full h-44" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="flyersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0a0a0b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0a0a0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[45, 90, 135].map((y) => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  ))}
                  <polygon points={`0,180 ${chartPoints} 600,180`} fill="url(#flyersFill)" />
                  <polyline points={chartPoints} fill="none" stroke="#0a0a0b" strokeWidth="2.5" strokeLinejoin="round" />
                  {MONTHLY_FLYERS.map((v, i) => (
                    <circle
                      key={i}
                      cx={(i * 600) / (MONTHLY_FLYERS.length - 1)}
                      cy={170 - (v / 26) * 150}
                      r="4"
                      fill="#fff"
                      stroke="#0a0a0b"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-3">Top performing zones in Milan</h3>
              <div className="space-y-2 text-xs">
                {[
                  ['Duomo & Brera (20121)', '14 appraisal calls'],
                  ['Navigli & Ticinese (20123)', '11 appraisal calls'],
                  ['Porta Nuova & Isola (20124)', '8 appraisal calls'],
                ].map(([zone, stat]) => (
                  <div key={zone} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                    <span className="font-semibold">{zone}</span>
                    <span className="font-mono text-emerald-700 font-bold">{stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'billing' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#0a0a0b] text-white shadow-sm">
                <p className="text-[11px] text-neutral-400 font-medium">Available credits</p>
                <p className="text-3xl font-bold font-mono mt-1">€0.00</p>
                <p className="text-[11px] text-neutral-400 mt-1">Credits apply automatically to your next run.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <p className="text-[11px] text-slate-500 font-medium">Payment method</p>
                <p className="text-sm font-bold mt-1">SEPA Direct Debit •• 4821</p>
                <p className="text-[11px] text-slate-400 mt-1">Invoices are debited automatically on their due date.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100">
              {INVOICES.map((inv) => (
                <div key={inv.id} className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-mono font-bold">{inv.id}</p>
                    <p className="text-slate-500 text-[11px]">{inv.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold">{inv.amount}</p>
                    <p className={`text-[11px] font-semibold ${inv.paid ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {inv.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'support' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold">New request</h3>
              <p className="text-[11px] text-slate-500 mt-1">Typically replies within a couple of hours · Mon–Fri, 9am–6pm CET</p>
              <form onSubmit={handleSupportSubmit} className="mt-4 space-y-3">
                <textarea
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                  placeholder="How can we help with your run?"
                  rows={4}
                  className="w-full rounded-xl bg-[#f3f4f6] border border-transparent focus:border-slate-400 focus:bg-white px-4 py-3 text-sm outline-none resize-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-5 py-2.5 text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{supportSent ? 'Request sent ✓' : 'Send request'}</span>
                </button>
              </form>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-3">Your requests</h3>
              <div className="space-y-2">
                {requests.map((req, i) => (
                  <div key={`${req.title}-${i}`} className="p-3.5 rounded-xl bg-slate-50 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold">{req.title}</p>
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">{req.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
