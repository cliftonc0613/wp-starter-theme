# Phase 3 Plan 01: Search Infrastructure

**Phase:** 3-search-filtering
**Plan:** 01
**Focus:** WordPress search API integration and ShadCN Command component installation

## Context

This plan establishes the foundation for the search system by:
1. Adding a search function to the WordPress API lib
2. Installing the ShadCN Command component for the modal UI
3. Creating a searchable content type configuration system

## Prerequisites

- Phase 2 complete (verified)
- Existing `lib/wordpress.ts` with getPosts, getPages, getServices functions
- ShadCN UI library installed (dialog, input components present)

## Tasks

### Task 1: Add WordPress Search API Function (auto)

**Files to modify:**
- `frontend/lib/wordpress.ts`

**Implementation:**
```typescript
// Add search interface
export interface SearchResult {
  id: number;
  type: 'post' | 'page' | 'service';
  title: string;
  excerpt: string;
  slug: string;
  url: string;
}

// Add search function using WordPress native search
export async function search(params: {
  query: string;
  types?: ('post' | 'page' | 'service')[];
  per_page?: number;
}): Promise<SearchResult[]> {
  const { query, types = ['post', 'page', 'service'], per_page = 10 } = params;

  if (!query.trim()) return [];

  const results: SearchResult[] = [];

  // Search each content type in parallel
  const searches = types.map(async (type) => {
    const endpoint = type === 'post' ? 'posts' : type === 'page' ? 'pages' : 'services';
    const items = await fetchAPI<Array<{
      id: number;
      slug: string;
      title: { rendered: string };
      excerpt: { rendered: string };
    }>>(`/${endpoint}?search=${encodeURIComponent(query)}&per_page=${per_page}`);

    return items.map(item => ({
      id: item.id,
      type,
      title: decodeHtmlEntities(item.title.rendered),
      excerpt: stripHtml(item.excerpt.rendered).slice(0, 150),
      slug: item.slug,
      url: type === 'post' ? `/blog/${item.slug}`
         : type === 'page' ? `/${item.slug}`
         : `/services/${item.slug}`,
    }));
  });

  const searchResults = await Promise.all(searches);
  return searchResults.flat();
}
```

**Commit:** `feat(3-01): add WordPress search API function`

### Task 2: Install ShadCN Command Component (auto)

**Commands to run:**
```bash
cd frontend && npx shadcn@latest add command
```

This will install:
- `components/ui/command.tsx` - Command palette component
- Dependencies: `cmdk` package

**Commit:** `feat(3-01): add ShadCN Command component`

### Task 3: Create Search Configuration (auto)

**Files to create:**
- `frontend/lib/search-config.ts`

**Implementation:**
```typescript
/**
 * Search Configuration
 *
 * Configurable search settings for the starter theme.
 * Developers can customize which content types are searchable.
 */

export interface SearchableType {
  type: 'post' | 'page' | 'service';
  label: string;
  icon: string; // Lucide icon name
  enabled: boolean;
}

/**
 * Default searchable content types.
 * Modify this array to customize what content is searchable.
 */
export const SEARCHABLE_TYPES: SearchableType[] = [
  { type: 'post', label: 'Blog Posts', icon: 'FileText', enabled: true },
  { type: 'page', label: 'Pages', icon: 'File', enabled: true },
  { type: 'service', label: 'Services', icon: 'Briefcase', enabled: true },
];

/**
 * Get enabled search types
 */
export function getEnabledSearchTypes(): SearchableType[] {
  return SEARCHABLE_TYPES.filter(t => t.enabled);
}

/**
 * Get search type by key
 */
export function getSearchType(type: string): SearchableType | undefined {
  return SEARCHABLE_TYPES.find(t => t.type === type);
}
```

**Commit:** `feat(3-01): add search configuration for content types`

## Verification

After completing all tasks:
1. Verify `search()` function is exported from `lib/wordpress.ts`
2. Verify Command component exists at `components/ui/command.tsx`
3. Verify search config exports `SEARCHABLE_TYPES` and helper functions
4. Run `npm run build` to ensure no TypeScript errors

## Success Criteria

- [ ] WordPress search API function works with native WP search endpoint
- [ ] ShadCN Command component installed and importable
- [ ] Search configuration allows developers to customize searchable types
- [ ] All TypeScript types properly defined
- [ ] Build passes with no errors

---

*Phase: 3-search-filtering*
*Estimated tasks: 3*
*Commit prefix: feat(3-01)*
