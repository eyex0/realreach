# RealReach — Context for Every Part

Reusable context for every major part of the product. Paste the relevant
section into a developer brief, an AI coding prompt, Notion, Linear, or a PR
description.

Each section states: purpose · user story · inputs · outputs · data needed ·
business rules · technical notes · acceptance criteria.

Scope for the shipped pilot (field-ops letterbox distribution) is tracked in
[`../TASKS.md`](../TASKS.md); this document defines the wider platform.

---

## 0. Global product context

RealReach is an AI-native B2B business-development platform. It helps
companies discover the right businesses, understand active opportunities,
identify decision-makers, generate evidence-based outreach, and manage
opportunities until they become revenue.

It is not a traditional CRM, lead database, or simple email-automation tool.

**Core promise:** "Discover the right companies. Understand the opportunity.
Reach the right people."

**User journey**

1. User defines an ideal customer profile.
2. RealReach finds relevant companies.
3. RealReach detects business signals.
4. RealReach explains why each company is an opportunity.
5. RealReach recommends decision-makers.
6. RealReach drafts personalized outreach using evidence only.
7. User reviews and approves outreach.
8. RealReach tracks replies and monitors new signals.

**Core principles**

- Opportunity-first, not lead-first.
- Every AI recommendation must show evidence.
- Company data and personal data must be separated.
- Data provenance, freshness, and confidence are mandatory.
- GDPR compliance is a product feature.
- Agents assist users; outbound sending requires approval by default.
- The product must feel modern, fast, precise, and premium.

---

## 1. Organizations and workspaces

**Purpose** — allow companies to use RealReach as a multi-tenant SaaS product
with separate data, members, permissions, billing, and settings.

**User story** — as a company owner, I want to create an organization and
workspace, so my team can collaborate on opportunities without mixing data with
other customers.

**Inputs** — organization name · workspace name · user email · user name · plan
type · team members · roles

**Outputs** — organization · one or more workspaces · users and memberships ·
role assignments · workspace settings · audit events

**Data model**

```
Organization
├── Users
├── Workspaces
├── Roles
├── Billing account
├── Credit balance
├── API keys
└── Audit logs
```

**Business rules**

- Every record must belong to an organization.
- Users can belong to multiple organizations.
- A workspace must always have an owner.
- Users cannot access data from another organization.
- Roles determine what users can view, edit, approve, or administer.
- Deleting an organization requires owner confirmation.

**Technical notes**

- Enforce `organization_id` on every tenant-owned query.
- Use row-level security or service-layer checks.
- Log creation, invitation, role change, and deletion events.

**Acceptance criteria** — user can create an organization and a workspace ·
user can invite teammates · user roles restrict access correctly · one
organization cannot access another organization's data · all major actions are
audit-logged.

---

## 2. Authentication and roles

**Purpose** — secure access to RealReach and control what each user can do.

**User story** — as an admin, I want to control user permissions, so only
authorized people can access contacts, outreach, billing, and settings.

| Role | Permissions |
| --- | --- |
| Owner | Everything, including billing and deletion |
| Admin | Users, settings, integrations, data policies |
| Manager | Pipelines, opportunities, team assignments |
| Member | Discovery, opportunities, contacts, outreach |
| Viewer | Read-only access |

**Business rules**

- Owners cannot be removed by non-owners.
- Every organization must retain at least one owner.
- Contact data requires stricter access control than company data.
- All access to contact PII must be logged.
- API keys must be scoped to an organization.

**Acceptance criteria** — users can sign up and log in · password reset works ·
Google login works · roles restrict access correctly · contact access is
audit-logged · invalid or expired sessions are rejected.

---

## 3. Company discovery

**Purpose** — help users find relevant companies using filters,
natural-language ICPs, and structured search.

**User story** — as a sales leader, I want to search for Italian manufacturing
companies with 50–500 employees, so I can find businesses that match my ideal
customer profile.

**Inputs** — country · region/city · industry · employee range · revenue range
(if available) · technology · company status · keywords · required signals ·
exclusions

**Outputs** — list of companies · company count · filters applied · search
metadata · exportable results · saved search

**Data needed** — company legal name · domain · country · industry · employee
band · registration data · website · technologies · data source · last refreshed
date

**Business rules**

