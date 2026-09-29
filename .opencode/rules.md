# OpenCode Rules

## General

- Read `PROJECT_CONTEXT.md` before implementing any task.
- Ask for clarification only if a requirement is impossible to implement safely.
- Do not create features not requested in the current task.
- Do not modify unrelated files.
- Keep changes small and reviewable.
- Always return a summary of files created or modified.

## Code Standards

- Use TypeScript strict mode.
- Use functional components in React.
- Use server components where possible.
- Use server actions or route handlers for mutations.
- Use Prisma for database access.
- Use Zod for all external input validation.
- Use meaningful names.
- Avoid `any` type.
- Avoid hardcoded secrets.
- Add comments only where necessary.

## Database

- Use Prisma migrations.
- Every tenant-owned table must include `organizationId`.
- Add indexes for foreign keys and frequently filtered fields.
- Never delete data without a soft-delete or audit strategy unless explicitly requested.

## AI

- Validate every LLM response with Zod.
- Never allow the AI to invent companies, contacts, signals, or metrics.
- Every AI-generated claim must reference evidence.
- Store prompt version, model, tokens, cost, and duration for each run.
- Use structured JSON output.

## UI

- Use shadcn/ui components.
- Always implement loading, empty, error, and success states.
- Keep the UI clean, modern, minimal, and professional.
- Use responsive layouts.

## Testing

- Add unit tests for business logic.
- Add integration tests for API routes.
- Add tests for tenant isolation.
- Add tests for credit deduction.
- Add tests for AI output validation.

---

## Addendum — how these rules map onto this repository

> Added 2026-09-29. The rules above describe the target platform. These notes say
> what to do when the target and the repo disagree. Where they differ, the
> **intent** of the rule wins over its literal wording.

### Where a rule's intent maps to a different mechanism

| Rule as written | What to do here | Why |
| --- | --- | --- |
| "Use Prisma for database access" | Use numbered SQL migrations in `db/migrations/` and `pool.query` with explicit parameters | The domain is geospatial; Prisma has no spatial type, so the interesting queries would be `$queryRaw` anyway. See `PROJECT_CONTEXT.md`. |
| "Every tenant-owned table must include `organizationId`" | Include `org_id NOT NULL REFERENCES organizations(id)` | Same guarantee, snake_case convention. Non-negotiable either way. |
| "Use shadcn/ui components" | Extend the bespoke Tailwind set in `src/components/` | shadcn is a copy-in library, not a dependency; a bespoke set already matches the brand. Match the surrounding file's conventions. |
| "Use server components where possible" | There is no server rendering; the web app is a Vite SPA and the API is Express | Not applicable to the current stack. Revisit if the platform moves to Next.js. |
| "Use server actions or route handlers for mutations" | Express route handlers in `src/routes/*`, mutations as `POST`/`PATCH`/`DELETE` | Same intent: mutations are explicit HTTP verbs with a role gate, not implicit form posts. |
| "Add tests for credit deduction" | Credits are not implemented yet. When they are: a failed action must not charge, and the ledger must be append-only. | Recorded so it is not forgotten. |
| "Add tests for AI output validation" | `tests/outreachDraft.test.ts` and `tests/trust.test.ts` already cover the non-LLM equivalents | The LLM versions come with the AI foundation task. |

### Rules that are already non-negotiable in this repo

These have caused real bugs, so treat a violation as a defect:

1. **Never widen a `SELECT` with `*` when a duplicate column name could
   shadow a real one.** `SELECT o.id, ..., i.*` where `i` also has an `id`
   silently overwrote the opportunity id, and every write went to nothing.
2. **A number asserted against a corpus must match a token, not a substring.**
   An invented "40" passed a check because the evidence contained "240".
3. **If something renders a number, verify the wire type.** `pg` returns
   `numeric` as a string; the type parsers in `src/db.ts` fix it once at the
   driver. A client that calls `.toFixed()` on it will throw.
4. **A route with a parameter must be declared after the specific routes it
   would otherwise swallow.** `POST /x/:id/notes` was captured by `POST /x/:id/:action`.
5. **Machine verdicts, human decisions, and data complaints are three separate
   records.** Never let one overwrite another.

### Commands that actually work in this repo

The repository folder contains an `&`, which breaks `npm` scripts and some
shells. Invoke the tools directly:

```bash
# backend (realreach-backend)
node node_modules/typescript/bin/tsc -p tsconfig.json     # build
node node_modules/vitest/vitest.mjs run                     # unit tests
powershell -ExecutionPolicy Bypass -File tools\test-e2e-required.ps1

# web (this repo)
node node_modules/typescript/bin/tsc --noEmit              # typecheck
node node_modules/vite/bin/vite.js build                    # build
node node_modules/vite/bin/vite.js --port=3000 --host=127.0.0.1

# operator (realreach-operator)
npx tsc --noEmit
npx expo start --lan
```

PowerShell: no non-ASCII in `.ps1` files, and `Invoke-RestMethod` piped
straight into a pipeline does **not** enumerate a JSON array — prefetch into a
variable first.
