# Architecture

**Analysis Date:** 2026-01-11

## Pattern Overview

**Overall:** Headless WordPress + Next.js Decoupled Architecture

**Key Characteristics:**
- WordPress functions as content management backend (REST API only)
- Next.js serves as the frontend application (App Router)
- Communication happens exclusively through WordPress REST API
- No traditional WordPress theme rendering used
- ISR (Incremental Static Regeneration) for caching with on-demand revalidation

## Layers

**Layer 1: WordPress Backend (Root Level)**
- Purpose: Content management and REST API provider
- Contains: Theme setup, custom post types (Services, Testimonials), REST API customization
- Location: `functions.php`, `index.php`, `style.css`, `acf-json/`
- Depends on: WordPress core, ACF plugin
- Used by: Next.js frontend via REST API

**Layer 2: API Bridge & Data Fetching**
- Purpose: Central API client with TypeScript interfaces for all content types
- Contains: Fetch functions, URL rewriting, HTML utilities, caching strategies
- Location: `frontend/lib/wordpress.ts` (575 lines)
- Depends on: WordPress REST API
- Used by: Page components and API routes

**Layer 3: Next.js Frontend**
- Purpose: Server-rendered pages with React components
- Contains: App Router pages, API routes, React components
- Location: `frontend/app/`, `frontend/components/`
- Depends on: API bridge (lib/wordpress.ts)
- Used by: End users via browser

**Layer 4: UI Components**
- Purpose: Reusable React components
- Contains: shadcn/ui primitives, StoryBrand sections, content components
- Location: `frontend/components/ui/`, `frontend/components/storybrand/`
- Depends on: Radix UI, Tailwind CSS
- Used by: Page components

## Data Flow

**Content Publishing Flow:**

1. Editor creates/updates post in WordPress admin
2. WordPress `save_post` hook triggers - `functions.php:309-351`
3. WordPress makes HTTP POST to `frontend/app/api/revalidate/route.ts`
4. Next.js revalidates affected paths using `revalidatePath()`
5. ISR with 5-second revalidation window keeps cache fresh

**Page Rendering Flow:**

1. User visits Next.js page (e.g., `/blog/[slug]`)
2. Page component calls `getPost(slug)` from `lib/wordpress.ts`
3. WordPress.ts makes fetch request to `WORDPRESS_API_URL/wp-json/wp/v2/posts`
4. Response includes ACF fields, featured images, author data
5. Page renders with data, applies ISR caching

**Preview Mode Flow:**

1. Editor clicks "Preview" in WordPress
2. WordPress constructs URL to `frontend/api/preview?secret=...&slug=...&type=...`
3. `/api/preview/route.ts` validates secret and enables Draft Mode
4. Redirects to appropriate page path with preview=true query param
5. Page fetches latest unpublished content from WordPress

**State Management:**
- File-based: All content lives in WordPress database
- No persistent in-memory state in Next.js
- Each page request fetches from WordPress or ISR cache

## Key Abstractions

**WordPress API Client:**
- Purpose: Encapsulate all WordPress REST API interactions
- Location: `frontend/lib/wordpress.ts`
- Pattern: Module with exported async functions
- Examples: `getPosts()`, `getPost()`, `getServices()`, `getTestimonials()`, `getPage()`

**Page Components:**
- Purpose: Server components that fetch and render content
- Location: `frontend/app/*/page.tsx`
- Pattern: Async server components with `generateStaticParams()` and `generateMetadata()`
- Examples: `app/page.tsx`, `app/blog/[slug]/page.tsx`, `app/services/[slug]/page.tsx`

**UI Components:**
- Purpose: Reusable presentational components
- Location: `frontend/components/*.tsx`
- Pattern: Props interface + exported function component
- Examples: `Header.tsx`, `Footer.tsx`, `BlogCard.tsx`, `ServiceCard.tsx`

**StoryBrand Components:**
- Purpose: Marketing page sections following StoryBrand framework
- Location: `frontend/components/storybrand/`
- Pattern: Section components for homepage
- Examples: `StoryBrandHero.tsx`, `ProblemSection.tsx`, `GuideSection.tsx`

## Entry Points

**WordPress Entry:**
- Location: `functions.php`
- Triggers: WordPress initialization, post saves, REST API requests
- Responsibilities: Register post types, customize REST API, trigger revalidation

**Next.js Entry:**
- Location: `frontend/app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Root layout with Header, Footer, global styles, fonts

**API Routes:**
- Location: `frontend/app/api/*/route.ts`
- Triggers: HTTP requests to `/api/*` endpoints
- Responsibilities:
  - `/api/revalidate` - ISR cache invalidation from WordPress
  - `/api/preview` - Enable draft mode for content preview
  - `/api/exit-preview` - Disable draft mode
  - `/api/contact` - Contact form submission

## Error Handling

**Strategy:** Try/catch at API route level, `notFound()` for missing content

**Patterns:**
- API routes return NextResponse with appropriate status codes
- Page components use `notFound()` from `next/navigation` for missing content
- Logger abstraction in `frontend/lib/logger.ts` (environment-aware)
- Missing: Error boundaries for client-side errors

## Cross-Cutting Concerns

**Logging:**
- Logger abstraction: `frontend/lib/logger.ts`
- Development: Verbose (debug, info, warn, error)
- Production: Minimal (warn, error only)
- TODO: Sentry integration for error tracking

**Validation:**
- Zod schemas at API boundary: `frontend/lib/schemas/contact.ts`
- Shared between client and server for contact form

**Caching:**
- ISR with 5-second revalidation on all pages
- On-demand revalidation via `/api/revalidate` webhook
- Path-aware revalidation (blog post triggers homepage revalidation)

**Authentication:**
- Not implemented (public site)
- Preview/revalidation protected by secrets in environment variables

---

*Architecture analysis: 2026-01-11*
*Update when major patterns change*
