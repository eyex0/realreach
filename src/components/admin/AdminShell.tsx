import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Share2, LifeBuoy, CircleUser, Plus, Globe } from 'lucide-react';
import {
  readLocale, writeLocale, translator, formatEur, formatDate, formatNumber,
  formatKm, formatPercent, formatDateTime, formatRelative,
  type Locale, type Translate,
} from '../../lib/adminI18n';

/**
 * Shared admin state: locale, formatting and the current staff member.
 *
 * Formatting lives in context so no page can quietly render `en-US` currency or
 * an ISO date. The spec is Italian-first with an English toggle, EUR, IVA 22%,
 * DD/MM/YYYY and km, and those rules are enforced once, here.
 */
interface AdminContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translate;
  eur: (v: number | null | undefined) => string;
  date: (iso: string | null | undefined) => string;
  dateTime: (iso: string | null | undefined) => string;
  num: (v: number | null | undefined, decimals?: number) => string;
  km: (v: number | null | undefined) => string;
  percent: (v: number | null | undefined, decimals?: number) => string;
  relative: (iso: string | null | undefined) => string;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminShell>');
  return ctx;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('it');

  useEffect(() => {
    setLocaleState(readLocale());
  }, []);

  const value = useMemo<AdminContextValue>(() => {
    const setLocale = (l: Locale) => {
      setLocaleState(l);
      writeLocale(l);
    };
    const t = translator(locale);
    return {
      locale,
      setLocale,
      t,
      eur: (v) => formatEur(v, locale),
      date: (iso) => formatDate(iso, locale),
      dateTime: (iso) => formatDateTime(iso, locale),
      num: (v, d = 0) => formatNumber(v, locale, d),
      km: (v) => formatKm(v, locale),
      percent: (v, d = 1) => formatPercent(v, locale, d),
      relative: (iso) => formatRelative(iso, locale, t),
    };
  }, [locale]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

const TABS = [
  { href: '/admin', labelKey: 'nav.home', exact: true },
  { href: '/admin/campaigns', labelKey: 'nav.campaigns' },
  { href: '/admin/distributors', labelKey: 'nav.distributors' },
  { href: '/admin/billing', labelKey: 'nav.billing' },
  { href: '/admin/wishlist', labelKey: 'nav.wishlist' },
];

/** Paper plane with the sparkle, per the brand spec, at top-bar scale. */
function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <img src="/logo.png" width={size} height={size} alt="" className="object-contain invert" />
      <svg
        viewBox="0 0 12 12"
        width={size * 0.42}
        height={size * 0.42}
        className="absolute -right-1 -top-0.5"
        aria-hidden="true"
      >
        <path
          d="M6 0 L7.2 4.4 L12 6 L7.2 7.6 L6 12 L4.8 7.6 L0 6 L4.8 4.4 Z"
          fill="#fbbf24"
        />
      </svg>
    </span>
  );
}

function LocaleToggle() {
  const { locale, setLocale } = useAdmin();
  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'it' ? 'en' : 'it')}
      title="Italiano / English"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white cursor-pointer"
    >
      <Globe className="h-3.5 w-3.5" />
      {locale === 'it' ? 'IT' : 'EN'}
    </button>
  );
}

/**
 * The internal console shell: dark top bar, white content.
 *
 * Staff only, and deliberately a separate route tree from `/` and `/ops` so the
 * public site and the customer flow cannot be affected by anything in here.
 */
export function AdminShell({
  staffName,
  staffRole,
  children,
}: {
  staffName: string;
  staffRole: string;
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useAdmin();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-[#0a0a0b] text-white">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 sm:px-6">
          <Link to="/admin" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="text-[17px] font-semibold tracking-tight">
              Realreach
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {TABS.map((tab) => {
              const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={`relative px-3.5 py-4 text-[13px] font-medium transition-colors ${
                    active ? 'text-white' : 'text-white/60 hover:text-white/90'
                  }`}
                >
                  {t(tab.labelKey)}
                  {active && (
                    <span className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/campaigns/new')}
              className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#0a0a0b] transition-opacity hover:opacity-90 cursor-pointer sm:inline-flex"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('nav.newCampaign')}
            </button>
            <LocaleToggle />
            <button
              type="button"
              title={t('action.share')}
              className="rounded-full p-2 text-white/70 transition-colors hover:text-white cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              title={t('action.support')}
              className="rounded-full p-2 text-white/70 transition-colors hover:text-white cursor-pointer"
            >
              <LifeBuoy className="h-4 w-4" />
            </button>
            <span
              title={`${staffName} · ${staffRole}`}
              className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#0a0a0b]">
                {staffName.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden text-[11px] font-semibold text-white/80 lg:inline">
                {staffRole}
              </span>
            </span>
          </div>
        </div>

        {/* Mobile tabs: the top bar stays usable on a phone in the field. */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-white/10 px-3 pb-1 md:hidden">
          {TABS.map((tab) => {
            const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                to={tab.href}
                className={`whitespace-nowrap px-3 py-2 text-[12px] font-medium ${
                  active ? 'text-white' : 'text-white/60'
                }`}
              >
                {t(tab.labelKey)}
              </Link>
            );
          })}
        </nav>
      </header>

      <div>{children}</div>
    </div>
  );
}

export { AdminShell as default };