- Search must return only companies visible to the current workspace.
- Every company field must show its source.
- Missing data must be shown as "unknown," not invented.
- Search results must be paginated.
- Users must be able to save searches.

**Technical notes** — start with PostgreSQL full-text search and structured
filters · add pgvector semantic search after structured search works · index
country, industry, employee band, and domain.

**Acceptance criteria** — user can search by country, industry, and employee
range · results are accurate and paginated · company profile opens from results ·
source attribution is visible · search can be saved and rerun.

---

## 4. Natural-language ICP

**Purpose** — let users describe their ideal customer in plain language instead
of building filters manually.

**User story** — as a founder, I want to type "Find Italian appliance companies
expanding into Germany that are hiring customer-service staff," so RealReach can
create a targeted company list for me.

**Input** — free-text prompt, e.g.

```text
Find 100 Italian appliance companies with 50–500 employees
that are expanding internationally
and may need AI customer-service solutions.
```

**Output** — structured ICP object

```json
{
  "countries": ["IT"],
  "industries": ["appliances", "consumer electronics"],
  "employeeMin": 50,
  "employeeMax": 500,
  "requiredSignals": ["EXPANSION", "HIRING"],
  "targetRoles": ["Customer Service", "Support", "Operations"],
  "maxResults": 100
}
```

**Business rules** — the LLM converts language into filters · the LLM must not
invent companies · the user must be able to review and edit the generated
filters · the system must show estimated credit cost before running · the
discovery run must be traceable.

**Acceptance criteria** — user can enter a free-text ICP · system generates
structured filters · user can edit filters before running · system shows
estimated cost · search uses the confirmed filters.

---

## 5. Data ingestion

**Purpose** — collect, normalize, and store company, signal, and person data
from approved sources.

**User story** — as a data engineer, I want a reliable ingestion pipeline, so
RealReach always has fresh, traceable, and deduplicated company data.

**Inputs** — registry APIs · licensed firmographic providers · company websites ·
news APIs · jobs APIs · funding APIs · technology-detection providers

**Outputs** — raw source records · normalized company records · normalized
signal records · data-quality metrics · refresh schedules · failure reports

**Data flow**

```text
Source
→ Raw record
→ Validation
→ Normalization
→ Deduplication
→ Entity resolution
→ Enrichment
→ Search index
→ Customer-facing record
```

**Business rules**

- Every record must store its source.
- Every record must store retrieval and publication timestamps.
- Raw data must be retained separately from normalized data.
- Conflicts must not silently overwrite existing data.
- Crawling must respect robots.txt and provider terms.

**Acceptance criteria** — data can be ingested from selected providers · raw and
normalized data are stored separately · duplicate companies are merged or
flagged · failed jobs retry · source and timestamp are visible for key fields ·
refresh schedule works.

---

## 6. Entity resolution

**Purpose** — ensure the same real-world company is not stored as multiple
separate companies.

**User story** — as a user, I want "Company X S.r.l." and "Company X SpA" to be
recognized as the same company, so I do not see duplicate opportunities.

**Inputs** — company names · registration numbers · VAT/tax IDs · domains ·
addresses · locations · industry · source records

**Outputs** — canonical company record · match confidence · merge suggestions ·
source-record links · duplicate warnings

**Business rules**

- Exact domain, VAT, or registry-ID matches should auto-link.
- Fuzzy matches require review or confidence thresholds.
- Original source records must never be deleted.
- Merges must be reversible or auditable.

**Acceptance criteria** — duplicates are detected · high-confidence matches are
linked · low-confidence matches are flagged · source records remain traceable ·
users can review suggested merges.

---

## 7. Signal engine

**Purpose** — turn raw data into meaningful business events that indicate a
possible buying window.

**User story** — as a sales user, I want to see when a company is hiring
customer-service staff or expanding abroad, so I know when it may need my
solution.

**Signal types** — `HIRING` · `EXPANSION` · `FUNDING` · `LEADERSHIP_CHANGE` ·
`TECH_ADOPTION` · `PRODUCT_LAUNCH` · `PARTNERSHIP` · `ACQUISITION` ·
`PROCUREMENT` · `NEWS`

**Inputs** — job postings · news articles · company-website changes · funding
databases · registry updates · technology-detection data

**Output**

