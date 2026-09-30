/**
 * Admin console locale.
 *
 * Italian is the default because the team and the market are Italian. English
 * is a toggle, not a second codebase: every string lives in one dictionary, and
 * a missing key falls back to Italian rather than showing a raw key to a user.
 *
 * Formatting is centralised here on purpose. EUR, DD/MM/YYYY, decimal comma and
 * km are the things that get subtly wrong when each component does its own.
 */

export type Locale = 'it' | 'en';

const STORAGE_KEY = 'rr_admin_locale';

type Dict = Record<string, string>;

const IT: Dict = {
  'nav.home': 'Home',
  'nav.campaigns': 'Campagne',
  'nav.distributors': 'Distributori',
  'nav.billing': 'Fatturazione',
  'nav.newCampaign': 'Nuova campagna',
  'action.share': 'Condividi',
  'action.support': 'Assistenza',
  'action.profile': 'Profilo',

  'kpi.activeCampaigns': 'Campagne attive',
  'kpi.letterboxesMonth': 'Volantini consegnati questo mese',
  'kpi.revenueMonth': 'Ricavi (mese)',
  'kpi.overdueInvoices': 'Fatture scadute',
  'kpi.openIssues': 'Segnalazioni aperte',

  'home.deliveryMap': 'Mappa consegne',
  'home.activeDeliveryCampaigns': 'campagne di consegna attive',
  'home.openLiveMap': 'Apri la mappa live',
  'home.invoices': 'Fatture',
  'home.viewAllInvoices': 'Vedi tutte le fatture',
  'home.activity': 'Attività',
  'home.range': 'Periodo',
  'home.emptyTitle': 'Ancora nessuna campagna',
  'home.emptyBody': 'Crea la prima campagna per vedere consegne, copertura e fatturazione.',
  'home.createFirst': 'Crea la prima campagna',

  'invoices.campaign': 'Campagna',
  'invoices.client': 'Cliente',
  'invoices.amount': 'Importo',
  'invoices.due': 'Scadenza',
  'invoices.status': 'Stato',
  'invoices.viewPay': 'Vedi e paga',
  'invoices.markPaid': 'Segna come pagata',
  'invoices.overdue': 'Scaduta',
  'invoices.paid': 'Pagata',
  'invoices.sent': 'Inviata',
  'invoices.draft': 'Bozza',
  'invoices.cancelled': 'Annullata',
  'invoices.none': 'Nessuna fattura in questo periodo.',
  'invoices.issued': 'Emessa',
  'invoices.vat': 'IVA',

  'common.deliveries': 'Consegne',
  'common.revenue': 'Ricavi',
  'common.viewAll': 'Vedi tutto',
  'common.loading': 'Caricamento…',
  'common.days': 'giorni',
  'common.areas': 'aree',
  'common.via': 'Via',
  'common.distance': 'Distanza',
  'common.status': 'Stato',
  'common.assigned': 'Assegnato',
  'common.unassigned': 'Non assegnato',
  'common.search': 'Cerca cliente, campagna, quartiere…',
  'common.all': 'Tutte',
  'common.active': 'Attive',
  'common.completed': 'Completate',
  'common.campaign': 'Campagna',
  'common.created': 'Creata',
  'common.noAccess': 'Accesso riservato al team Realreach',
  'common.back': 'Indietro',
  'common.save': 'Salva',
  'common.close': 'Chiudi',
  'common.more': 'Altro',
};

