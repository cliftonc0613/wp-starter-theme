# Codebase Concerns

**Analysis Date:** 2026-01-11

## Tech Debt

**Inline Styles Violating Project Guidelines:**
- Issue: Components use inline `style={{}}` objects instead of Tailwind classes
- Files: `frontend/components/YouTubePlayer.tsx` (lines 130-135, 144-147)
- Why: Quick implementation during development
- Impact: Violates CLAUDE.md guidelines, harder to maintain, bypasses theme system
- Fix approach: Convert to Tailwind utilities or CSS classes in `globals.css`

**Hardcoded Contact Info in Header:**
- Issue: Phone, email, social links hardcoded in component
- File: `frontend/components/Header.tsx` (lines 31-42)
- Why: Quick setup without CMS integration
- Impact: Changes require code modification instead of CMS updates
- Fix approach: Move to WordPress ACF options page or environment variables

**Large API Client File:**
- Issue: `wordpress.ts` is 575 lines with all fetch functions in one file
- File: `frontend/lib/wordpress.ts`
- Why: Organic growth as endpoints were added
- Impact: Hard to navigate, test individual functions
- Fix approach: Split into `lib/api/posts.ts`, `lib/api/services.ts`, etc.

## Known Bugs

**Race condition in subscription updates (potential):**
- Symptoms: Content may show stale briefly after WordPress update
- Trigger: Fast navigation after content save, before webhook processes
- File: `frontend/app/api/revalidate/route.ts`
- Workaround: 5-second ISR revalidation eventually updates
- Root cause: Webhook processing can be slower than user navigation

## Security Considerations

**Placeholder Secrets in Development:**
- Risk: Development secrets like `preview-secret-change-me` could leak to production
- Files: `frontend/.env.local`, `frontend/.env.production.example`
- Current mitigation: `.env.local` is gitignored, file has restricted permissions
- Recommendations: Add pre-commit hook to block placeholder secrets, document secret rotation

**POST-Only Revalidation (DONE):**
- Status: ✅ Already properly implemented
- File: `frontend/app/api/revalidate/route.ts`
- Current: POST-only endpoint, secrets never in URL query params
- Comment in code explains security rationale

## Performance Bottlenecks

**No Client-Side Caching:**
- Problem: No SWR or React Query for client-side data caching
- Measurement: Full API calls on every navigation (server-side ISR helps, but no client cache)
- Cause: Not yet implemented (PRD Phase 2 feature)
- Improvement path: Implement SWR hooks as specified in PRD F2.1

**Dashboard/Listing Page Queries:**
- Problem: Blog listing fetches all posts without pagination limits
- File: `frontend/app/blog/page.tsx`
- Measurement: Could slow with 100+ posts
- Cause: Simple implementation without growth planning
- Improvement path: Add pagination, implement cursor-based fetching

## Fragile Areas

**WordPress API Integration:**
- File: `frontend/lib/wordpress.ts`
- Why fragile: Any WordPress REST API change breaks frontend
- Common failures: Field name changes, ACF structure changes
- Safe modification: Add TypeScript interfaces for all responses
- Test coverage: No tests (high priority to add)

**Preview Mode Flow:**
- Files: `frontend/app/api/preview/route.ts`, `functions.php:283-304`
- Why fragile: Depends on secret matching, correct URL construction
- Common failures: Secret mismatch, wrong slug/type parameters
- Safe modification: Add logging, test both endpoints together
- Test coverage: No automated tests

## Scaling Limits

**ISR Cache Invalidation:**
- Current capacity: Handles typical blog update frequency
- Limit: High-frequency updates could overwhelm revalidation
- Symptoms at limit: Stale content, webhook timeouts
- Scaling path: Batch revalidation, debounce WordPress hooks

## Dependencies at Risk

**No Significant Risks Detected:**
- All dependencies are actively maintained
- React 19, Next.js 16 are current versions
- shadcn/ui and Radix UI have active development

## Missing Critical Features

**Email Integration for Contact Form:**
- Problem: Contact form submissions log to console, no notification sent
- File: `frontend/app/api/contact/route.ts` (line 15 TODO)
- Current workaround: None - form appears to work but doesn't notify anyone
- Blocks: Cannot receive customer inquiries
- Implementation complexity: Low (add Resend or similar)

**RankMath SEO Integration:**
- Problem: No SEO metadata from WordPress
- Files: Not implemented (PRD F1.1)
- Current workaround: Manual metadata in page components
- Blocks: Dynamic SEO from CMS
- Implementation complexity: Medium (parsing utility needed)

**Search Functionality:**
- Problem: No search across content
- Files: Not implemented (PRD F3.1-F3.2)
- Current workaround: Users manually browse
- Blocks: Content discovery for larger sites
- Implementation complexity: Medium (endpoint + UI)

**Testing Infrastructure:**
- Problem: No test framework, no tests
- Files: Not configured (PRD F4.1-F4.2)
- Current workaround: Manual testing only
- Blocks: Confident refactoring, regression prevention
- Implementation complexity: Medium (setup + initial tests)

**Error Tracking:**
- Problem: No Sentry or similar error tracking
- File: `frontend/lib/logger.ts` has TODO for Sentry
- Current workaround: Console logs in development
- Blocks: Production error visibility
- Implementation complexity: Low (add Sentry SDK)

## Test Coverage Gaps

**API Client Functions:**
- What's not tested: All functions in `frontend/lib/wordpress.ts`
- Risk: API changes break silently
- Priority: High
- Difficulty to test: Medium (mock fetch)

**Form Validation:**
- What's not tested: `frontend/lib/schemas/contact.ts` schema
- Risk: Invalid data accepted or valid rejected
- Priority: Medium
- Difficulty to test: Low (pure functions)

**API Routes:**
- What's not tested: All routes in `frontend/app/api/*/route.ts`
- Risk: Authentication, validation failures undetected
- Priority: High
- Difficulty to test: Medium (mock requests)

**Component Rendering:**
- What's not tested: React components
- Risk: UI breaks go unnoticed
- Priority: Medium
- Difficulty to test: Medium (React Testing Library)

## PRD Feature Implementation Status

**Phase 1 - SEO & Discoverability:**
- F1.1 RankMath Integration: ❌ Not implemented
- F1.2 Structured Data: ❌ Not implemented
- F1.3 Dynamic Sitemap: ✅ Implemented
- F1.4 Robots.txt: ✅ Implemented

**Phase 2 - Performance & Caching:**
- F2.1 SWR Hooks: ❌ Not implemented
- F2.2 Image Optimization: ⚠️ Partial (config exists, component incomplete)
- F2.3 Bundle Optimization: ❌ Not implemented

**Phase 3 - Search & Filtering:**
- F3.1 Search Endpoint: ❌ Not implemented
- F3.2 Search UI: ❌ Not implemented
- F3.3 Category/Tag Filtering: ❌ Not implemented
- F3.4 Related Content: ✅ Implemented (blog posts)

**Phase 4 - Testing & Monitoring:**
- F4.1 Unit Testing: ❌ Not implemented
- F4.2 E2E Testing: ❌ Not implemented
- F4.3 Sentry Integration: ❌ Not implemented
- F4.4 Health Checks: ❌ Not implemented

---

*Concerns audit: 2026-01-11*
*Update as issues are fixed or new ones discovered*