```json
{
  "companyId": "cmp_123",
  "type": "HIRING",
  "title": "Hiring Customer Support Specialist in Berlin",
  "summary": "Company opened a customer-support role in Berlin.",
  "source": { "provider": "jobs_connector", "url": "https://company.com/careers/123" },
  "confidence": 0.92,
  "detectedAt": "2026-09-29",
  "publishedAt": "2026-09-24"
}
```

**Business rules**

- Every signal must have evidence.
- Every signal must have a source URL or provider reference.
- Signals must have confidence and freshness scores.
- Duplicate signals must be removed.
- Signals must expire or lose relevance over time.
- The AI cannot create a signal that does not exist in the database.

**Acceptance criteria** — hiring, expansion, and funding signals are detected ·
signals show evidence and source links · duplicate signals are filtered ·
signal freshness affects opportunity score.

---

## 8. ICP and opportunity scoring

**Purpose** — determine whether a company is a relevant opportunity and explain
why.

**User story** — as a sales user, I want to see why a company scored 82, so I
can decide whether to contact it.

**Inputs** — company data · signals · ICP · contact availability · data
freshness · user-specific weights

**Output**

```json
{
  "companyId": "cmp_123",
  "score": 82,
  "priority": "HIGH",
  "scoreBreakdown": [
    { "factor": "ICP fit", "points": 30 },
    { "factor": "Hiring signal", "points": 30 },
    { "factor": "Expansion signal", "points": 20 },
    { "factor": "Contact identified", "points": 20 },
    { "factor": "Freshness", "points": 10 }
  ],
  "rationale": "This company is expanding into Germany and hiring customer-support roles.",
  "evidence": []
}
```

**Business rules** — scoring must be deterministic and versioned · AI explains
the score, it does not invent it · every score component must be visible · users
can override priority manually · score must update when relevant signals change.

**Acceptance criteria** — opportunities are created from ICP matches · scores are
calculated consistently · breakdown is visible · evidence is linked to each
reason · score recalculates when signals change.

---

## 9. AI research agent

**Purpose** — automatically research a company and produce a concise,
evidence-backed intelligence profile.

**User story** — as a sales user, I want RealReach to research a company for me,
so I do not have to manually read its website, news, and job postings.

**Inputs** — company ID · website · news · job postings · funding data ·
registry data · technology data

**Output**

```json
{
  "summary": "...",
  "industry": "...",
  "products": [],
  "technologies": [],
  "signals": [],
  "risks": [],
  "evidence": []
}
```

**Business rules** — the agent must only use supplied sources · every claim must
link to evidence · missing information must be labeled "unknown" · output must be
validated against a schema · each run must record cost, duration, model, and
prompt version.

**Acceptance criteria** — agent researches a company · output is structured and
valid · every claim has evidence · no unsupported claims appear · run cost and
duration are tracked.

---

## 10. AI qualification agent

**Purpose** — explain why a company is relevant, why now, and what the next
action should be.

**User story** — as a sales user, I want RealReach to explain why a company is a
good opportunity, so I can prioritize my outreach.

**Inputs** — company profile · ICP · deterministic score · signals · evidence ·
recommended contacts

**Output**

```json
{
  "whyRelevant": "...",
  "whyNow": "...",
  "likelyProblem": "...",
  "recommendedContactRole": "Head of Customer Operations",
  "recommendedNextAction": "Contact Head of Customer Operations",
  "evidence": []
}
```

**Business rules** — the agent explains the existing score, it does not replace
it · every statement must reference evidence · if evidence is missing, the agent
must say so · users must be able to mark explanations useful or not useful.

**Acceptance criteria** — agent explains relevance and timing · recommendations
are actionable · evidence is cited · unsupported claims are blocked · users can
provide feedback.

---

## 11. Contact discovery

**Purpose** — identify relevant decision-makers for each opportunity.

**User story** — as a sales user, I want RealReach to recommend the right person
to contact, so I do not waste time messaging the wrong person.

**Inputs** — company ID · ICP target roles · contact database · company website ·
licensed contact provider · user-uploaded contacts

**Output**

```json
{
  "name": "Maria Rossi",
  "title": "Head of Customer Operations",
  "companyId": "cmp_123",
  "email": "licensed_or_user_provided",
  "linkedinUrl": "licensed_or_user_provided",
  "confidence": 0.85,
  "source": "licensed_provider",
  "lawfulBasis": "legitimate_interest"
}
```