const EN: Dict = {
  'nav.home': 'Home',
  'nav.campaigns': 'Campaigns',
  'nav.distributors': 'Distributors',
  'nav.billing': 'Billing',
  'nav.newCampaign': 'New campaign',
  'action.share': 'Share',
  'action.support': 'Support',
  'action.profile': 'Profile',

  'kpi.activeCampaigns': 'Active campaigns',
  'kpi.letterboxesMonth': 'Letterboxes delivered this month',
  'kpi.revenueMonth': 'Revenue (month)',
  'kpi.overdueInvoices': 'Overdue invoices',
  'kpi.openIssues': 'Open issues',

  'home.deliveryMap': 'Delivery map',
  'home.activeDeliveryCampaigns': 'active delivery campaigns',
  'home.openLiveMap': 'Open the live map',
  'home.invoices': 'Invoices',
  'home.viewAllInvoices': 'View all invoices',
  'home.activity': 'Activity',
  'home.range': 'Range',
  'home.emptyTitle': 'No campaigns yet',
  'home.emptyBody': 'Create the first campaign to see deliveries, coverage and billing.',
  'home.createFirst': 'Create your first campaign',

  'invoices.campaign': 'Campaign',
  'invoices.client': 'Client',
  'invoices.amount': 'Amount',
  'invoices.due': 'Due',
  'invoices.status': 'Status',
  'invoices.viewPay': 'View & Pay',
  'invoices.markPaid': 'Mark paid',
  'invoices.overdue': 'Overdue',
  'invoices.paid': 'Paid',
  'invoices.sent': 'Sent',
  'invoices.draft': 'Draft',
  'invoices.cancelled': 'Cancelled',
  'invoices.none': 'No invoices in this period.',
  'invoices.issued': 'Issued',
  'invoices.vat': 'VAT',

  'common.deliveries': 'Deliveries',
  'common.revenue': 'Revenue',
  'common.viewAll': 'View all',
  'common.loading': 'Loading…',
  'common.days': 'days',
  'common.areas': 'areas',
  'common.via': 'Via',
  'common.distance': 'Distance',
  'common.status': 'Status',
  'common.assigned': 'Assigned',
  'common.unassigned': 'Unassigned',
  'common.search': 'Search client, campaign, district…',
  'common.all': 'All',
  'common.active': 'Active',
  'common.completed': 'Completed',
  'common.campaign': 'Campaign',
  'common.created': 'Created',
  'common.noAccess': 'Realreach staff only',
  'common.back': 'Back',
  'common.save': 'Save',
  'common.close': 'Close',
  'common.more': 'More',
};

const DICTS: Record<Locale, Dict> = { it: IT, en: EN };

export function readLocale(): Locale {
  if (typeof window === 'undefined') return 'it';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'en' || stored === 'it' ? stored : 'it';
}

export function writeLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, locale);
}

export type Translate = (key: string) => string;

export function translator(locale: Locale): Translate {
  const dict = DICTS[locale];
  return (key: string) => dict[key] ?? IT[key] ?? key;
}

// ------------------------------------------------------------- formatters

const LOCALE_TAG: Record<Locale, string> = { it: 'it-IT', en: 'en-GB' };

/** EUR, Italian formatting: 1.234,56 € */
export function formatEur(value: number | null | undefined, locale: Locale = 'it'): string {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value));
}

/** DD/MM/YYYY, or DD/MM/YYYY in English too: the spec asks for it regardless. */
export function formatDate(iso: string | null | undefined, locale: Locale = 'it'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return locale === 'it' ? `${dd}/${mm}/${yyyy}` : `${dd}/${mm}/${yyyy}`;
}

export function formatDateTime(iso: string | null | undefined, locale: Locale = 'it'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${formatDate(iso, locale)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Italian decimal comma, as used in the source data. */
export function formatNumber(value: number | null | undefined, locale: Locale = 'it', decimals = 0): string {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value));
}

export function formatKm(value: number | null | undefined, locale: Locale = 'it'): string {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${formatNumber(value, locale, 1)} km`;
}

export function formatPercent(value: number | null | undefined, locale: Locale = 'it', decimals = 1): string {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${formatNumber(value * 100, locale, decimals)}%`;
}

/** "3 days ago" / "3 giorni fa" */
export function formatRelative(iso: string | null | undefined, locale: Locale = 'it', t: Translate = translator(locale)): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const days = Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
  if (days === 0) return locale === 'it' ? 'oggi' : 'today';
  if (days === 1) return locale === 'it' ? 'ieri' : 'yesterday';
  return `${formatNumber(days, locale)} ${t('common.days')}`;
}
