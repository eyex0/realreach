// Tiny client for the Realreach backend API.
// Base URL defaults to the local dev API; override with VITE_API_URL.

const env = (import.meta as unknown as { env?: Record<string, string> }).env ?? {};
export const API_BASE = env.VITE_API_URL ?? 'http://127.0.0.1:4000';

export interface PriceEstimate {
  area_m2: number;
  estimated_mailboxes: number;
  price_per_mailbox: number;
  price_total: number;
  note?: string;
}

export interface CampaignSummary {
  id: string;
  title: string;
  status: string;
  activity_type?: string;
  objective?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget_cap?: number | null;
  price_total: number | null;
  area_m2: number | null;
  created_at: string;
  updated_at?: string;
}

export interface CampaignCreatePayload {
  client_id: string;
  title: string;
  area_geojson: { type: 'Polygon'; coordinates: number[][][] };
  activity_type?: string;
  objective?: string;
  start_date?: string;
  end_date?: string;
  budget_cap?: number;
  instructions?: string;
}

export interface CampaignStatusHistoryEntry {
  previous_status: string;
  new_status: string;
  changed_by: string | null;
  reason: string | null;
  changed_at: string;
}

export interface CampaignDetail extends CampaignSummary {
  instructions?: string | null;
  org_id?: string | null;
  submitted_at?: string | null;
  approved_at?: string | null;
  area_geojson?: { type: string; coordinates: number[][][] };
  locations: Array<{ id: string; address: string; label?: string | null; postal_code?: string | null }>;
  task_counts: Array<{ status: string; count: number }>;
  history: CampaignStatusHistoryEntry[];
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Stateless backend estimate for a GeoJSON Polygon ring set. */
export async function estimateCampaign(rings: number[][][]): Promise<PriceEstimate> {
  const res = await apiFetch(`/campaigns/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ area_geojson: { type: 'Polygon', coordinates: rings } }),
  });
  return handle<PriceEstimate>(res);
}

/** Campaign list, optionally scoped to an organization. */
export async function listCampaigns(orgId?: string): Promise<CampaignSummary[]> {
  const qs = orgId ? `?org_id=${encodeURIComponent(orgId)}` : '';
  const res = await apiFetch(`/campaigns${qs}`);
  return handle<CampaignSummary[]>(res);
}

/** Full campaign detail: area, target locations, task counts, status history. */
export async function getCampaign(id: string): Promise<CampaignDetail> {
  const res = await apiFetch(`/campaigns/${id}`);
  return handle<CampaignDetail>(res);
}

/** Create a draft campaign with the full planning payload. */
export async function createCampaign(payload: CampaignCreatePayload): Promise<CampaignDetail> {
  const res = await apiFetch(`/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handle<CampaignDetail>(res);
}

/** Edit planning fields (only while draft/submitted â€” API enforces). */
export async function updateCampaign(
  id: string,
  fields: Partial<Pick<CampaignCreatePayload, 'title' | 'objective' | 'activity_type' | 'start_date' | 'end_date' | 'budget_cap' | 'instructions'>> & { changed_by?: string }
): Promise<CampaignSummary> {
  const res = await apiFetch(`/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  return handle<CampaignSummary>(res);
}

/** Forward-only lifecycle transition (server + DB enforce the state machine). */
export async function changeCampaignStatus(
  id: string,
  to_status: string,
  opts: { changed_by?: string; reason?: string; org_id?: string } = {}
): Promise<{ id: string; status: string }> {
  const res = await apiFetch(`/campaigns/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to_status, ...opts }),
  });
  return handle(res);
}