**Business rules** — do not scrape LinkedIn directly · use licensed providers or
user-provided data · every contact must have source, confidence, and lawful
basis · suppressed contacts must never be recommended · contact access must be
audit-logged.

**Acceptance criteria** — system recommends relevant contacts · contacts are
ranked by relevance · source and confidence are visible · suppressed contacts
are excluded · PII access is logged.

---

## 12. AI outreach agent

**Purpose** — generate personalized outreach based on verified company signals.

**User story** — as a sales user, I want a personalized email draft based on a
company's hiring and expansion signals, so I can send relevant outreach quickly.

**Inputs** — opportunity · company profile · signals · contact · user tone
preferences · language preference

**Output**

```json
{
  "subject": "Scaling customer support in Germany",
  "body": "Hi Maria, I noticed Company X is hiring customer-support specialists in Berlin..."
}
```

**Business rules** — use only facts from supplied evidence · maximum 90 words ·
mention one specific signal · make one clear ask · do not invent funding,
expansion, hiring, or product facts · the user must approve before sending ·
support English, Italian, and German.

**Acceptance criteria** — AI generates an email draft · draft uses only supplied
evidence · evidence links are shown · user can edit the draft · draft cannot be
sent without approval.

---

## 13. Opportunity workspace

**Purpose** — let users manage opportunities from discovery to closed revenue.

**User story** — as a sales user, I want to track opportunities, tasks, and next
actions, so I can manage my pipeline in one place.

**Inputs** — opportunity · company · contact · signals · notes · tasks ·
outreach · owner

**Pipeline stages**

```text
Discovered
→ Qualified
→ Contact identified
→ Outreach drafted
→ Contacted
→ Engaged
→ Meeting booked
→ Active opportunity
→ Won / Lost
```

**Business rules** — only workspace members can access workspace opportunities ·
every stage change must be logged · tasks can be assigned · opportunities must
retain signal history.

**Acceptance criteria** — users can save opportunities · change stages · add
notes and tasks · activity timeline is complete · users can filter and export.

---

## 14. Monitoring agent

**Purpose** — continuously watch saved companies and alert users when something
relevant changes.

**User story** — as a sales user, I want to be alerted when a saved company
raises funding or hires for a relevant role, so I can act at the right time.

**Inputs** — saved companies · watchlists · signal sources · user ICP · alert
preferences

**Outputs** — new signal alerts · score-change alerts · contact-change alerts ·
email/in-app notifications · updated opportunity timeline

**Business rules** — monitoring runs on a schedule · alerts must be based on new
or materially changed signals · users configure alert frequency · alerts link to
the opportunity and evidence · suppressed companies and contacts are excluded.

**Acceptance criteria** — users can watch companies · new signals trigger alerts
· score changes trigger alerts · alerts link to evidence · notification
preferences work.

---

## 15. Outreach delivery

**Purpose** — send approved outreach reliably and track engagement.

**User story** — as a sales user, I want to send approved emails and see replies,
so I can manage conversations without leaving RealReach.

**Inputs** — approved outreach message · contact · sending mailbox · sending
domain · user approval

**Outputs** — sent email · delivery status · open status · reply status · bounce
status · unsubscribe status

**Business rules** — AI drafts require user approval before sending · suppressed
contacts cannot be emailed · bounced addresses must be suppressed · unsubscribed
contacts must be excluded · sending limits and warm-up rules must be enforced.

**Acceptance criteria** — approved emails can be sent · drafts cannot be sent
without approval · replies are detected · bounces update contact status ·
unsubscribes are honored.

---

## 16. Billing and credits

**Purpose** — monetize RealReach through subscriptions and usage-based credits.

**User story** — as a workspace owner, I want to see my plan, credits, and usage,
so I can control costs and upgrade when needed.

| Plan | Price | Credits |
| --- | --- | --- |
| Starter | €49/month | 500 |
| Pro | €149/month | 2,000 |
| Business | €399/month | 10,000 |

| Action | Credits |
| --- | --- |
| Company search | 1 |
| Company research | 5 |
| Contact lookup | 3 |
| AI qualification | 2 |
| Outreach draft | 1 |
| Monitoring refresh | 2 |

