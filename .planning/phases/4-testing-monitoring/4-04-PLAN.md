---
phase: 4-testing-monitoring
plan: 04
type: execute
---

<objective>
Integrate Sentry error tracking and create health check API endpoints for production monitoring.

Purpose: Enable production error visibility and system health monitoring.
Output: Sentry capturing errors, health endpoint returning system status.
</objective>

<execution_context>
~/.claude/get-shit-done/workflows/execute-phase.md
~/.claude/get-shit-done/templates/summary.md
~/.claude/get-shit-done/references/checkpoints.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/4-testing-monitoring/4-01-SUMMARY.md
@.planning/phases/4-testing-monitoring/4-02-SUMMARY.md
@.planning/phases/4-testing-monitoring/4-03-SUMMARY.md
@.planning/codebase/ARCHITECTURE.md

**Tech stack available:** Next.js 16.1.1, App Router, React 19
**Sentry Next.js integration notes:**
- Requires sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts
- App Router needs global-error.tsx for React error boundaries
- Use onRequestError hook in instrumentation.ts for Server Components

**Environment variables needed:**
- NEXT_PUBLIC_SENTRY_DSN (client-side)
- SENTRY_DSN (server-side)
- SENTRY_AUTH_TOKEN (for source maps, optional)

@frontend/package.json
@frontend/app/layout.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install and configure Sentry</name>
  <files>frontend/package.json, frontend/sentry.client.config.ts, frontend/sentry.server.config.ts, frontend/sentry.edge.config.ts, frontend/instrumentation.ts, frontend/next.config.ts, frontend/.env.example</files>
  <action>
Install Sentry SDK:
- npm install @sentry/nextjs

Create Sentry configuration files:

1. frontend/sentry.client.config.ts:
   - Initialize Sentry with DSN from NEXT_PUBLIC_SENTRY_DSN
   - Set tracesSampleRate: 0.1 (10% of transactions)
   - Set replaysSessionSampleRate: 0.1
   - Set replaysOnErrorSampleRate: 1.0
   - Enable Replay integration for session replay

2. frontend/sentry.server.config.ts:
   - Initialize Sentry with DSN from SENTRY_DSN
   - Set tracesSampleRate: 0.1
   - Enable spotlight for local dev (if SENTRY_SPOTLIGHT env)

3. frontend/sentry.edge.config.ts:
   - Initialize Sentry for edge runtime
   - Minimal config matching server

4. frontend/instrumentation.ts:
   - Export async register() function
   - Conditionally import client/server/edge configs based on runtime
   - Add onRequestError hook for Server Component errors:
     export const onRequestError = Sentry.captureRequestError

5. Update next.config.ts:
   - Wrap config with withSentryConfig from @sentry/nextjs
   - Enable source map uploading (if SENTRY_AUTH_TOKEN present)
   - Hide source maps from client

6. Update .env.example with:
   - NEXT_PUBLIC_SENTRY_DSN=
   - SENTRY_DSN=
   - SENTRY_AUTH_TOKEN= (optional, for source maps)

Do NOT commit actual DSN values. Use placeholders.
Sentry will be disabled if DSN is not set (graceful degradation).
  </action>
  <verify>npm run build completes without Sentry errors (DSN not required for build)</verify>
  <done>Sentry SDK installed and configured for client, server, and edge runtimes</done>
</task>

<task type="auto">
  <name>Task 2: Create health check API endpoint</name>
  <files>frontend/app/api/health/route.ts</files>
  <action>
Create frontend/app/api/health/route.ts:

GET /api/health returns JSON with:
- status: "ok" | "degraded" | "error"
- timestamp: ISO string
- version: from package.json or env
- checks: object with individual check results

Checks to perform:
1. wordpress: Ping WordPress REST API root, return ok/error + latency
2. memory: Process memory usage (process.memoryUsage if available)
3. uptime: Process uptime

Response format:
{
  "status": "ok",
  "timestamp": "2026-01-12T...",
  "version": "1.2.1",
  "checks": {
    "wordpress": { "status": "ok", "latencyMs": 45 },
    "memory": { "status": "ok", "heapUsedMB": 128 },
    "uptime": { "status": "ok", "seconds": 3600 }
  }
}

Status logic:
- All checks pass: "ok"
- Any check fails but app works: "degraded"
- Critical failure: "error"

Set appropriate cache headers (no-store for real-time status).
Handle errors gracefully - endpoint should always return valid JSON.
  </action>
  <verify>curl http://localhost:3000/api/health returns JSON with status field</verify>
  <done>Health check endpoint returns system status with WordPress connectivity check</done>
</task>

<task type="auto">
  <name>Task 3: Add global error boundary</name>
  <files>frontend/app/global-error.tsx, frontend/app/error.tsx</files>
  <action>
Create App Router error boundaries:

1. frontend/app/global-error.tsx (root error boundary):
   - "use client" directive
   - Import * as Sentry from "@sentry/nextjs"
   - Call Sentry.captureException(error) in useEffect
   - Render user-friendly error page with:
     - Error message (sanitized, no stack traces)
     - "Try again" button calling reset()
     - Link to homepage
   - Style with Tailwind, match site design

2. frontend/app/error.tsx (route segment error boundary):
   - "use client" directive
   - Similar to global-error but for route-level errors
   - Import and use Sentry.captureException
   - Provide reset() and navigation options

Both should:
- NOT expose error details to users (security)
- Log to Sentry with full context
- Provide clear recovery path
- Match the site's visual design
  </action>
  <verify>Error boundaries render without TypeScript errors</verify>
  <done>Global and route-level error boundaries capture errors to Sentry</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `npm run build` succeeds with Sentry config
- [ ] /api/health endpoint returns valid JSON
- [ ] Error boundary components render correctly
- [ ] No TypeScript errors
</verification>

<success_criteria>

- Sentry SDK configured for all runtimes (client/server/edge)
- Health check endpoint with WordPress connectivity check
- Error boundaries capture and report errors
- Graceful degradation when Sentry DSN not configured
- Phase 4 complete, milestone 1.0 ready for release
</success_criteria>

<output>
After completion, create `.planning/phases/4-testing-monitoring/4-04-SUMMARY.md`:

Include:
- Sentry configuration summary
- Health endpoint usage
- Error boundary behavior
- "Milestone 1.0 complete" statement
</output>
