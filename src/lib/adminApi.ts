import { API_BASE, apiFetch, handle } from './api';

export interface AdminOverview {
  window_months: number;
  currency: string;
  vat_rate: number;
  kpis: {
    active_campaigns: number;
    letterboxes_this_month: number;
    revenue_this_month: number;
    overdue_invoices: number;
    open_issues: number;
    active_distributors: number;
    distributors_total: number;
    distributors_verified: number;
  };
  map_pins: {
    id: string;
    title: string;
    status: string;
    client_name: string | null;
    areas: number;
    areas_done: number;
    letterboxes: number;
    lat: number;
    lng: number;
  }[];
  invoices: {
    id: string;
    number: string;
    status: string;
    total_eur: number | null;
    amount: number | null;
    vat_rate: number;
    due_date: string | null;
    issued_at: string;
    paid_at: string | null;
    campaign_title: string | null;
    client_name: string | null;
  }[];
  series: { period: string; letterboxes: number; campaigns: number; revenue: number }[];
  issues: {
    id: string;
    category: string;
    severity: string;
    status: string;
    description: string | null;
    created_at: string;
    campaign_title: string | null;
  }[];
}

export interface AdminCampaign {
  id: string;
  title: string;
  status: string;
  client_name: string | null;
  client_company: string | null;
  material: string | null;
  quantity: number | null;
  pickup_address: string | null;
  pickup_date: string | null;
  created_at: string;
  areas: number;
  areas_done: number;
  letterboxes: number;
  area_value: number;
}

export interface AdminArea {
  id: string;
  campaign_seq: number | null;
  quartiere: string | null;
  cap: string | null;
  status: string;
  letterboxes_total: number | null;
  houses: number | null;
  units: number | null;
  distance_km: number | null;
  price_eur: number | null;
  material: string | null;
  quantity: number | null;
  started_at: string | null;
  completed_at: string | null;
  accepted_at: string | null;
  picked_up_at: string | null;
  distributor_id: string | null;
  distributor_name: string | null;
  pieces_logged: number;
}

export interface AdminCampaignDetail {
  campaign: Record<string, unknown> & { id: string; title: string; status: string };
  areas: AdminArea[];
  notes: { id: string; body: string; created_at: string; author: string | null }[];
  issues: { id: string; category: string; status: string; description: string | null }[];
  invoices: { id: string; number: string; status: string; total_eur: number; due_date: string | null }[];
}

export interface AdminInvoice {
  id: string;
  number: string;
  status: string;
  subtotal_eur: number;
  vat_rate: number;
  vat_eur: number;
  total_eur: number | null;
  amount: number | null;
  due_date: string | null;
  issued_at: string;
  paid_at: string | null;
  campaign_title: string | null;
  client_name: string | null;
  client_email: string | null;
  overdue: boolean;
}

export interface AdminDistributor {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string;
  photo_url: string | null;
  phone: string | null;
  status: string;
  verification_status: string;
  service_areas: string[];
  rating: number | null;
  completed_jobs: number;
  active_jobs: number;
  letterboxes: number;
  open_issues: number;
}

export interface QuoteResponse {
  area_m2: number;
  letterboxes: number;
  material: string;
  surcharge_eur: number;
  price_per_letterbox: number;
  subtotal_eur: number;
  vat_rate: number;
  vat_eur: number;
  total_eur: number;
  currency: string;
  basis: string;
}

export interface DistanceCheck {
  distance_km: number;
  max_km: number;
  ok: boolean;
  message: string | null;
}

export async function getAdminOverview(months: 1 | 3 | 12): Promise<AdminOverview> {
  return handle<AdminOverview>(await apiFetch(`/admin/overview?months=${months}`));
}

export async function listAdminCampaigns(params: {
  status?: 'all' | 'active' | 'completed' | string;
  q?: string;
}): Promise<AdminCampaign[]> {
  const search = new URLSearchParams();
  if (params.status && params.status !== 'all') search.set('status', params.status);
  if (params.q) search.set('q', params.q);
  return handle<AdminCampaign[]>(await apiFetch(`/admin/campaigns?${search.toString()}`));
}

export async function getAdminCampaign(id: string): Promise<AdminCampaignDetail> {
  return handle<AdminCampaignDetail>(await apiFetch(`/admin/campaigns/${id}`));
}

export async function updateAdminCampaign(
  id: string,
  patch: { title?: string; status?: string }
): Promise<{ id: string; title: string; status: string }> {
  return handle(await apiFetch(`/admin/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  }));
}

export async function listAdminInvoices(): Promise<AdminInvoice[]> {
  return handle<AdminInvoice[]>(await apiFetch('/admin/invoices'));
}

export async function payInvoice(id: string): Promise<{ id: string; status: string }> {
  return handle(await apiFetch(`/admin/invoices/${id}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  }));
}

export async function listAdminDistributors(): Promise<AdminDistributor[]> {
  return handle<AdminDistributor[]>(await apiFetch('/admin/distributors'));
}

export async function listAdminIssues(status = 'open'): Promise<AdminIssue[]> {
  return handle<AdminIssue[]>(await apiFetch(`/admin/issues?status=${status}`));
}

export interface AdminIssue {
  id: string;
  category: string;
  severity: string;
  status: string;
  description: string | null;
  created_at: string;
  campaign_title: string | null;
  reporter_name?: string | null;
}

export async function quoteAreas(payload: {
  area_m2: number;
  material: string;
  targeting: 'houses_and_units' | 'houses_only' | 'units_only';
  houses?: number;
  units?: number;
}): Promise<QuoteResponse> {
  return handle<QuoteResponse>(await apiFetch('/admin/pricing/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }));
}

export async function validateAreaDistance(
  distance_km: number,
  max_km?: number
): Promise<DistanceCheck> {
  return handle<DistanceCheck>(await apiFetch('/admin/areas/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ distance_km, ...(max_km ? { max_km } : {}) }),
  }));
}

export { API_BASE };