**Business rules** — actions cannot run without enough credits · credit usage is
logged per workspace · subscription and usage are visible · failed actions should
not charge credits · admins can adjust credits manually.

**Acceptance criteria** — users can subscribe through Stripe · credits are
deducted correctly · usage dashboard is accurate · insufficient credits block
paid actions · invoices and receipts work.

---

## 17. GDPR and data governance

**Purpose** — ensure RealReach can operate legally in the EU and protect
personal data.

**User story** — as a compliance officer, I want to know where every contact came
from and how it can be deleted, so RealReach can operate compliantly in Europe.

**Inputs** — contact records · source metadata · lawful basis · retention rules ·
suppression requests · deletion requests

**Outputs** — suppression list · deletion confirmations · DSAR exports · audit
logs · retention reports · data-processing records

**Business rules** — company data and personal data must be separated · every
contact must have source, timestamp, and lawful basis · suppressed contacts
cannot be used for outreach · deletion requests must remove or anonymize PII ·
access to contact PII must be logged · data minimization is mandatory.

**Acceptance criteria** — contacts have source and lawful basis · users can
suppress, delete and export contacts · DSAR export works · PII access is logged.

---

## 18. Admin and operations

**Purpose** — allow the RealReach team to operate the platform, monitor health,
and support customers.

**User story** — as a RealReach admin, I want to monitor data jobs, AI costs, and
customer usage, so I can keep the platform reliable and profitable.

**Inputs** — user and organization data · job status · API usage · AI usage ·
billing data · error logs

**Outputs** — admin dashboard · usage reports · failure reports · credit
adjustments · feature flags · system-health alerts

**Business rules** — admin actions must be audit-logged · admins must not expose
customer PII unnecessarily · failed jobs must be visible and retryable · cost
anomalies must trigger alerts.

**Acceptance criteria** — admins can view organizations and users · monitor jobs ·
view AI costs · adjust credits · failed jobs are visible and retryable.

---

## 19. Security and reliability

**Purpose** — protect customer data and keep RealReach available.

**User story** — as a customer, I want my data to be secure and the platform to
be reliable, so I can trust RealReach with my sales workflow.

**Requirements** — role-based access control · organization isolation · API rate
limiting · input validation · secure headers · secrets management · backups ·
disaster recovery · uptime monitoring · incident-response plan.

**Acceptance criteria** — one organization cannot access another organization's
data · rate limits prevent abuse · secrets are not exposed in code · backups are
tested · downtime and errors trigger alerts.

---

## 20. Onboarding

**Purpose** — help a new user reach value quickly.

**User story** — as a new user, I want to create my first ICP and find relevant
opportunities within minutes, so I understand the value of RealReach.

**Onboarding flow**

```text
1. Create workspace
2. Define ICP
3. Run first discovery
4. Review opportunities
5. Save 5 opportunities
6. Add contact
7. Generate outreach
8. Approve first message
```

**Activation definition** — a workspace is activated when it completes one
discovery run, saves at least five opportunities, and approves at least one
outreach message.

**Acceptance criteria** — a new user completes onboarding without help · first
discovery run works · first opportunity is saved · first outreach draft is
created · activation event is tracked.

---

## How to use these contexts

For every development task:

```text
CONTEXT:
[Paste the relevant section above]

TASK:
[Describe the specific task]

CONSTRAINTS:
- Use TypeScript.
- Use PostgreSQL and Prisma.
- Use existing design system.
- Do not invent data.
- Include source attribution where relevant.
- Include tests.
- Return production-ready code.

EXPECTED OUTPUT:
- File changes
- Database changes
- API endpoints
- UI components
- Tests
- Acceptance-criteria checklist
```

Example:

```text
CONTEXT:
Signal Engine

TASK:
Build the HIRING signal ingestion pipeline.

CONSTRAINTS:
- Use TypeScript, PostgreSQL, Prisma, and BullMQ.
- Every signal must have source URL, confidence, detected date, and evidence.
- Do not create duplicate signals for the same job posting.
- Include unit tests and integration tests.

EXPECTED OUTPUT:
- Prisma schema changes
- Ingestion service
- Signal normalization logic
- API endpoint
- Tests
```
