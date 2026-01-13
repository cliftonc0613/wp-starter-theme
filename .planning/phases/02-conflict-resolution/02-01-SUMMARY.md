---
phase: 02-conflict-resolution
plan: 01
subsystem: frontend
tags: [pwa, dependencies, next-config, merge]

# Dependency graph
requires:
  - merge/pwa-into-develop branch from Phase 1
provides:
  - PWA dependencies in package.json
  - PWA wrapper chain in next.config.ts
affects: [02-02-layout-and-lock]

# Tech tracking
tech-stack:
  added:
    - "@ducanh2912/next-pwa": "^10.2.9"
    - "sharp": "^0.34.5" (dev)
  patterns:
    - Config wrapper chaining (PWA → BundleAnalyzer → Sentry)

key-files:
  created: []
  modified:
    - frontend/package.json
    - frontend/next.config.ts

key-decisions:
  - "Chain config wrappers in order: PWA → BundleAnalyzer → Sentry"
  - "Use 6 caching strategies for different asset types"

patterns-established:
  - Workbox runtime caching configuration pattern

issues-created: []

# Metrics
duration: 3min
completed: 2026-01-12
---

# Phase 2 Plan 1: Conflict Resolution Summary

**Added PWA dependencies and configured wrapper chain in next.config.ts**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-12T20:10:00Z
- **Completed:** 2026-01-12T20:13:00Z
- **Tasks:** 2/2
- **Files modified:** 2

## Accomplishments

- Added `@ducanh2912/next-pwa` dependency for PWA support
- Added `sharp` devDependency for icon generation
- Added `generate-icons` npm script
- Configured PWA wrapper with 6 caching strategies
- Chained config wrappers: PWA → BundleAnalyzer → Sentry

## Task Commits

1. **Task 1 & 2: Update package.json and next.config.ts**
   - Commit: `c1b9849` - feat(pwa): add PWA dependencies and config wrapper chain

## Files Created/Modified

- `frontend/package.json` - Added PWA dependency, sharp devDep, generate-icons script
- `frontend/next.config.ts` - Added PWA import, withPWA config, updated wrapper chain

## Caching Strategies Added

| Cache Name | Handler | TTL | Purpose |
|------------|---------|-----|---------|
| google-fonts | CacheFirst | 1 year | Google Fonts CDN |
| static-fonts | StaleWhileRevalidate | 1 year | Local font files |
| static-images | StaleWhileRevalidate | 30 days | Image assets |
| static-assets | StaleWhileRevalidate | 24 hours | JS/CSS bundles |
| wordpress-api | NetworkFirst | 1 hour | WP REST API |
| wordpress-uploads | CacheFirst | 30 days | WP media uploads |

## Decisions Made

- Kept wrapper chain order as specified in merge guide
- PWA disabled in development mode (isDev check)
- Network timeout of 10s for WordPress API calls

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Plan Readiness

- Ready for Plan 02-02: Update layout.tsx and regenerate package-lock.json
- package.json now has all PWA dependencies
- next.config.ts has PWA wrapper ready for service worker generation

---
*Phase: 02-conflict-resolution*
*Completed: 2026-01-12*
