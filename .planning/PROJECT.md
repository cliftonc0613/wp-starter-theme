# PWA Merge into Develop

## What This Is

Merge PWA features from the `claude/wordpress-pwa-compatibility-yqSbG` branch into `develop` while preserving all existing functionality. This is a careful integration task focused on combining the PWA implementation with the stable develop branch.

## Core Value

Clean, verified merge: no conflicts, build passes, PWA features work. Everything must function together without regressions.

## Requirements

### Validated

<!-- Existing capabilities from the codebase -->

- ✓ WordPress headless theme with REST API — existing
- ✓ Next.js 16 frontend with React 19 — existing
- ✓ Tailwind CSS 4 styling system — existing
- ✓ shadcn/ui component library — existing
- ✓ StoryBrand marketing sections — existing
- ✓ GSAP/Headroom.js animations — existing
- ✓ Video.js YouTube integration — existing
- ✓ Contact form with Zod validation — existing
- ✓ ISR cache invalidation webhooks — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Merge PWA branch into develop (use develop as base)
- [ ] Resolve all merge conflicts per docs/merge-pwa-into-develop.md
- [ ] Build passes without errors (`npm run build`)
- [ ] Tests pass (`npm run test`)
- [ ] PWA service worker registers in production build
- [ ] PWA manifest loads at `/manifest.json`
- [ ] Offline fallback page works when disconnected

### Out of Scope

<!-- Explicit boundaries. -->

- New features — only merge existing code, don't add anything new
- Sentry verification — focus is PWA functionality
- SWR verification — focus is PWA functionality
- Dependency version updates — keep versions as-is from both branches

## Context

**Branch State:**
- `develop` branch contains: Sentry integration, testing setup, SWR, structured data
- `claude/wordpress-pwa-compatibility-yqSbG` branch contains: PWA support (@ducanh2912/next-pwa)
- Merge strategy: Use develop as base, cherry-pick PWA additions

**Conflict Files (per merge doc):**
1. `frontend/package.json` — merge deps and scripts
2. `frontend/next.config.ts` — chain PWA + BundleAnalyzer + Sentry wrappers
3. `frontend/app/layout.tsx` — add PWA metadata to develop structure
4. `frontend/package-lock.json` — delete and regenerate

**New Files from PWA Branch:**
- `frontend/app/offline/page.tsx`
- `frontend/public/manifest.json`
- `frontend/public/icons/*` (10 PWA icons)
- `frontend/scripts/generate-icons.mjs`

## Constraints

- **Git Strategy**: Must use develop as base, cherry-pick/merge PWA into it
- **Build Requirement**: `npm run build` must complete without errors
- **Test Requirement**: `npm run test` must pass (if tests exist)
- **No New Features**: Only combine existing code from both branches

## Key Decisions

<!-- Decisions that constrain future work. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use develop as base | Develop has more recent changes and stable features | — Pending |
| Chain config wrappers | PWA → BundleAnalyzer → Sentry in next.config.ts | — Pending |
| Delete and regenerate lock file | Cleanest way to resolve package-lock conflicts | — Pending |

---
*Last updated: 2026-01-12 after initialization*
