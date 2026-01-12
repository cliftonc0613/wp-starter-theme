# Roadmap: Headless Theme Enhancements

## Milestone 1.0: Core Enhancements

| Phase | Name | Goal | Status |
|-------|------|------|--------|
| 1 | SEO & Discoverability | RankMath REST API integration with HTML parsing utility, structured data components, enhanced sitemap | Complete |
| 2 | Performance & Caching | SWR data fetching hooks, image optimization with blur placeholders, bundle analysis | Complete |
| 3 | Search & Filtering | WordPress search endpoint, search UI components, category/tag filtering, related content | Complete |
| 4 | Testing & Monitoring | Vitest + React Testing Library, Playwright E2E tests, Sentry error tracking, health checks | In progress (2/4) |

## Phase Details

### Phase 1: SEO & Discoverability

**Goal:** Implement RankMath SEO integration to enable rich snippets and structured data in Google search results.

**Features:**
- F1.1: RankMath SEO REST API integration with HTML parsing utility
- F1.2: Structured data components (Organization, Article, Service, Breadcrumb schemas)
- F1.3: Enhanced dynamic sitemap with all content types and priority settings

**Dependencies:** RankMath SEO plugin installed, Headless CMS Support enabled

**Exit Criteria:**
- RankMath meta data fetched and parsed for all page types
- JSON-LD structured data renders correctly
- Google Rich Results Test passes for all schema types

---

### Phase 2: Performance & Caching

**Goal:** Improve client-side performance with SWR caching and optimized image loading.

**Features:**
- F2.1: SWR data fetching hooks (usePost, useServices, useSearch)
- F2.2: Image optimization component with blur placeholders
- F2.3: Bundle analysis and code splitting optimization

**Dependencies:** Phase 1 complete (SEO meta can be cached via SWR)

**Exit Criteria:**
- SWR hooks provide stale-while-revalidate caching
- Images load with blur-up effect
- Bundle size reduced, Lighthouse performance score improved

---

### Phase 3: Search & Filtering

**Goal:** Enable site-wide search and content filtering for improved discoverability.

**Features:**
- F3.1: WordPress search endpoint with multi-type support
- F3.2: Search UI components (SearchBar, SearchResults)
- F3.3: Category and tag filtering on blog/services
- F3.4: Related content suggestions

**Dependencies:** Phase 2 complete (search uses SWR hooks)

**Exit Criteria:**
- Search returns results across posts, pages, services
- Filter UI updates content without full page reload
- Related content displays on single post/service pages

---

### Phase 4: Testing & Monitoring

**Goal:** Establish testing infrastructure and production error tracking.

**Features:**
- F4.1: Unit testing setup (Vitest + React Testing Library) ✓
- F4.2: API and library tests (113 tests) ✓
- F4.3: E2E testing (Playwright)
- F4.4: Sentry error tracking integration
- F4.5: Health check API endpoints

**Dependencies:** All previous phases complete (tests cover implemented features)

**Exit Criteria:**
- Unit tests for API client, schemas, components
- E2E tests for critical user flows
- Sentry captures and reports errors
- Health endpoints return system status

---

*Roadmap created: 2026-01-11*
*Source: docs/PRD-headless-theme-enhancements.md*
