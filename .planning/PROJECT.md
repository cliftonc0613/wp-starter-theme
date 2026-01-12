# Headless Theme Enhancements

## What This Is

A comprehensive enhancement to the mytheme headless WordPress starter, adding SEO optimization with RankMath integration, performance improvements with SWR caching, site-wide search functionality, and testing/monitoring infrastructure. The frontend is Next.js 16 with App Router serving content from WordPress via REST API.

## Core Value

**SEO & RankMath integration must work perfectly.** Rich snippets and structured data appearing in Google search results is the primary success metric. Everything else supports this goal.

## Requirements

### Validated

<!-- Shipped and confirmed valuable — existing capabilities from codebase analysis -->

- ✓ WordPress backend with Services and Testimonials custom post types — existing
- ✓ Next.js 16.1.1 frontend with App Router — existing
- ✓ REST API integration with ACF fields exposed — existing
- ✓ Preview mode for draft content — existing
- ✓ ISR revalidation webhooks from WordPress — existing
- ✓ Contact form with Zod validation — existing
- ✓ YouTube video player integration — existing
- ✓ Dark mode support — existing
- ✓ Dynamic sitemap generation — existing
- ✓ Robots.txt configuration — existing

### Active

<!-- Current scope from PRD. Building toward these. -->

**Phase 1: SEO & Discoverability (Core)**
- [ ] F1.1: RankMath SEO REST API integration with HTML parsing utility
- [ ] F1.2: Structured data components (Organization, Article, Service, Breadcrumb schemas)
- [ ] F1.3: Enhanced dynamic sitemap with all content types and priority settings

**Phase 2: Performance & Caching**
- [ ] F2.1: SWR data fetching hooks (usePost, useServices, useSearch)
- [ ] F2.2: Image optimization component with blur placeholders
- [ ] F2.3: Bundle analysis and code splitting optimization

**Phase 3: Search & Filtering**
- [ ] F3.1: WordPress search endpoint with multi-type support
- [ ] F3.2: Search UI components (SearchBar, SearchResults)
- [ ] F3.3: Category and tag filtering on blog/services
- [ ] F3.4: Related content suggestions

**Phase 4: Testing & Monitoring**
- [ ] F4.1: Unit testing setup (Jest + React Testing Library)
- [ ] F4.2: E2E testing (Playwright)
- [ ] F4.3: Sentry error tracking integration
- [ ] F4.4: Health check API endpoints

### Out of Scope

<!-- Explicit boundaries from PRD section 4.2 -->

- GraphQL implementation — future consideration, REST API sufficient for current needs
- User authentication/JWT — separate initiative, site is public content
- E-commerce functionality — not a store
- Multi-language support (i18n) — single language for v1
- WordPress admin UI customization — using default admin
- Database optimization — not performance bottleneck
- CDN configuration — handled by Vercel/hosting
- Server-side caching (Redis/Memcached) — ISR sufficient

## Context

**Existing Architecture:**
- Headless WordPress + Next.js decoupled pattern
- WordPress as REST API provider only (no theme rendering)
- 3-layer architecture: WordPress → API Bridge (`lib/wordpress.ts`) → Next.js pages
- shadcn/ui + Radix UI component library
- Tailwind CSS 4 for styling

**Current Technical Debt (from CONCERNS.md):**
- Inline styles in YouTubePlayer.tsx violating project guidelines
- Hardcoded contact info in Header.tsx
- Large monolithic API client (575 lines)
- No testing infrastructure
- Missing email integration for contact form

**PRD Source:** `docs/PRD-headless-theme-enhancements.md`

## Constraints

- **Plugin**: RankMath SEO free version (Headless CMS Support must be enabled in settings)
- **Compatibility**: Must maintain backward compatibility with existing content
- **WordPress**: Cannot modify WordPress core files
- **ACF**: Must work with existing ACF field structure
- **Hosting**: Vercel for Next.js, Flywheel/WP Engine for WordPress

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| RankMath over Yoast | RankMath has native headless CMS support, simpler API | — Pending |
| HTML parsing for RankMath | RankMath returns HTML `head` string, not structured JSON | — Pending |
| SWR for client caching | Lightweight, integrates well with Next.js, stale-while-revalidate pattern | — Pending |
| Jest + Playwright | Industry standard, good React Testing Library support | — Pending |

---
*Last updated: 2026-01-11 after initialization*
