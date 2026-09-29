import { API_BASE } from './api';

export interface IcpTemplate {
  id: string;
  name: string;
  description: string | null;
  countries: string[];
  industries: string[];
  employee_min: number | null;
  employee_max: number | null;
  required_signals: string[];
  target_roles: string[];
  exclusions: string[];
  template_key: string;
}

export interface Icp {
  id: string;
  name: string;
  description: string | null;
  countries: string[];
  industries: string[];
  employee_min: number | null;
  employee_max: number | null;
  required_signals: string[];
  target_roles: string[];
  technologies: string[];
  exclusions: string[];
  is_template: boolean;
  created_at: string;
}

export interface ScoreComponent {
  key: string;
  label: string;
  weight: number;
  value: number;
  points: number;
  detail: string;
}

export interface FeedItem {
  id: string;
  title: string;
  status: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  score_breakdown: ScoreComponent[];
  rationale: string;
  next_action: string;
  recommended_role: string | null;
  saved: boolean;
  ignored: boolean;
  score_version: string;
  company_id: string;
  canonical_name: string;
  domain: string | null;
  country: string | null;
  city: string | null;
  industry: string | null;
  employee_count: number | null;
  source_provider: string;
  last_refreshed_at: string;
  match_confidence: number;
  icp_name: string;
  signal_id: string | null;
  signal_type: string | null;
  signal_title: string | null;
  signal_url: string | null;
  signal_confidence: number | null;
}

export interface Activation {
  org_id: string;
  org_name: string | null;
  discovery_runs: number;
  saved_opportunities: number;
  approved_outreach: number;
  activated_at: string | null;
  activated: boolean;
  steps: { key: string; label: string; target: number; current: number; done: boolean }[];
}

export interface OpportunityDetail {
  opportunity: FeedItem & {
    source_license: string | null;
    technologies: string[];
    icp_name: string;
  };
  signals: {
    id: string;
    type: string;
    title: string;
    summary: string | null;
    source_provider: string;
    source_url: string | null;
    evidence: unknown[];
    confidence: number;
    detected_at: string;
  }[];
  contacts: {
    id: string;
    full_name: string;
    title: string | null;
    source_provider: string;
    source_type: string;
    lawful_basis: string;
    confidence: number;
    verification_status: string;
    suppressed: boolean;
    suppression_reason: string | null;
    last_verified_at: string | null;
  }[];
  activity: { id: string; kind: string; body: string | null; created_at: string; actor: string | null }[];
  notes: { id: string; body: string; created_at: string; author: string | null }[];
  tasks: { id: string; title: string; due_at: string | null; done: boolean }[];
  outreach: { id: string; channel: string; language: string; subject: string | null; body: string; status: string; evidence: unknown[]; word_count: number; created_at: string }[];
}

/**
 * Every platform call carries the signed-in backend user id.
 *
 * In required mode the API ignores it and uses the token identity, which is
 * what enforces tenant isolation. In local optional mode it is how the API
 * resolves the caller's organization, mirroring every other route here.
 */
let userId: string | null = null;

export function setPlatformUser(id: string | null): void {
  userId = id;
}

function authQuery(extra: Record<string, string> = {}): string {
  const params = new URLSearchParams(extra);
  if (userId) params.set('user_id', userId);
  return params.toString();
}

