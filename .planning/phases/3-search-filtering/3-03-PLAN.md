# Phase 3 Plan 03: Listing Page Filters

**Phase:** 3-search-filtering
**Plan:** 03
**Focus:** Category/tag filters on blog page with URL-based routing

## Context

This plan adds filtering capability to listing pages:
1. CategoryFilter component using ShadCN Select
2. URL-based filtering (`/blog?category=news`)
3. Blog page integration with filter support
4. Deep-linkable filtered views

## Prerequisites

- Plan 3-01 complete (search API infrastructure)
- Plan 3-02 complete (search modal UI)
- Existing blog page at `frontend/app/blog/page.tsx`
- ShadCN Select component already installed

## Tasks

### Task 1: Create CategoryFilter Component (auto)

**Files to create:**
- `frontend/components/CategoryFilter.tsx`

**Implementation:**
```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WPCategory } from "@/lib/wordpress";

interface CategoryFilterProps {
  categories: WPCategory[];
  /** Base path for the filtered view (e.g., "/blog") */
  basePath: string;
  /** Query parameter name (default: "category") */
  paramName?: string;
  /** Placeholder text (default: "All Categories") */
  placeholder?: string;
}

export function CategoryFilter({
  categories,
  basePath,
  paramName = "category",
  placeholder = "All Categories",
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get(paramName) || "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }

    // Reset to page 1 when changing filters
    params.delete("page");

    const queryString = params.toString();
    const url = queryString ? `${basePath}?${queryString}` : basePath;
    router.push(url);
  };

  return (
    <Select value={currentCategory || "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.slug}>
            {category.name} ({category.count})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Commit:** `feat(3-03): create CategoryFilter component with URL routing`

### Task 2: Create TagFilter Component (auto)

**Files to create:**
- `frontend/components/TagFilter.tsx`

**Implementation:**
```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WPTag } from "@/lib/wordpress";

interface TagFilterProps {
  tags: WPTag[];
  /** Base path for the filtered view (e.g., "/blog") */
  basePath: string;
  /** Query parameter name (default: "tag") */
  paramName?: string;
  /** Placeholder text (default: "All Tags") */
  placeholder?: string;
}

export function TagFilter({
  tags,
  basePath,
  paramName = "tag",
  placeholder = "All Tags",
}: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get(paramName) || "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }

    // Reset to page 1 when changing filters
    params.delete("page");

    const queryString = params.toString();
    const url = queryString ? `${basePath}?${queryString}` : basePath;
    router.push(url);
  };

  return (
    <Select value={currentTag || "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag.id} value={tag.slug}>
            {tag.name} ({tag.count})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Commit:** `feat(3-03): create TagFilter component`

### Task 3: Create BlogFilters Wrapper Component (auto)

**Files to create:**
- `frontend/components/BlogFilters.tsx`

**Implementation:**
```tsx
"use client";

import { Suspense } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { TagFilter } from "./TagFilter";
import type { WPCategory, WPTag } from "@/lib/wordpress";

interface BlogFiltersProps {
  categories: WPCategory[];
  tags: WPTag[];
}

// Wrapper component that handles the useSearchParams Suspense requirement
function BlogFiltersInner({ categories, tags }: BlogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter by:</span>
        <CategoryFilter categories={categories} basePath="/blog" />
      </div>
      {tags.length > 0 && (
        <TagFilter tags={tags} basePath="/blog" />
      )}
    </div>
  );
}

export function BlogFilters({ categories, tags }: BlogFiltersProps) {
  return (
    <Suspense fallback={<div className="h-10 w-[400px] animate-pulse rounded bg-muted" />}>
      <BlogFiltersInner categories={categories} tags={tags} />
    </Suspense>
  );
}
```

**Commit:** `feat(3-03): create BlogFilters wrapper component`

### Task 4: Update Blog Page with Filters (auto)

**Files to modify:**
- `frontend/app/blog/page.tsx`

**Changes:**
1. Accept `searchParams` prop for URL-based filtering
2. Fetch categories and tags for filter dropdowns
3. Filter posts by category/tag when params present
4. Add BlogFilters component above post grid

**Updated implementation:**
```tsx
import type { Metadata } from "next";
import { getPosts, getCategories, getTags, isWordPressConfigured } from "@/lib/wordpress";
import type { WPPost, WPCategory, WPTag } from "@/lib/wordpress";
import { Hero } from "@/components/Hero";
import { BlogCard } from "@/components/BlogCard";
import { BlogFilters } from "@/components/BlogFilters";
import { BodyClass } from "@/components/BodyClass";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read our latest articles, insights, and updates on industry trends and best practices.",
};

// Force dynamic rendering for filter support
export const dynamic = 'force-dynamic';

interface BlogPageProps {
  searchParams: Promise<{ category?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  let posts: WPPost[] = [];
  let categories: WPCategory[] = [];
  let tags: WPTag[] = [];

  if (isWordPressConfigured()) {
    try {
      // Fetch categories and tags for filters
      [categories, tags] = await Promise.all([
        getCategories({ hide_empty: true }),
        getTags({ hide_empty: true }),
      ]);

      // Build filter params
      const filterParams: Parameters<typeof getPosts>[0] = { per_page: 12 };

      // Filter by category slug
      if (params.category) {
        const category = categories.find(c => c.slug === params.category);
        if (category) {
          filterParams.categories = [category.id];
        }
      }

      // Filter by tag slug
      if (params.tag) {
        const tag = tags.find(t => t.slug === params.tag);
        if (tag) {
          filterParams.tags = [tag.id];
        }
      }

      posts = await getPosts(filterParams);
    } catch (error) {
      console.error('Failed to fetch blog data:', error);
    }
  }

  const activeFilterLabel = params.category
    ? categories.find(c => c.slug === params.category)?.name
    : params.tag
    ? tags.find(t => t.slug === params.tag)?.name
    : null;

  return (
    <>
      <BodyClass className="page-blog" />

      <Hero
        title="Our Blog"
        subtitle="Insights, updates, and resources to help you stay informed and grow your business."
        size="default"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Filters */}
          {categories.length > 0 && (
            <div className="mb-8">
              <BlogFilters categories={categories} tags={tags} />
              {activeFilterLabel && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Showing posts in: <span className="font-medium">{activeFilterLabel}</span>
                </p>
              )}
            </div>
          )}

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                {activeFilterLabel
                  ? `No posts found in "${activeFilterLabel}". Try a different filter.`
                  : "No blog posts yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
```

**Commit:** `feat(3-03): integrate filters into blog page with URL routing`

## Verification (human)

After completing all tasks:
1. Visit `/blog` - should show all posts with filter dropdowns
2. Select a category - URL should update to `/blog?category=slug`
3. Page should reload showing only posts in that category
4. Select "All Categories" - URL should return to `/blog`
5. Copy filtered URL and open in new tab - should show filtered view
6. Test tag filter similarly
7. Test combining category and tag filters

## Success Criteria

- [ ] Category filter dropdown shows all categories with post counts
- [ ] Tag filter dropdown shows all tags with post counts
- [ ] Selecting a filter updates URL with query param
- [ ] Page shows filtered posts based on URL params
- [ ] Deep-linking works (copy/paste filtered URL)
- [ ] "All" option clears the filter
- [ ] Active filter is indicated below filters
- [ ] Empty state shows helpful message when no posts match

---

*Phase: 3-search-filtering*
*Estimated tasks: 4*
*Commit prefix: feat(3-03)*