/** Bulk import of target addresses. */
export async function addCampaignLocations(
  id: string,
  locations: Array<{ address: string; label?: string; postal_code?: string; lat?: number; lon?: number }>
): Promise<{ imported: number }> {
  const res = await apiFetch(`/campaigns/${id}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locations }),
  });
  return handle(res);
}

// Demo identities are gone. The backend UUID for a Clerk user is resolved
// via POST /auth/sync (matched by email) and cached per Clerk user id.
export interface BackendUser {
  id: string;
  email: string;
  role: string;
}

export async function syncBackendUser(opts: {
  clerkId: string;
  email: string;
  name?: string;
  role?: 'client' | 'walker';
}): Promise<string> {
  const cacheKey = `rr_uid_${opts.clerkId}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;
  const res = await apiFetch(`/auth/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: opts.email, full_name: opts.name ?? opts.email, role: opts.role ?? 'client' }),
  });
  const user = await handle<BackendUser>(res);
  localStorage.setItem(cacheKey, user.id);
  return user.id;
}

export function clearBackendUserCache(clerkId: string) {
  localStorage.removeItem(`rr_uid_${clerkId}`);
}

export interface TaskItem {
  id: string;
  campaign_id: string;
  campaign_title?: string;
  walker_id: string | null;
  status: 'available' | 'assigned' | 'accepted' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  campaign_seq?: number | null;
  started_at: string | null;
  completed_at: string | null;
  assigned_at?: string | null;
}

export interface OperatorRow {
  id: string;
  email: string;
  display_name?: string | null;
  full_name?: string | null;
  status: string;
  rating_avg?: number | null;
  active_tasks: number;
  pending_review: number;
  availability_today?: 'available' | 'unavailable' | null;
}

/** Grid-split a campaign into tasks (ops action, approved/planned only). */
export async function splitCampaign(
  id: string,
  rows: number,
  cols: number,
  opts: { replace?: boolean; changed_by?: string } = {}
): Promise<{ created: number }> {
  const res = await apiFetch(`/campaigns/${id}/split`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows, cols, ...opts }),
  });
  return handle(res);
}

/** Ops assigns an unclaimed task to one operator (no reassignment). */
export async function assignTask(
  taskId: string,
  operatorId: string,
  assignedBy?: string
): Promise<TaskItem> {
  const res = await apiFetch(`/tasks/${taskId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operator_id: operatorId, assigned_by: assignedBy }),
  });
  return handle<TaskItem>(res);
}

/** Operator pool with workload + availability. */
export async function listOperators(): Promise<OperatorRow[]> {
  const res = await apiFetch(`/operators`);
  return handle<OperatorRow[]>(res);
}

export async function listTasks(status?: string, campaignId?: string): Promise<TaskItem[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (campaignId) params.set('campaign_id', campaignId);
  const qs = params.toString();
  const res = await apiFetch(`/tasks${qs ? `?${qs}` : ''}`);
  return handle<TaskItem[]>(res);
}

export async function createTask(campaignId: string, rings: number[][][]): Promise<TaskItem> {
  const res = await apiFetch(`/campaigns/${campaignId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sub_area: { type: 'Polygon', coordinates: rings } }),
  });
  return handle<TaskItem>(res);
}

export async function updateTask(id: string, status: string, walkerId?: string): Promise<TaskItem> {
  const res = await apiFetch(`/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, walker_id: walkerId }),
  });
  return handle<TaskItem>(res);
}

