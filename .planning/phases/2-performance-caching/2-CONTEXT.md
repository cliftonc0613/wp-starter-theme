# Phase 2: Performance & Caching - Context

**Gathered:** 2026-01-11
**Status:** Ready for planning

<vision>
## How This Should Work

The site should feel like Vercel.com or Linear.app — snappy, instant, everything loads before you even realize you were waiting. Pages serve cached data immediately, then quietly refresh in the background so content stays fresh without any spinners or loading states.

Images load with a polished blur-up effect like Medium — a low-quality placeholder that gracefully sharpens into the full image. This applies to ALL images on the site, not just featured images. The whole experience should feel premium and smooth.

For developers, the codebase should be leaner and easier to work with. Simple hooks for fetching data, faster builds, and visibility into what's happening with caching and performance.

</vision>

<essential>
## What Must Be Nailed

- **Instant feel** — SWR caching so all content types (posts, services, pages) load immediately from cache
- **Blur-up images** — Medium-style placeholder loading for every image on the site
- **Developer experience** — Simpler data fetching hooks, faster builds, better debugging visibility
- **Green Lighthouse scores** — Important for SEO and user trust (connects to Phase 1 work)
- **Real-time freshness** — WordPress changes should appear within seconds (stale-while-revalidate)
- **Mobile first** — Optimize for slower connections, mobile users are priority

</essential>

<boundaries>
## What's Out of Scope

- Search functionality (that's Phase 3, though foundation can be laid)
- Mega menu / navigation redesign (noted for future)
- CDN/edge infrastructure changes (focus on client-side optimizations)

</boundaries>

<specifics>
## Specific Ideas

- Blur-up image loading like Medium — LQIP that sharpens into full image
- Reference sites: Vercel.com and Linear.app for the snappy, instant navigation feel
- SWR hooks: usePost, useServices, usePages at minimum
- Related content hooks would be nice to have
- Silent background updates (no visual indication needed when cache refreshes)
- Whatever approach is fastest for blur placeholder generation

</specifics>

<notes>
## Additional Context

User mentioned liking mega menus on Vercel and Linear — noted for potential future work but not part of this phase.

All three aspects (instant feel, images, dev tooling) are equally important — can't ship without all three working together.

No specific performance pain points currently, but Lighthouse scores matter for the SEO investment made in Phase 1.

Phase 1 complete with RankMath integration and structured data — this phase builds on that SEO foundation with performance optimizations.

</notes>

---

*Phase: 2-performance-caching*
*Context gathered: 2026-01-11*
