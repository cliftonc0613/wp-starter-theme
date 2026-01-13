# Roadmap: PWA Merge into Develop

## Overview

Merge PWA features from `claude/wordpress-pwa-compatibility-yqSbG` branch into `develop` branch. This is a careful integration task: resolve conflicts, combine code, verify everything works together. No new features—only merging existing implementations.

## Domain Expertise

None — this is a git merge and verification task, not domain-specific development.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Branch Preparation** - Set up merge workspace on develop branch
- [x] **Phase 2: Conflict Resolution** - Resolve 4 conflicting files per merge guide
- [x] **Phase 3: File Integration** - Add new PWA files from feature branch
- [x] **Phase 4: Build Verification** - Ensure build passes and tests run
- [ ] **Phase 5: PWA Verification** - Verify PWA functionality works correctly

## Phase Details

### Phase 1: Branch Preparation
**Goal**: Set up proper workspace for the merge
**Depends on**: Nothing (first phase)
**Research**: Unlikely (standard git operations)
**Plans**: 1 plan

Plans:
- [x] 01-01: Checkout develop, ensure clean state, create merge workspace

### Phase 2: Conflict Resolution
**Goal**: Resolve all 4 conflicting files per docs/merge-pwa-into-develop.md
**Depends on**: Phase 1
**Research**: Unlikely (documented resolution steps)
**Plans**: 2 plans

Plans:
- [x] 02-01: Resolve package.json and next.config.ts conflicts
- [x] 02-02: Resolve layout.tsx and regenerate package-lock.json

Conflict files:
1. `frontend/package.json` — merge deps and scripts
2. `frontend/next.config.ts` — chain PWA + BundleAnalyzer + Sentry wrappers
3. `frontend/app/layout.tsx` — add PWA metadata to develop structure
4. `frontend/package-lock.json` — delete and regenerate

### Phase 3: File Integration
**Goal**: Add all new PWA files from feature branch
**Depends on**: Phase 2
**Research**: Unlikely (file copy operations)
**Plans**: 1 plan

Plans:
- [x] 03-01: Add offline page, manifest, icons, and generation script

New files to add:
- `frontend/app/offline/page.tsx`
- `frontend/public/manifest.json`
- `frontend/public/icons/*` (10 PWA icons)
- `frontend/scripts/generate-icons.mjs`

### Phase 4: Build Verification
**Goal**: Confirm build passes and tests run without errors
**Depends on**: Phase 3
**Research**: Unlikely (standard build commands)
**Plans**: 1 plan

Plans:
- [x] 04-01: Run npm install, npm run build, npm run test

Success criteria:
- `npm run build` completes without errors
- `npm run test` passes (if tests exist)
- No TypeScript errors

### Phase 5: PWA Verification
**Goal**: Verify PWA features work correctly in production build
**Depends on**: Phase 4
**Research**: Unlikely (manual verification)
**Plans**: 1 plan

Plans:
- [ ] 05-01: Test service worker, manifest, and offline fallback

Verification checklist:
- [ ] Service worker registers in production build
- [ ] Manifest loads at `/manifest.json`
- [ ] Offline fallback page works when disconnected

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Branch Preparation | 1/1 | Complete | 2026-01-12 |
| 2. Conflict Resolution | 2/2 | Complete | 2026-01-12 |
| 3. File Integration | 1/1 | Complete | 2026-01-12 |
| 4. Build Verification | 1/1 | Complete | 2026-01-12 |
| 5. PWA Verification | 0/1 | Not started | - |

---
*Created: 2026-01-12*