export async function submitProof(id: string, coverage?: number): Promise<{ id: string }> {
  const res = await apiFetch(`/tasks/${id}/proofs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coverage_percentage: coverage }),
  });
  return handle(res);
}

export interface ProofCheck {
  key: string;
  label: string;
  required: boolean;
  passed: boolean;
  detail?: string;
}

export interface TrustComponent {
  key: string;
  label: string;
  weight: number;
  value: number;
  detail: string;
}

export interface ProofQueueItem {
  id: string;
  task_id: string;
  campaign_id: string;
  campaign_seq: number | null;
  campaign_title: string;
  task_status: string;
  walker_id: string | null;
  coverage_percentage: number | null;
  review_status: string;
  submitted_at: string;
  verification_status: string | null;
  reason_code: string | null;
  checks: ProofCheck[] | null;
  evidence_count: number;
  /** Data trust (Priority 2). null = not scored by this trust version. */
  confidence: number | null;
  freshness: number | null;
  trust_version: string | null;
  trust_components: TrustComponent[] | null;
  data_reports: number;
}

export type DataReportKind =
  | 'bad_photo'
  | 'bad_quantity'
  | 'bad_location'
  | 'wrong_task'
  | 'missing_data'
  | 'other';

export interface DataReport {
  id: string;
  kind: DataReportKind;
  subject_type: 'proof' | 'task' | 'campaign';
  subject_id: string | null;
  note: string | null;
  status: 'open' | 'acknowledged' | 'resolved' | 'dismissed';
  resolution_note?: string | null;
  reporter_email?: string;
  reports_on_subject?: number;
  created_at: string;
}

/** File a bad-data report. Anyone who can see the data can flag it. */
export async function createDataReport(payload: {
  kind: DataReportKind;
  subject_type: 'proof' | 'task' | 'campaign';
  subject_id?: string;
  note?: string;
}): Promise<DataReport> {
  const res = await apiFetch('/data-reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handle<DataReport>(res);
}

export async function listDataReports(status?: string): Promise<DataReport[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const res = await apiFetch(`/data-reports?${params.toString()}`);
  return handle<DataReport[]>(res);
}

export async function updateDataReport(
  id: string,
  status: DataReport['status'],
  resolution_note?: string
): Promise<{ id: string; status: string }> {
  const res = await apiFetch(`/data-reports/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, resolution_note }),
  });
  return handle<{ id: string; status: string }>(res);
}

export async function listProofs(reviewStatus?: string, campaignId?: string): Promise<ProofQueueItem[]> {
  const params = new URLSearchParams();
  if (reviewStatus) params.set('review_status', reviewStatus);
  if (campaignId) params.set('campaign_id', campaignId);
  const res = await apiFetch(`/proofs?${params.toString()}`);
  return handle<ProofQueueItem[]>(res);
}

export async function reviewProof(
  id: string,
  decision: 'approved' | 'rejected',
  reason?: string
): Promise<{ id: string; decision: string }> {
  const res = await apiFetch(`/proofs/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, reason }),
  });
  return handle(res);
}

export interface ReportOverviewItem {
  id: string;
  title: string;
  status: string;
  activity_type: string | null;
  area_m2: number | null;
  tasks_total: number;
  tasks_approved: number;
  tasks_rejected: number;
  tasks_in_progress: number;
  pieces: number;
  proofs_pending: number;
  proofs_approved: number;
  payout_estimate: number;
  payout_rate_per_piece: number;
}

export interface CampaignReport {
  campaign: {
    id: string;
    title: string;
    status: string;
    objective?: string | null;
    area_m2: number | null;
    estimated_mailboxes?: number | null;
    budget_cap: number | null;
    start_date: string | null;
    end_date: string | null;
  };
  progress: { by_status: Record<string, number>; total: number };
  evidence: Record<string, { count: number; quantity: number }>;
  proofs: { review_status: string; count: number }[];
  verification: { status: string; count: number }[];
  route: { points: number; sessions: number; distance_km: number; duration_minutes: number };
  payout: { pieces: number; rate_per_piece: number; estimate: number };
  estimate: { area_m2: number; estimated_mailboxes: number; price_per_mailbox: number; price_total: number };
  tasks: Array<{
    id: string;
    campaign_seq: number | null;
    status: string;
    walker_name: string | null;
    pieces: number;
    evidence_count: number;
    verification_status: string | null;
    started_at: string | null;
    completed_at: string | null;
  }>;
  /** Per-area detail for the client-facing report, with the route analysis. */
  areas: CampaignArea[];
  trust: { scored: number; avg_confidence: number | null; avg_freshness: number | null; open_data_reports: number };
}

/** One leg of a walked route, coloured on the map by walking speed. */
export interface RouteSegment {
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  distance_m: number;
  duration_s: number;
  speed_kmh: number;
  band: 'stationary' | 'normal' | 'slightly_fast' | 'very_fast' | 'extremely_fast';
  flags: string[];
}

export interface CampaignArea {
  task_id: string;
  sequence: number | null;
  status: string;
  distributor: string | null;
  started_at: string | null;
  completed_at: string | null;
  pieces_logged: number;
  evidence_count: number;
  verification_status: string | null;
  confidence: number | null;
  /** Derived: this area's share of the campaign estimate, by area size. */
  estimated_letterboxes: number;
  letterbox_basis: string;
  route: {
    points: number;
    distance_km: number;
    average_speed_kmh: number;
    max_speed_kmh: number;
    anomalies: number;
    anomaly_share: number;
    segments: RouteSegment[];
  };
}

export async function listReports(): Promise<ReportOverviewItem[]> {
  const res = await apiFetch(`/reports/overview`);
  return handle<ReportOverviewItem[]>(res);
}

export async function getCampaignReport(id: string): Promise<CampaignReport> {
  const res = await apiFetch(`/reports/campaign/${id}`);
  return handle<CampaignReport>(res);
}

export interface PayoutRow {
  id: string;
  operator_id: string;
  operator_name: string;
  operator_email: string;
  campaign_id: string | null;
  campaign_title: string | null;
  pieces: number;
  rate_eur: number;
  amount_eur: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  generated_at: string;
  paid_at: string | null;
}

export async function listPayouts(filter?: { campaign_id?: string; operator_id?: string; status?: string }): Promise<PayoutRow[]> {
  const params = new URLSearchParams();
  if (filter?.campaign_id) params.set('campaign_id', filter.campaign_id);
  if (filter?.operator_id) params.set('operator_id', filter.operator_id);
  if (filter?.status) params.set('status', filter.status);
  const res = await apiFetch(`/payouts?${params.toString()}`);
  return handle<PayoutRow[]>(res);
}

export async function generatePayouts(campaignId: string): Promise<{ operators: number; skipped_paid: number; rate_per_piece: number }> {
  const res = await apiFetch(`/payouts/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaign_id: campaignId }),
  });
  return handle(res);
}

