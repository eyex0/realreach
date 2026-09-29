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
      detail = (await res.json()).error ?? detail;
    } catch {
      /* non-JSON error body */
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
