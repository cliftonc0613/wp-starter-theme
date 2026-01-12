# Phase 3: Search & Filtering - Context

**Gathered:** 2026-01-12
**Status:** Ready for planning

<vision>
## How This Should Work

A command-palette style search experience — press Cmd/Ctrl+K or click the search icon in the header, and a modal opens with instant search results. Think Linear or Spotlight: fast, keyboard-friendly, grouped results.

Since this is a starter theme, the search should be configurable so developers can choose which content types are searchable (posts, pages, services, etc.).

Filtering on listing pages (blog, services) uses clean dropdown/select filters that also work via URL params — so `/blog?category=news` works for deep linking.

</vision>

<essential>
## What Must Be Nailed

- **Search UX** — Command palette feel: fast, keyboard-navigable, instant results
- **Developer flexibility** — Easy to configure what content types are searchable
- **Filtering capability** — Category/tag filtering on listing pages with URL-based routing

All three are equally important for a quality starter theme.

</essential>

<boundaries>
## What's Out of Scope

- Third-party search services (Algolia, ElasticSearch) — stick to WordPress native
- Fuzzy matching or "did you mean" suggestions
- Search analytics or saved searches
- Related content suggestions (can be a separate enhancement)

Keep it simple and WordPress-native for a starter theme.

</boundaries>

<specifics>
## Specific Ideas

- Use ShadCN Command component as the foundation for the search modal
- Cmd/Ctrl+K keyboard shortcut AND clickable search icon in header
- Dropdown/select filters on listing pages (not sidebar or tag cloud)
- URL-based filtering (`?category=X`) for deep-linkable filtered views
- WordPress REST API search endpoint for native search

</specifics>

<notes>
## Additional Context

This is a starter theme — prioritize simplicity and developer configurability over advanced features. The goal is a solid foundation that developers can extend, not a feature-complete search system.

ShadCN components are preferred for consistency with the existing UI component library.

</notes>

---

*Phase: 3-search-filtering*
*Context gathered: 2026-01-12*
