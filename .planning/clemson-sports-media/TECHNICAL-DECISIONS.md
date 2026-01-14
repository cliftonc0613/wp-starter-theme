# Clemson Sports Media - Technical Decisions

## Stack Decision: Why Next.js Over Astro

### Trade-offs Analysis

| Factor | Astro | Next.js | Winner |
|--------|-------|---------|--------|
| **Static Performance** | Excellent | Excellent (ISR) | Tie |
| **Dynamic Content** | Limited | Native SSR/ISR | Next.js |
| **Preview Mode** | Complex | Built-in | Next.js |
| **Image Optimization** | Manual | Automatic | Next.js |
| **PWA Support** | Add-on | Already configured | Next.js |
| **Learning Curve** | New framework | Existing codebase | Next.js |
| **Deployment** | Netlify | Vercel (better DX) | Next.js |
| **Incremental Updates** | Full rebuild | On-demand ISR | Next.js |

### Decision Rationale

1. **Existing Investment**: Your PWA starter already has 90% of the infrastructure
2. **ISR Advantage**: No full rebuilds needed when content changes
3. **Preview Mode**: Draft preview already implemented
4. **PWA Bonus**: Offline support, installable app (not in original PRD)
5. **Vercel Edge**: Superior performance for Next.js apps
6. **TypeScript**: Full type safety already configured

---

## Rendering Strategy

### Page-by-Page Approach

| Page Type | Rendering | Revalidation | Rationale |
|-----------|-----------|--------------|-----------|
| Homepage | ISR | 5 min | Fresh content, frequent updates |
| Blog Posts | ISR | 5 min | Content rarely changes |
| Category Archives | ISR | 10 min | Medium update frequency |
| Tag Archives | ISR | 10 min | Medium update frequency |
| Search Results | SSR | - | Dynamic user input |
| Static Pages | SSG | Build | Never changes |

### Caching Layers

```
User → Vercel Edge Cache → ISR Cache → WordPress API
         ↓ (miss)              ↓ (miss)
    Origin Server        API with Timestamp
```

---

## Design System Decisions

### Typography Selection

**Rejected (per CLAUDE.md):**
- Inter, Roboto, Arial (generic)
- Space Grotesk (AI-overused)

**Selected:**
- **Headlines**: Oswald - Bold, condensed, sports newspaper feel
- **Body**: Source Serif Pro - Readable, professional
- **Stats/Numbers**: Barlow Condensed - Modern, data-forward

### Color System

```css
/* Primary Clemson */
--clemson-orange: #F56600;    /* CTA, accents, badges */
--clemson-purple: #522D80;    /* Headers, navigation */
--clemson-dark: #2E1A47;      /* Footer, dark sections */

/* Neutrals */
--white: #FFFFFF;             /* Backgrounds */
--gray-100: #F5F5F5;          /* Card backgrounds */
--gray-900: #1A1A1A;          /* Body text */

/* Semantic */
--breaking: #DC2626;          /* Breaking news badge */
--exclusive: #DC2626;         /* Exclusive content */
```

### Component Design Patterns

1. **Card Overlays**: Category badges on image overlay (per reference images)
2. **Bold Headlines**: High contrast, uppercase for sections
3. **Red Accents**: Breaking/Exclusive badges in red
4. **Grid Layouts**: Magazine-style asymmetric grids

---

## Data Architecture

### WordPress REST API Extensions

**Standard Endpoints Used:**
```
GET /wp/v2/posts
GET /wp/v2/posts?categories={id}&page={n}&per_page=12
GET /wp/v2/posts?tags={id}&page={n}&per_page=12
GET /wp/v2/categories
GET /wp/v2/tags
```

**Response Headers Utilized:**
```
X-WP-Total: Total items
X-WP-TotalPages: Total pages
```

### Pagination Interface

```typescript
interface PaginatedResult<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Related Posts Algorithm

```typescript
// Priority order for related posts:
// 1. Same primary category, same tags
// 2. Same primary category, different tags
// 3. Different category, same tags
// 4. Fallback: recent posts
```

---

## Component Architecture

### New Component Hierarchy

```
Homepage
├── Header (nav + search)
├── FeaturedGrid
│   ├── FeaturedArticle (large)
│   └── FeaturedArticle (small) x4
├── BreakingNews (ticker)
├── CategorySection x N
│   ├── SectionHeader
│   └── BlogCard x 4
├── NewsletterSection
└── Footer

CategoryArchive
├── Header
├── Breadcrumbs
├── ArchiveHeader
├── BlogCard x 12
├── Pagination
└── Footer

