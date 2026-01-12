# Phase 1: SEO & Discoverability - Context

**Gathered:** 2026-01-11
**Status:** Ready for planning

<vision>
## How This Should Work

Rich snippets everywhere. When someone searches for the site on Google, every page should show enhanced results — not just basic blue links. Think breadcrumb trails, article dates, organization info, FAQ accordions, the works.

The goal is to match Google's own documentation pages: clean structured data that Google rewards with premium SERP real estate. Their SEO Starter Guide page is the reference — breadcrumbs, expandable "Things to know" sections, highlighted key terms.

RankMath handles the meta data in WordPress, but the headless Next.js frontend needs to fetch it, parse it, and render proper JSON-LD structured data that Google can consume.

</vision>

<essential>
## What Must Be Nailed

- **RankMath integration that just works** — Set it up once, meta data flows automatically to all pages without manual intervention
- **Schema/structured data perfection** — JSON-LD that passes Google's Rich Results Test on every page type
- **Both working together** — Can't have rich snippets without both the meta pipeline AND the structured data rendering correctly

</essential>

<boundaries>
## What's Out of Scope

- Performance optimization (caching, SWR) — that's Phase 2
- Search functionality — getting indexed well is separate from site search
- Testing infrastructure — Phase 4
- PRD scope is otherwise complete as-is

</boundaries>

<specifics>
## Specific Ideas

- Reference: Google's SEO Starter Guide page (https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- Want the breadcrumb trail pattern (Site › Section › Page)
- Want FAQ/HowTo schema where applicable (the expandable "Things to know" accordion pattern)
- Every content type should have appropriate schema: Organization, Article, Service, Breadcrumb

</specifics>

<notes>
## Additional Context

RankMath returns HTML string from its REST API, not structured JSON. Will need an HTML parsing utility to extract meta tags and JSON-LD from the response. This is a known technical requirement from the PRD.

The core value from PROJECT.md: "SEO & RankMath integration must work perfectly. Rich snippets and structured data appearing in Google search results is the primary success metric."

</notes>

---

*Phase: 1-seo-discoverability*
*Context gathered: 2026-01-11*
