# Clemson Sports Media - PRD Translation

## Executive Summary

This document translates the original Astro-based PRD into a Headless WordPress + Next.js architecture, leveraging your existing PWA starter theme.

**Original Stack (PRD):**
- Frontend: Astro (Static Site Generation)
- Deployment: Netlify
- CMS: WordPress REST API
- Email: Mailchimp

**Target Stack (Implementation):**
- Frontend: Next.js 16.1.1 (App Router, SSR/ISR)
- Deployment: Vercel (recommended) or Netlify
- CMS: Headless WordPress (REST API)
- Email: Mailchimp (to integrate)
- PWA: Serwist (already configured)

---

## Stack Comparison & Rationale

| Aspect | Astro (Original) | Next.js (Target) | Notes |
|--------|------------------|------------------|-------|
| **Rendering** | Static Site Generation | ISR + SSR | Next.js provides more flexibility with on-demand revalidation |
| **Performance** | Excellent (static) | Excellent (ISR) | Both achieve sub-2s load times |
| **SEO** | Static pages | Dynamic + Static | Next.js metadata API is more powerful |
| **Images** | Manual optimization | `next/image` built-in | Automatic optimization, WebP, lazy loading |
| **Caching** | CDN (Netlify) | Edge + CDN (Vercel) | Vercel provides better Next.js integration |
| **PWA** | Not in PRD | Already built (Serwist) | **Bonus feature** from starter theme |
| **Preview** | Not available | Built-in support | Draft preview capability |

---

## Feature Mapping Matrix

### What Exists vs What's Needed

| PRD Feature | Status | Existing Component | Work Required |
|-------------|--------|-------------------|---------------|
| **Homepage** | | | |
| Hero section | Partial | `Hero.tsx`, `StoryBrandHero.tsx` | Redesign for sports newspaper |
| Category sections | Needs Build | - | Create category grid components |
| Newsletter form | Needs Build | `LeadCapture.tsx` (partial) | Mailchimp integration |
| Navigation | Exists | `Header.tsx` | Add sports categories |
| Search | Exists | `SearchCommand.tsx` | Works as-is |
| Mobile menu | Exists | `Header.tsx` (Sheet) | Works as-is |
| **Blog Posts** | | | |
| Post content | Exists | `blog/[slug]/page.tsx` | Works as-is |
| Featured images | Exists | `ContentImage.tsx` | Works as-is |
| Author/date | Exists | In post pages | Works as-is |
| Categories/tags | Exists | `BlogCard.tsx` | Works as-is |
| Social sharing | Needs Build | - | Create ShareButtons component |
| Related posts | Needs Build | - | Add to post pages |
| Newsletter CTA | Needs Build | - | Create PostNewsletter component |
| **SEO** | | | |
| Meta tags | Exists | `seo.ts`, metadata API | Works as-is |
| Open Graph | Exists | Post metadata | Works as-is |
| Twitter Cards | Exists | Post metadata | Works as-is |
| Schema.org | Exists | `schema.ts` | Works as-is |
| Breadcrumbs | Needs Build | - | Create Breadcrumbs component |
| **Archives** | | | |
| Category pages | Exists | `blog/page.tsx` | Needs dedicated category routes |
| Tag pages | Needs Build | - | Create tag archive routes |
| Pagination | Needs Build | - | Add pagination component |
| **Newsletter** | | | |
| Mailchimp API | Needs Build | - | Create API route + form |
| Footer form | Needs Build | `Footer.tsx` | Add newsletter section |
| Exit intent popup | Optional | - | Create modal component |
| **Performance** | | | |
| Image optimization | Exists | `next/image` | Configured |
| Caching | Exists | Serwist + ISR | Configured |
| Lazy loading | Exists | Native | Configured |

---

## Gap Analysis

### Critical Gaps (Must Have)