export async function approvePayout(id: string): Promise<{ id: string; status: string }> {
  const res = await apiFetch(`/payouts/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  return handle(res);
}

export async function payPayout(id: string): Promise<{ id: string; status: string }> {
  const res = await apiFetch(`/payouts/${id}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  return handle(res);
}

let tokenProvider: (() => Promise<string | null>) | null = null;

/** Injected by <TokenBridge/> once Clerk has a session (Stage 9 hardening). */
export function setClerkTokenProvider(fn: (() => Promise<string | null>) | null): void {
  tokenProvider = fn;
}

/** All backend calls funnel through here so the session token rides along. */
async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(init.headers ?? {})) headers[k] = String(v);
  if (tokenProvider) {
    try {
      const token = await tokenProvider();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    } catch {
      // token unavailable (signed out) — protected routes will answer 401
    }
  }
  return fetch(`${API_BASE}${path}`, { ...init, headers });
}

export interface ProofDetail extends ProofQueueItem {
  task_status: string;
  coverage_percentage: number | null;
  evidence: Array<{
    id: string;
    kind: string;
    content: string | null;
    quantity: number | null;
    mime_type: string | null;
    captured_at: string | null;
    review_status: string | null;
    sync_state: string | null;
  }>;
  route: { points: number; sessions: number; duration_seconds: number };
  verification: Array<{
    id: string;
    status: string;
    reason_code: string | null;
    checks: ProofCheck[] | null;
    confidence: number | null;
    freshness: number | null;
    trust_version: string | null;
    trust_components: TrustComponent[] | null;
    /** Freshness recomputed at read time, so a stored score never goes stale. */
    freshness_now: number | null;
    reviewed_by: string | null;
    reviewed_at: string | null;
    created_at: string;
  }>;
}

export async function getProofDetail(id: string): Promise<ProofDetail> {
  const res = await apiFetch(`/proofs/${id}`);
  return handle<ProofDetail>(res);
}

/** Fetch protected bytes (e.g. proof photos) with the session token. */
export async function fetchBlob(path: string): Promise<Blob> {
  const headers: Record<string, string> = {};
  if (tokenProvider) {
    try {
      const token = await tokenProvider();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    } catch {
      /* fall through — /sync stays public */
    }
  }
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`failed to load ${path} (${res.status})`);
  return res.blob();
}