function authBody(body: Record<string, unknown>): string {
  return JSON.stringify(userId ? { ...body, user_id: userId } : body);
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `${res.status}`;
    try {
      const body = await res.json();
      detail = body.error ?? detail;
      if (Array.isArray(body.violations) && body.violations.length > 0) {
        // Claim violations are data, not just a message: the UI shows the user
        // exactly which words the evidence does not support.
        throw Object.assign(new Error(body.detail ?? detail), { violations: body.violations });
      }
    } catch (e) {
      if (e instanceof Error && 'violations' in e) throw e;
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function listTemplates(): Promise<IcpTemplate[]> {
  return handle<IcpTemplate[]>(await fetch(`${API_BASE}/platform/icps/templates`));
}

export async function listIcps(): Promise<Icp[]> {
  return handle<Icp[]>(await fetch(`${API_BASE}/platform/icps?${authQuery()}`));
}

export async function createIcp(payload: { name: string; template_key?: string; description?: string }): Promise<Icp> {
  return handle<Icp>(
    await fetch(`${API_BASE}/platform/icps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody(payload),
    })
  );
}

export async function runDiscovery(icpId: string, limit = 25): Promise<{ run: { matched: number; created_count: number; duration_ms: number }; matched: number; created: number }> {
  return handle(
    await fetch(`${API_BASE}/platform/discovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody({ icp_id: icpId, limit }),
    })
  );
}

export async function getFeed(view: 'feed' | 'saved' = 'feed'): Promise<FeedItem[]> {
  const data = await handle<{ items: FeedItem[] }>(
    await fetch(`${API_BASE}/platform/opportunities?${authQuery({ view })}`)
  );
  return data.items;
}

export async function getOpportunity(id: string): Promise<OpportunityDetail> {
  return handle<OpportunityDetail>(await fetch(`${API_BASE}/platform/opportunities/${id}?${authQuery()}`));
}

export async function markOpportunity(id: string, action: 'save' | 'unsave' | 'ignore'): Promise<void> {
  await handle(
    await fetch(`${API_BASE}/platform/opportunities/${id}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody({}),
    })
  );
}

export async function addOpportunityNote(id: string, body: string): Promise<void> {
  await handle(
    await fetch(`${API_BASE}/platform/opportunities/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody({ body }),
    })
  );
}

export async function getActivation(): Promise<Activation> {
  return handle<Activation>(await fetch(`${API_BASE}/platform/activation?${authQuery()}`));
}

export interface OutreachEvidence {
  signal_id: string;
  type: string;
  title: string;
  source_url: string | null;
  confidence: number;
}

export interface OutreachDraft {
  id: string;
  opportunity_id: string;
  contact_id: string | null;
  channel: string;
  language: string;
  subject: string | null;
  body: string;
  status: string;
  evidence: OutreachEvidence[];
  word_count: number;
  created_at: string;
  approved_at?: string | null;
  omitted_signals?: number;
}

export interface ClaimViolation {
  claim: string;
  reason: 'number_not_in_evidence' | 'entity_not_in_evidence';
}

export async function createOutreachDraft(
  opportunityId: string,
  opts: { language?: 'en' | 'it' | 'de'; tone?: 'direct' | 'warm' } = {}
): Promise<OutreachDraft> {
  return handle<OutreachDraft>(
    await fetch(`${API_BASE}/platform/opportunities/${opportunityId}/outreach/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody(opts),
    })
  );
}

export async function editOutreachDraft(id: string, body: string): Promise<OutreachDraft> {
  return handle<OutreachDraft>(
    await fetch(`${API_BASE}/platform/outreach/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: authBody({ body }),
    })
  );
}

export async function approveOutreach(id: string): Promise<{ id: string; status: string }> {
  return handle<{ id: string; status: string }>(
    await fetch(`${API_BASE}/platform/outreach/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody({}),
    })
  );
}

export async function rejectOutreach(id: string, reason?: string): Promise<{ id: string; status: string }> {
  return handle<{ id: string; status: string }>(
    await fetch(`${API_BASE}/platform/outreach/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody({ reason }),
    })
  );
}

export interface AppNotification {
  id: string;
  kind: 'signal' | 'score_change' | 'contact_change' | 'task_due' | 'digest' | string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export interface CompanyWatch {
  id: string;
  company_id: string;
  canonical_name: string;
  domain: string | null;
  country: string | null;
  last_checked_at: string | null;
  last_notified_score: number | null;
}

export interface MonitoringResult {
  watched: number;
  signals: number;
  score_changes: number;
  contact_changes: number;
  task_reminders: number;
  digest_created: boolean;
  notified: number;
}

export async function listNotifications(): Promise<AppNotification[]> {
  return handle<AppNotification[]>(await fetch(`${API_BASE}/notifications?${authQuery()}`));
}

export async function markNotificationRead(id: string): Promise<void> {
  await handle(
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody({}),
    })
  );
}

export async function listWatches(): Promise<CompanyWatch[]> {
  return handle<CompanyWatch[]>(await fetch(`${API_BASE}/platform/watches?${authQuery()}`));
}

export async function watchCompany(companyId: string): Promise<void> {
  await handle(
    await fetch(`${API_BASE}/platform/watches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody({ company_id: companyId }),
    })
  );
}

export async function runMonitoringNow(digest = false): Promise<MonitoringResult> {
  return handle<MonitoringResult>(
    await fetch(`${API_BASE}/platform/monitoring/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: authBody({ digest }),
    })
  );
}
