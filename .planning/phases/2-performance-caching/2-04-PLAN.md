---
phase: 2-performance-caching
plan: 04
type: execute
domain: next-js
---

<objective>
Add bundle analysis tooling and verify performance improvements with Lighthouse.

Purpose: Provide visibility into bundle size for ongoing optimization, and verify that Phase 2 improvements result in better Lighthouse scores (important for SEO from Phase 1).

Output: Bundle analyzer configured, Lighthouse audit passed, Phase 2 complete.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-phase.md
@~/.claude/get-shit-done/templates/summary.md
@~/.claude/get-shit-done/references/checkpoints.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/2-performance-caching/2-CONTEXT.md

**Depends on:**
- Plan 2-01: SWR hooks
- Plan 2-02: BlurImage component
- Plan 2-03: Content image optimization

**Key files:**
@frontend/package.json
@frontend/next.config.ts

**From CONTEXT.md:**
- Green Lighthouse scores very important (connects to Phase 1 SEO)
- Developer experience: visibility into bundle, faster builds
- Mobile first priority (Lighthouse mobile scores matter)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add bundle analyzer</name>
  <files>frontend/package.json, frontend/next.config.ts</files>
  <action>
1. Install bundle analyzer: `npm install -D @next/bundle-analyzer`
2. Update `next.config.ts` to conditionally enable analyzer:
   ```typescript
   import bundleAnalyzer from '@next/bundle-analyzer';

   const withBundleAnalyzer = bundleAnalyzer({
     enabled: process.env.ANALYZE === 'true',
   });

   // Wrap existing config with analyzer
   export default withBundleAnalyzer(nextConfig);
   ```
3. Add npm script to package.json:
   ```json
   "analyze": "ANALYZE=true next build"
   ```
4. Ensure existing next.config.ts settings preserved (images, rewrites, etc.)

AVOID: Don't enable analyzer by default - it should only run when ANALYZE=true.
WHY: Analyzer adds overhead to builds; only use when actively optimizing.
  </action>
  <verify>
- `npm run build` succeeds (normal build, no analyzer)
- `npm run analyze` opens bundle visualization in browser
- Existing next.config.ts functionality preserved
  </verify>
  <done>
- @next/bundle-analyzer in devDependencies
- next.config.ts wraps config with analyzer
- `npm run analyze` script added
- Normal builds unaffected
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
Complete Phase 2 performance improvements:
- SWR data fetching hooks with stale-while-revalidate
- BlurImage component for featured images
- Content image optimization with blur-up effect
- Bundle analyzer tooling
  </what-built>
  <how-to-verify>
1. Start dev server: `cd frontend && npm run dev`
2. Open browser to http://localhost:3000

**Test blur-up images:**
3. Open DevTools Network tab, set throttling to "Slow 3G"
4. Navigate to a blog post with a featured image
5. Verify: Featured image loads with blur-to-sharp transition
6. Check content images (if any) also have blur effect

**Test SWR caching:**
7. Navigate to blog list, then to a post, then back to list
8. Verify: List loads instantly from cache (no loading spinner)
9. Open another tab, make a change in WordPress
10. Return to the site and refresh - content should update

**Run Lighthouse:**
11. Open Chrome DevTools > Lighthouse tab
12. Run audit on Mobile with Performance category
13. Target: Performance score 80+ (green)
14. Check LCP (Largest Contentful Paint) is reasonable

**Optional - Bundle analysis:**
15. Run: `npm run analyze`
16. Review bundle sizes for any obvious issues

Report: Lighthouse mobile performance score and any issues found.
  </how-to-verify>
  <resume-signal>Type "approved" with Lighthouse score, or describe issues to fix</resume-signal>
</task>

</tasks>

<verification>
Before declaring phase complete:
- [ ] Bundle analyzer installed and working
- [ ] `npm run build` succeeds
- [ ] `npm run analyze` produces bundle visualization
- [ ] Blur-up effect works on featured images
- [ ] Blur-up effect works on content images
- [ ] SWR caching provides instant feel
- [ ] Lighthouse mobile performance score 80+
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- Human verification approved
- Lighthouse performance score meets target
- Phase 2: Performance & Caching complete
</success_criteria>

<output>
After completion, create `.planning/phases/2-performance-caching/2-04-SUMMARY.md` with:
- Lighthouse scores (before/after if available)
- Bundle analysis findings
- Any performance recommendations for future

Then update:
- `.planning/STATE.md` - Mark Phase 2 complete
- `.planning/ROADMAP.md` - Update Phase 2 status
</output>