BlogPost
├── Header
├── Breadcrumbs
├── ArticleHeader
│   ├── CategoryBadge
│   ├── Title
│   └── AuthorInfo
├── FeaturedImage
├── ArticleContent
├── ShareButtons
├── RelatedPosts
├── NewsletterCTA
└── Footer
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `FeaturedGrid` | Homepage hero with large + small articles |
| `CategorySection` | Homepage category block with 4 articles |
| `BlogCard` | Article preview with image, title, meta |
| `Pagination` | Numbered page navigation |
| `ShareButtons` | Social sharing (FB, X, LinkedIn, Copy) |
| `RelatedPosts` | 3-4 related articles grid |
| `NewsletterForm` | Email subscription form |
| `Breadcrumbs` | Navigation path with schema |
| `CategoryBadge` | Styled category label |
| `AuthorInfo` | Author name, avatar, date |

---

## API Design

### Newsletter Subscription

```typescript
// POST /api/newsletter/subscribe
interface SubscribeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];  // Optional segmentation
}

interface SubscribeResponse {
  success: boolean;
  message: string;
  error?: {
    code: string;
    detail: string;
  };
}
```

### Error Handling Strategy

```typescript
// Consistent error format across APIs
interface APIError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Error codes
const ErrorCodes = {
  ALREADY_SUBSCRIBED: 'EMAIL_EXISTS',
  INVALID_EMAIL: 'INVALID_EMAIL',
  RATE_LIMITED: 'RATE_LIMITED',
  API_ERROR: 'MAILCHIMP_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const;
```

---

## SEO Implementation

### Meta Tags Strategy

```typescript
// Dynamic metadata generation pattern
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage?.url],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage?.url],
    },
  };
}
```

### Schema.org Types

| Page | Schema Type |
|------|-------------|
| Homepage | `WebSite`, `Organization` |
| Blog Post | `Article`, `BreadcrumbList` |
| Category | `CollectionPage`, `BreadcrumbList` |
| Tag | `CollectionPage`, `BreadcrumbList` |
| Author | `ProfilePage`, `Person` |

---

## Performance Targets

### Lighthouse Goals

| Metric | Target | Strategy |
|--------|--------|----------|
| Performance | >95 | ISR, image optimization |
| Accessibility | >95 | Semantic HTML, ARIA |
| Best Practices | >95 | HTTPS, no console errors |
| SEO | >95 | All meta tags, structured data |

### Core Web Vitals

| Metric | Target | Implementation |
|--------|--------|----------------|
| LCP | <2.5s | Priority image loading, ISR |
| FID | <100ms | Minimal JS, code splitting |
| CLS | <0.1 | Image dimensions, font display |
| INP | <200ms | Event delegation, debouncing |

---

## Security Considerations

### API Security

```typescript
// Rate limiting for newsletter
const rateLimit = {
  window: 60 * 1000,  // 1 minute
  max: 5,             // 5 requests per window
};

// Input validation
const subscribeSchema = z.object({
  email: z.string().email().max(254),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
});
```

### Environment Variables

```
# Never expose these client-side
MAILCHIMP_API_KEY=server-only
REVALIDATION_SECRET=server-only

# Safe for client
NEXT_PUBLIC_SITE_URL=ok-to-expose
NEXT_PUBLIC_SITE_NAME=ok-to-expose
```

---

## Testing Approach

### Critical Paths to Test

1. **Homepage Load** → All sections render
2. **Category Navigation** → Click category → Archive loads
3. **Pagination** → Navigate pages → Content updates
4. **Post Read** → Open post → Content + related display
5. **Share** → Click share → Opens share dialog
6. **Newsletter** → Submit email → Success message
7. **Search** → Enter query → Results display

### Test Data Strategy

```typescript
// Mock WordPress responses for unit tests
const mockPost: WPPost = {
  id: 1,
  slug: 'test-post',
  title: { rendered: 'Test Post' },
  // ... full mock
};

// Use actual API for E2E tests
// with specific test content in WordPress
```

---

## Monitoring & Observability

### Sentry Integration (Existing)

- Client-side error tracking
- Server-side error tracking
- Performance monitoring
- Session replay (optional)

### Custom Metrics to Track

```typescript
// Analytics events
trackEvent('newsletter_subscribe', { location: 'footer' });
trackEvent('article_share', { platform: 'twitter', slug });
trackEvent('search_performed', { query, results: count });
trackEvent('pagination_click', { category, page });
```

---

## Migration Notes

### From Existing Theme

1. **Keep**: PWA config, Sentry, testing setup, TypeScript config
2. **Replace**: Homepage components (StoryBrand → Sports)
3. **Extend**: wordpress.ts (add pagination functions)
4. **Add**: New routes (category, tag, search)
5. **Update**: Design system (colors, typography)

### Data Compatibility

- WordPress REST API format is standard
- No data migration needed
- Switch `WORDPRESS_API_URL` to clemsonsportsmedia.com