1. **Sports Newspaper Design System**
   - Current: Service-based business styling (dark theme)
   - Needed: Sports newspaper aesthetic with Clemson colors (#F56600, #522D80)
   - Work: Complete redesign of globals.css, component themes

2. **Category Archive Pages**
   - Current: Single blog listing with filters
   - Needed: Dedicated `/category/[slug]` routes with pagination
   - Work: Create new route structure and pagination component

3. **Tag Archive Pages**
   - Current: Tags as filters only
   - Needed: Dedicated `/tag/[slug]` routes
   - Work: Create new tag archive routes

4. **Pagination System**
   - Current: No pagination
   - Needed: Numbered pagination with prev/next
   - Work: Create reusable Pagination component

5. **Newsletter Integration**
   - Current: Lead capture form (no backend)
   - Needed: Mailchimp API integration
   - Work: API route + form components

6. **Social Sharing Buttons**
   - Current: None
   - Needed: Facebook, Twitter, LinkedIn, Copy Link
   - Work: Create ShareButtons component

7. **Related Posts**
   - Current: None
   - Needed: 3-4 related posts on post pages
   - Work: Add to wordpress.ts, update post template

8. **Breadcrumb Navigation**
   - Current: None
   - Needed: All pages with schema markup
   - Work: Create Breadcrumbs component

### Non-Critical Gaps (Nice to Have)

1. **Search Suggestions/Autocomplete**
   - Current: Basic search
   - Nice: Live search suggestions

2. **Exit Intent Popup**
   - Current: None
   - Nice: Newsletter popup on exit

3. **Author Pages**
   - Current: Not in PRD but common
   - Nice: Author archive pages

---

## Architecture Translation

### URL Structure Mapping

| PRD Route | Next.js Route | Implementation |
|-----------|---------------|----------------|
| `/` | `/app/page.tsx` | Exists (redesign) |
| `/[slug]/` | `/app/blog/[slug]/page.tsx` | Exists |
| `/category/[slug]/` | `/app/category/[slug]/page.tsx` | **Create** |
| `/category/[slug]/page/[num]/` | `/app/category/[slug]/page/[num]/page.tsx` | **Create** |
| `/tag/[slug]/` | `/app/tag/[slug]/page.tsx` | **Create** |
| `/tag/[slug]/page/[num]/` | `/app/tag/[slug]/page/[num]/page.tsx` | **Create** |
| `/search/?q=` | `/app/search/page.tsx` | **Create** |

### API Routes Needed

```
/api/newsletter/subscribe    # Mailchimp subscription
/api/search                  # Already exists
/api/revalidate              # Already exists
/api/preview                 # Already exists
```

### WordPress API Endpoints

All required endpoints are already mapped in `frontend/lib/wordpress.ts`:
- `/wp/v2/posts` - Posts
- `/wp/v2/categories` - Categories
- `/wp/v2/tags` - Tags
- `/wp/v2/pages` - Pages

**Additional endpoint needed:**
- `/wp/v2/users` - For author data (optional)

---

## Design System Translation

### Color Variables

```css
/* globals.css updates needed */
:root {
  --clemson-orange: #F56600;
  --clemson-purple: #522D80;
  --clemson-dark-purple: #2E1A47;
  --background: #FFFFFF;
  --foreground: #1a1a1a;
  --accent: var(--clemson-orange);
  --accent-secondary: var(--clemson-purple);
}
```

### Typography Recommendations

Per CLAUDE.md design guidelines (avoid generic fonts):
- **Headlines**: Oswald, Bebas Neue, or Graduate (sports feel)
- **Body**: Source Serif Pro, Merriweather, or Charter
- **Accents**: Barlow Condensed for stats/numbers

### Component Redesign List

1. `Header.tsx` - Sports navigation with categories
2. `Footer.tsx` - Newsletter + sports links
3. `BlogCard.tsx` - News card with category badge
4. `Hero.tsx` - Featured article grid (like screenshots)
5. New: `CategorySection.tsx` - Homepage category blocks
6. New: `BreakingNews.tsx` - Breaking news ticker
7. New: `FeaturedGrid.tsx` - Multi-article hero layout

---

## Performance Considerations

### Astro vs Next.js Performance

| Metric | Astro (Target) | Next.js (Achievable) | Strategy |
|--------|---------------|---------------------|----------|
| FCP | < 1.5s | < 1.5s | ISR + Edge caching |
| LCP | < 2.5s | < 2.5s | Priority image loading |
| CLS | < 0.1 | < 0.1 | Image dimensions + fonts |
| FID | < 100ms | < 100ms | Minimal client JS |

### Next.js Optimization Strategies

1. **Static Generation** for category/tag archive pages
2. **ISR** with 5-minute revalidation for post pages
3. **Edge Caching** via Vercel for API routes
4. **Image Optimization** via next/image
5. **Font Display Swap** for web fonts
6. **Critical CSS** via Tailwind's purge

### PWA Advantage (Bonus)

Your existing Serwist configuration provides:
- Offline support (not in original PRD)
- App-like install experience
- Background sync capability
- Push notification foundation

---

## Data Fetching Updates

### New Functions Needed in `wordpress.ts`

```typescript
// Pagination support
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

// Get posts by category with pagination
export async function getPostsByCategory(
  slug: string,
  page: number = 1,
  perPage: number = 12
): Promise<PaginatedResponse<WPPost>>

// Get posts by tag with pagination
export async function getPostsByTag(
  slug: string,
  page: number = 1,
  perPage: number = 12
): Promise<PaginatedResponse<WPPost>>

// Get related posts
export async function getRelatedPosts(
  postId: number,
  categoryIds: number[],
  limit: number = 4
): Promise<WPPost[]>

// Get all categories (for navigation)
export async function getAllCategories(): Promise<WPCategory[]>

// Get all tags
export async function getAllTags(): Promise<WPTag[]>
```

---

## Third-Party Integrations

### Mailchimp Integration

```typescript
// /api/newsletter/subscribe/route.ts
POST /api/newsletter/subscribe
Body: { email: string, name?: string }
Response: { success: boolean, message: string }
```

**Required:**
- Mailchimp API key (env: `MAILCHIMP_API_KEY`)
- Audience ID (env: `MAILCHIMP_AUDIENCE_ID`)
- Data center (env: `MAILCHIMP_DC`)

### Optional Integrations

1. **Analytics**: Google Analytics 4 / Plausible
2. **Comments**: Disqus / Native WP comments API
3. **Ads**: Google AdSense integration points

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| WordPress API rate limits | High | Implement caching, ISR |
| Large image sizes | Medium | next/image optimization |
| SEO parity with static | Low | Next.js metadata API is excellent |
| Build times | Low | ISR eliminates full rebuilds |
| Mailchimp API changes | Low | Abstract behind service layer |

---

## Success Criteria

### Performance Targets (Same as PRD)
- [ ] Page load < 2 seconds
- [ ] Lighthouse Performance > 95
- [ ] Core Web Vitals passing
- [ ] Mobile usability > 95

### Feature Completion
- [ ] Homepage with featured articles grid
- [ ] All category archive pages working
- [ ] All tag archive pages working
- [ ] Pagination on all archives
- [ ] Newsletter subscription working
- [ ] Social sharing functional
- [ ] Related posts on all articles
- [ ] Breadcrumbs on all pages
- [ ] Search functional
- [ ] Mobile responsive

### SEO Checklist
- [ ] Dynamic meta tags all pages
- [ ] Open Graph all pages
- [ ] Twitter Cards all pages
- [ ] JSON-LD schema all pages
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Canonical URLs set
