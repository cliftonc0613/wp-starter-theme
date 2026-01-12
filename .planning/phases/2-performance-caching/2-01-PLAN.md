---
phase: 2-performance-caching
plan: 01
type: execute
domain: next-js
---

<objective>
Create SWR data fetching hooks for client-side caching with stale-while-revalidate pattern.

Purpose: Enable instant page loads by serving cached data immediately while revalidating in the background. This creates the "snappy, instant" feel like Vercel.com and Linear.app.

Output: SWR hooks (usePost, useService, usePosts, useServices) and global SWR configuration.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-phase.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/2-performance-caching/2-CONTEXT.md

**Phase 1 context:**
@.planning/phases/1-seo-discoverability/1-01-SUMMARY.md

**Key files:**
@frontend/lib/wordpress.ts
@frontend/package.json

**Tech stack available:** Next.js 16.1.1, React 19, TypeScript
**Patterns from Phase 1:** Graceful fallback pattern, separate utilities from components

**From CONTEXT.md:**
- Vision: Instant feel like Vercel/Linear, silent background updates
- Essential: Real-time freshness (WordPress changes within seconds)
- Mobile first optimization priority
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install SWR and create data fetching hooks</name>
  <files>frontend/package.json, frontend/lib/swr.ts</files>
  <action>
1. Install SWR: `npm install swr`
2. Create `lib/swr.ts` with typed hooks:
   - `usePost(slug: string)` - fetch single post by slug
   - `useService(slug: string)` - fetch single service by slug
   - `usePosts(params?: { per_page?: number })` - fetch posts list
   - `useServices(params?: { per_page?: number })` - fetch services list
3. Each hook should:
   - Use the existing API functions from `lib/wordpress.ts` as fetchers
   - Return `{ data, error, isLoading, mutate }` pattern
   - Use proper TypeScript types from wordpress.ts (WPPost, WPService)
4. Create fetcher functions that wrap the existing API calls
5. Export types for hook return values

AVOID: Don't duplicate API logic - reuse existing functions from wordpress.ts as fetchers.
WHY: Keeps API logic centralized, hooks are thin wrappers for caching.
  </action>
  <verify>
- `npm run build` succeeds
- TypeScript types are correct (no type errors)
- Hooks export correctly: `import { usePost, usePosts } from '@/lib/swr'`
  </verify>
  <done>
- SWR installed in package.json
- lib/swr.ts exports usePost, useService, usePosts, useServices
- All hooks properly typed with WPPost/WPService types
- No TypeScript errors
  </done>
</task>

<task type="auto">
  <name>Task 2: Create SWR configuration provider</name>
  <files>frontend/lib/swr.ts, frontend/app/providers.tsx, frontend/app/layout.tsx</files>
  <action>
1. Add SWR global configuration to lib/swr.ts:
   ```typescript
   export const swrConfig: SWRConfiguration = {
     revalidateOnFocus: true,
     revalidateOnReconnect: true,
     dedupingInterval: 5000, // 5 seconds - matches current ISR
     errorRetryCount: 3,
   }
   ```
2. Create or update `app/providers.tsx`:
   - Import SWRConfig from 'swr'
   - Wrap children with SWRConfig using the global config
   - Make it a client component ('use client')
3. Update `app/layout.tsx`:
   - Import and wrap the app with Providers component
   - Ensure it works with existing ThemeProvider if present

AVOID: Don't set refreshInterval globally - we want on-demand revalidation, not polling.
WHY: Polling wastes bandwidth on mobile. SWR's stale-while-revalidate + focus revalidation is sufficient for "real-time" feel.
  </action>
  <verify>
- `npm run build` succeeds
- App still renders correctly
- SWRConfig is at root level in component tree
  </verify>
  <done>
- swrConfig exported from lib/swr.ts
- Providers component wraps app with SWRConfig
- layout.tsx uses Providers
- Build passes without errors
  </done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `npm run build` succeeds without errors
- [ ] `npm run lint` passes
- [ ] SWR package in dependencies
- [ ] Hooks can be imported: `import { usePost, usePosts, useService, useServices } from '@/lib/swr'`
- [ ] SWRConfig wraps the app at root level
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- No TypeScript errors
- SWR hooks ready for use in components
- Global SWR configuration applied
</success_criteria>

<output>
After completion, create `.planning/phases/2-performance-caching/2-01-SUMMARY.md`
</output>
