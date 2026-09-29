# RealReach — Build Tasks

The build prompts for the platform, in the order they should be executed.
Companion documents: [`../PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md) (rules and
stack), [`TASK_STATUS.md`](./TASK_STATUS.md) (what is already built),
[`PRIORITIES.md`](./PRIORITIES.md) (why the order is what it is).

Each prompt is self-contained. Execute one at a time, in order, and do not start
the next until the current one meets the definition of done.

---

## Task 1 — Initialize Project

```
Read PROJECT_CONTEXT.md.

Initialize a production-ready Next.js 14+ project using TypeScript, Tailwind CSS,
shadcn/ui, Prisma, PostgreSQL, Zod, ESLint, and Prettier.

Set up:
- App Router structure
- TypeScript strict mode
- Prisma with PostgreSQL
- Environment variable handling with Zod
- ESLint and Prettier
- Basic error boundary
- Basic layout with sidebar navigation
- README with setup instructions

Do not implement business features yet.

Return:
- List of created files
- Commands needed to run the project
- Any environment variables required
```

## Task 2 — Database Schema

```
Read PROJECT_CONTEXT.md.

Create the initial Prisma schema for RealReach.

Create models for:
- Organization
- User
- Membership
- Workspace
- Company
- CompanySource
- Signal
- Person
- Opportunity
- SavedCompany
- OutreachMessage
- Task
- Note
- CreditTransaction
- AuditLog

Requirements:
- Every tenant-owned model must include organizationId and workspaceId where appropriate.
- Use UUID or CUID IDs.
- Add createdAt and updatedAt fields.
- Add indexes for organizationId, workspaceId, companyId, domain, country, industry, and employee range.
- Use enums for signal types, opportunity statuses, outreach statuses, and roles.
- Create the initial Prisma migration.

Return:
- Full Prisma schema
- Migration command
- Entity relationship explanation
```

> **Note before running this.** The 19 tables below already exist in SQL form.
> See [`TASK_STATUS.md`](./TASK_STATUS.md) before generating a schema that
> duplicates them. If the platform moves to Prisma, this task becomes a
> *migration of existing tables*, not a greenfield schema — and the spatial
> columns need an explicit decision.

## Task 3 — Authentication

```
Read PROJECT_CONTEXT.md.

Implement authentication using Clerk or Auth.js.

Requirements:
- Email/password sign-up and login
- Google login
- Protected routes
- Organization creation after signup
- Workspace creation
- User membership
- Role-based access control with roles: OWNER, ADMIN, MANAGER, MEMBER, VIEWER
- Middleware to protect authenticated routes
- Audit logging for login, signup, organization creation, and workspace creation

Do not implement billing yet.

Return:
- Files created or modified
- Environment variables required
- How to test the auth flow
```

## Task 4 — Workspace Layout

```
Read PROJECT_CONTEXT.md.

Create the main authenticated application layout.

Create:
- Responsive sidebar
- Top bar
- Workspace switcher
- User menu
- Main dashboard page
- Empty states for dashboard, companies, opportunities, signals, contacts, and outreach

Sidebar navigation:
- Dashboard
- Discover
- Companies
- Opportunities
- Signals
- Contacts
- Outreach
- Settings
- Billing

Use shadcn/ui components.

Return:
- Files created or modified
- How to navigate the app
- Screenshots or component descriptions if possible
```

## Task 5 — Company Data Model

```
Read PROJECT_CONTEXT.md.

Implement the company domain.

Create:
- Company service
- Company repository functions
- Company API routes
- Company search filters
- Company profile page

Company fields:
- Name
- Legal name
- Domain
- Website
- Country
- Region
- City
- Industry
- Employee band
- Description
- Technologies
- LinkedIn URL if available
- Last refreshed
- Source references

Search filters:
- Country
- Industry
- Employee range
- City/region
- Technology
- Keyword

Requirements:
- All queries must be scoped to the current workspace/organization.
- Add pagination.
- Add sorting.
- Add source attribution.
- Add Zod validation for query parameters.
- Add integration tests for tenant isolation.

Return:
- Prisma changes
- API endpoints
- Service functions
- UI components
- Test coverage summary
```

## Task 6 — Data Connector Framework

```
Read PROJECT_CONTEXT.md.

Create a data-connector framework for external providers.

Requirements:
- Connector interface with methods: fetch, normalize, validate, mapToCompany
- Provider config with name, rate limit, retry policy, and terms reference
- Raw-response storage in S3/R2 or local development storage
- Normalization pipeline
- Deduplication by domain and external ID
- Source attribution for every field
- Error handling and retry logic
- Logging for every ingestion run

Create an example connector for OpenCorporates or a mock company-registry provider.

Return:
- Connector interface
- Example connector implementation
- Database changes
- Worker/job setup
- Test coverage
```

## Task 7 — Company Ingestion Worker

```
Read PROJECT_CONTEXT.md.

Implement a background ingestion worker using Redis and BullMQ.

Requirements:
- Job: refreshCompany
- Job: refreshCompanyBatch
- Retry with exponential backoff
- Dead-letter queue
- Rate-limit handling
- Concurrency limits
- Job status tracking
- Logging
- Admin-facing job status endpoint

The worker should:
1. Fetch company data from a connector
2. Normalize it
3. Deduplicate it
4. Save source references
5. Update company record
6. Trigger signal extraction later

Return:
- Worker implementation
- Queue setup
- Job payload schema
- API endpoint to enqueue jobs
- Test plan
```

## Task 8 — Signal Engine

```
Read PROJECT_CONTEXT.md.

Implement the signal engine.

Signal types:
- HIRING
- EXPANSION
- FUNDING
- LEADERSHIP_CHANGE
- TECH_ADOPTION
- PRODUCT_LAUNCH
- PARTNERSHIP
- ACQUISITION
- PROCUREMENT
- NEWS

Requirements:
- Signal model with type, title, summary, source, evidence, confidence, detectedAt, publishedAt, freshnessScore
- Signal ingestion pipeline
- Signal deduplication
- Signal confidence scoring
- Signal freshness scoring
- Signal API
- Signal UI on company profile
- Signal filters
- Signal feed

Every signal must include:
- Source provider
- Source URL or provider reference
- Evidence object
- Detected timestamp
- Confidence score

Return:
- Prisma changes
- Signal service
- API endpoints
- UI components
- Tests
```

## Task 9 — ICP Builder

```
Read PROJECT_CONTEXT.md.

Implement an ICP builder.

ICP fields:
- Name
- Countries
- Industries
- Employee range
- Required signals
- Target roles
- Technologies
- Exclusions
- Max results

Requirements:
- Create, read, update, delete ICPs
- Duplicate ICP
- Save ICP per workspace
- Validate input with Zod
- Create UI for ICP creation and editing
- Allow ICP to be used for discovery

Return:
- Prisma changes
- API endpoints
- UI components
- Validation schemas
- Tests
```

## Task 10 — Opportunity Engine

```
Read PROJECT_CONTEXT.md.

Implement the opportunity engine.

Requirements:
- Generate opportunities from ICP matches and signals
- Deterministic scoring system
- Score breakdown with factor names and points
- Priority: LOW, MEDIUM, HIGH, CRITICAL
- Opportunity status pipeline:
  DISCOVERED, QUALIFIED, CONTACT_IDENTIFIED, OUTREACH_DRAFTED,
  CONTACTED, ENGAGED, MEETING_BOOKED, ACTIVE_OPPORTUNITY, WON, LOST
- Opportunity feed UI
- Opportunity detail page
- Save opportunity
- Add notes
- Add tasks
- Activity timeline
- Owner assignment
- Filters and bulk actions

Scoring factors:
- ICP fit
- Hiring signal
- Expansion signal
- Funding signal
- Contact availability
- Freshness

The score must be deterministic and explainable.

Return:
- Scoring service
- API endpoints
- UI components
- Tests for scoring and tenant isolation
```

## Task 11 — AI Foundation

```
Read PROJECT_CONTEXT.md.

Implement the AI foundation.

Requirements:
- AI provider abstraction for OpenAI and Anthropic
- Model router by task type
- Prompt versioning
- Zod schema validation for every LLM response
- Token and cost tracking
- Retry and timeout handling
- Rate-limit handling
- Prompt-injection protection
- PII redaction
- Langfuse or LangSmith tracing
- Evaluation test structure

Create a reusable function:

runStructuredAI({
  taskType,
  promptVersion,
  input,
  outputSchema,
  modelPolicy,
  context
})

It must return validated structured JSON.

Return:
- AI service implementation
- Prompt storage structure
- Cost tracking schema
- Example usage
- Tests
```

## Task 12 — Research Agent

```
Read PROJECT_CONTEXT.md.

Implement the Research Agent.

Input: companyId

The agent must collect and normalize:
- Company overview
- Industry
- Products
- Technologies
- Recent news
- Hiring signals
- Expansion signals
- Funding signals
- Leadership changes

Requirements:
- Use only data available in the database or approved connectors
- Return structured JSON
- Include evidence for every claim
- Store agent run, prompt version, model, tokens, cost, duration, and status
- Add retry and timeout handling
- Add UI to show research results on the company profile
- Add "Run research" button with credit check

Return:
- Agent implementation
- Prompt template
- Output schema
- API endpoint
- UI components
- Tests
```

## Task 13 — Qualification Agent

```
Read PROJECT_CONTEXT.md.

Implement the Qualification Agent.

Input:
- Opportunity ID
- Company profile
- ICP
- Deterministic score
- Signals
- Evidence

Output:
- whyRelevant
- whyNow
- likelyProblem
- recommendedContactRole
- recommendedNextAction
- evidence[]

Rules:
- The agent explains the existing deterministic score.
- It must not change the score.
- Every statement must reference evidence.
- If evidence is missing, it must say "Not enough evidence."
- Block unsupported claims.

Return:
- Agent implementation
- Prompt template
- Output schema
- API endpoint
- UI components
- Tests
```

## Task 14 — Contact Discovery

```
Read PROJECT_CONTEXT.md.

Implement contact discovery.

Requirements:
- Contact model with name, title, seniority, email, LinkedIn URL, source, confidence, lawfulBasis, verification status, suppression status
- Contact search API
- Contact-to-company relationship
- Contact recommendation based on ICP target roles
- Contact confidence scoring
- Contact-source attribution
- Suppression list
- Contact deletion and correction
- Audit logging for contact PII access
- UI to view and add contacts to opportunities

Do not scrape LinkedIn.

Return:
- Prisma changes
- Contact service
- API endpoints
- UI components
- GDPR-related controls
- Tests
```

## Task 15 — Outreach Drafting

```
Read PROJECT_CONTEXT.md.

Implement AI outreach drafting.

Input:
- Opportunity ID
- Contact ID
- Language: English, Italian, or German
- Tone: professional, direct, friendly

Output:
- Subject
- Body
- Evidence used

Rules:
- Use only evidence from the opportunity and company signals.
- Maximum 90 words for email.
- Mention one specific signal.
- Make one clear ask.
- Do not invent facts.
- Return structured JSON.
- Show evidence links in the UI.
- Save prompt version, model, tokens, cost, and duration.

Return:
- Outreach service
- Prompt template
- Output schema
- API endpoint
- UI components
- Tests
```

## Task 16 — Outreach Approval and Email Sending

```
Read PROJECT_CONTEXT.md.

Implement outreach approval and email sending.

Requirements:
- Outreach statuses: DRAFT, APPROVED, QUEUED, SENT, DELIVERED, OPENED, REPLIED, BOUNCED, FAILED
- User must approve a draft before sending
- Use Resend, Postmark, or SES
- Send from a configured domain
- Handle bounces
- Handle replies
- Handle unsubscribes
- Enforce suppression list
- Add sending limits
- Add audit logging
- Add outreach timeline on opportunity page

Do not enable autonomous sending.

Return:
- Email service
- Queue worker
- API endpoints
- UI components
- Webhook handlers
- Tests
```

## Task 17 — Monitoring

```
Read PROJECT_CONTEXT.md.

Implement company monitoring.

Requirements:
- User can watch/save companies
- Daily monitoring job
- Check for new hiring, funding, news, expansion, leadership, and technology signals
- Recalculate opportunity scores when new signals arrive
- Create in-app notifications
- Create email notifications
- Notification preferences
- Alert history
- Link every alert to opportunity and evidence

Return:
- Monitoring worker
- Notification service
- API endpoints
- UI components
- Tests
```

## Task 18 — Credits and Billing

```
Read PROJECT_CONTEXT.md.

Implement credits and Stripe billing.

Credit costs:
- Company search: 1
- Company research: 5
- Contact lookup: 3
- AI qualification: 2
- Outreach draft: 1
- Monitoring refresh: 2

Plans:
- Starter: 49 EUR/month, 500 credits
- Pro: 149 EUR/month, 2,000 credits
- Business: 399 EUR/month, 10,000 credits

Requirements:
- Stripe checkout
- Stripe customer portal
- Stripe webhooks
- Credit ledger
- Credit deduction
- Insufficient-credit handling
- Usage dashboard
- Invoice handling
- Plan upgrade/downgrade
- Admin credit adjustment
- Tests for credit deduction and tenant isolation

Return:
- Billing service
- Credit service
- Stripe integration
- API endpoints
- UI components
- Tests
```

## Task 19 — Admin Dashboard

```
Read PROJECT_CONTEXT.md.

Implement an internal admin dashboard.

Requirements:
- Admin-only access
- Organization and workspace search
- User management
- Subscription overview
- Credit adjustment
- Job monitoring
- Failed-job retry
- Data-freshness dashboard
- AI-cost dashboard
- Error dashboard
- Feature flags
- Support tools

Return:
- Admin routes
- Admin services
- UI components
- Role protection
- Audit logging
- Tests
```

## Task 20 — Security Hardening

```
Read PROJECT_CONTEXT.md.

Implement security hardening.

Requirements:
- API rate limiting
- Input validation everywhere
- Secure headers
- CSRF protection where relevant
- Secrets management
- Organization isolation tests
- Role-based access tests
- PII access logging
- Backup and restore documentation
- Incident-response documentation
- Security checklist

Return:
- Middleware and utilities
- Security tests
- Documentation
- Deployment checklist
```

## Task 21 — Onboarding

```
Read PROJECT_CONTEXT.md.

Implement onboarding.

Flow:
1. Create workspace
2. Choose ICP template
3. Run first discovery
4. Review opportunities
5. Save 5 opportunities
6. Add contact
7. Generate outreach
8. Approve first message

Requirements:
- Progress indicator
- Skip option
- Sample data for demo workspace
- Activation tracking
- Completion tracking
- Empty states and guidance

Return:
- Onboarding service
- UI components
- API endpoints
- Analytics events
- Tests
```

## Task 22 — Public Landing Page

```
Read PROJECT_CONTEXT.md.

Create a high-converting public landing page.

Sections:
- Hero: "Discover the right companies. Understand the opportunity. Reach the right people."
- Problem
- How it works
- Features
- Use cases
- Pricing
- FAQ
- CTA: Start free

Requirements:
- Modern, premium, minimal design
- Responsive
- Fast loading
- SEO metadata
- Clear CTAs
- No fake customer logos or fake testimonials

Return:
- Landing page components
- SEO metadata
- Copy suggestions
- Responsive behavior
```

> **Note before running this.** A landing page already exists for the
> **field-ops pilot** (`src/pages/HomePage.tsx` and its sections). It carries
> unverified third-party company logos under "Trusted by businesses from",
> which this prompt explicitly forbids. If the platform gets its own landing
> page, that rule applies to it from the start.

---

## Workflow for every task

```
1. Paste the task prompt.
2. Ask the assistant to read PROJECT_CONTEXT.md and the rules.
3. Review the proposed file changes.
4. Ask it to implement only that task.
5. Run tests.
6. Run the app.
7. Test the flow manually.
8. Commit with a clear message.
9. Move to the next task.
```

**Commit message convention**

```
feat: add company search and profile
feat: add signal engine
feat: add opportunity scoring
feat: add research agent
feat: add outreach approval flow
feat: add credits and Stripe billing
```

## Minimum first release

Build only these first. Everything else waits until users validate the core
workflow.

```
1.  Auth and workspaces
2.  Company search
3.  Company profile
4.  Signal engine
5.  ICP builder
6.  Opportunity scoring
7.  Opportunity pipeline
8.  Research agent
9.  Contact recommendations
10. Outreach drafts
11. Approval-before-send email
12. Credits
13. Basic onboarding
```

## Definition of done

A task is complete only when:

- Code compiles
- Lint passes
- Tests pass
- Tenant isolation is tested
- UI has loading, empty, error, and success states
- Data sources are recorded
- AI output is validated
- No secrets are hardcoded
- Documentation is updated
- The feature works end to end

## First session

Start with these three prompts.

**Prompt 1**

```
Read PROJECT_CONTEXT.md.

Create the file structure, base Next.js app, Tailwind, shadcn/ui, Prisma,
PostgreSQL connection, Zod environment validation, ESLint, Prettier, and basic
sidebar layout.

Do not implement business logic yet.
```

**Prompt 2**

```
Read PROJECT_CONTEXT.md.

Create the initial Prisma schema for organizations, users, workspaces,
companies, signals, people, opportunities, outreach messages, tasks, notes,
credits, and audit logs.

Include tenant isolation fields, enums, indexes, and migrations.
```

**Prompt 3**

```
Read PROJECT_CONTEXT.md.

Implement authentication, organizations, workspaces, roles, protected routes,
and audit logging.

Use Clerk or Auth.js.
```

After these three tasks the technical foundation exists, and RealReach can be
built task by task.
