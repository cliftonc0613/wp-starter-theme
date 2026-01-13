# Architecture

**Analysis Date:** 2026-01-12

## Pattern Overview

**Overall:** Headless WordPress + Next.js Hybrid Architecture

**Key Characteristics:**
- Decoupled CMS architecture
- WordPress serves as REST API backend only
- Next.js handles all rendering and user interaction
- Independent deployment pipelines
- ISR (Incremental Static Regeneration) for caching

## Layers

**Presentation Layer (Next.js):**
- Purpose: Server-side rendering, client-side hydration, routing
- Contains: App Router pages, layouts, React components
- Location: `frontend/app/`, `frontend/components/`
- Depends on: Service layer for data
- Used by: End users via browser

**API Layer (Next.js Routes):**
- Purpose: Handle form submissions, preview mode, cache invalidation
- Contains: Route handlers for POST requests
- Location: `frontend/app/api/`
- Depends on: WordPress API, email services (planned)
- Used by: Frontend forms, WordPress webhooks

**Service Layer (WordPress Integration):**
- Purpose: Centralized data fetching from WordPress REST API
- Contains: TypeScript interfaces, fetch functions
- Location: `frontend/lib/wordpress.ts`
- Depends on: WordPress REST API
- Used by: Page components, API routes

**Data Layer (WordPress CMS):**
- Purpose: Content management, custom post types, ACF fields
- Contains: PHP hooks, REST API endpoints
- Location: `functions.php`, `acf-json/`
- Depends on: MySQL database
- Used by: Service layer via REST API

## Data Flow

**Page Request (Blog Post):**

1. User navigates to `/blog/[slug]`
2. Next.js matches route in `frontend/app/blog/[slug]/page.tsx`
3. `getPost(slug)` called via `frontend/lib/wordpress.ts`
4. HTTP GET to WordPress REST API `/wp-json/wp/v2/posts?slug=[slug]&_embed=true`
5. WordPress returns JSON with content, images, ACF fields
6. Next.js renders HTML (SSG/ISR)
7. Browser receives static HTML
8. Client-side hydration activates React

**Contact Form Submission:**

1. User fills form in `frontend/components/ContactForm.tsx`
2. Zod validation via `frontend/lib/schemas/contact.ts`
3. POST to `frontend/app/api/contact/route.ts`
4. Server validates payload
5. Email service called (placeholder - not implemented)
6. Response returned to client
7. Toast notification displayed via Sonner

**Cache Invalidation (ISR):**

1. Editor publishes post in WordPress admin
2. `save_post` hook triggers in `functions.php`
3. `starter_theme_trigger_revalidation()` sends webhook
4. POST to `frontend/app/api/revalidate/route.ts` with secret
5. Next.js ISR invalidates the path
6. Next rebuild on next request

**State Management:**
- Server-side: Stateless request handling
- Client-side: React Hook Form for form state
- Cache: Next.js ISR + PWA service worker
- No global client state (Redux, Zustand)

## Key Abstractions

**WordPress API Client:**
- Purpose: Type-safe data fetching from WordPress
- Location: `frontend/lib/wordpress.ts` (575 lines)
- Pattern: Function-based service with TypeScript interfaces
- Examples: `getPosts()`, `getServices()`, `getTestimonials()`

**StoryBrand Components:**
- Purpose: Pre-built marketing sections
- Location: `frontend/components/storybrand/`
- Pattern: Composable React components
- Examples: `StoryBrandHero`, `ProblemSection`, `ValueStack`, `PlanSteps`

**shadcn/ui Components:**
- Purpose: Accessible UI primitives
- Location: `frontend/components/ui/`
- Pattern: Radix UI wrapped with Tailwind
- Examples: `Button`, `Card`, `Dialog`, `Form`, `Select`

**Zod Schemas:**
- Purpose: Runtime validation
- Location: `frontend/lib/schemas/`
- Pattern: Schema-first validation
- Examples: `contactFormSchema`

## Entry Points

**Next.js:**
- `frontend/app/page.tsx` - Homepage
- `frontend/app/layout.tsx` - Root layout (fonts, metadata, PWA)
- `frontend/app/blog/[slug]/page.tsx` - Blog posts
- `frontend/app/services/[slug]/page.tsx` - Services
- `frontend/app/api/*/route.ts` - API routes

**WordPress:**
- `functions.php` - Theme setup, hooks, CPTs (462 lines)
- `index.php` - Fallback template (headless notice)

## Error Handling

**Strategy:** Try/catch at boundaries, graceful degradation

**Patterns:**
- API routes return JSON with error messages
- Page components show fallback UI on fetch failure
- WordPress hooks log errors when WP_DEBUG enabled
- Toast notifications for user-facing errors

## Cross-Cutting Concerns

**Logging:**
- `frontend/lib/logger.ts` - Console-based logging utility
- WordPress `error_log()` for PHP errors
- No external error tracking (Sentry planned)

**Validation:**
- Zod schemas at API boundary
- WordPress REST API field validation
- Client-side form validation via react-hook-form

**Authentication:**
- Preview secret for draft content
- Revalidation secret for ISR webhooks
- No user authentication system

**PWA:**
- Service worker via `@ducanh2912/next-pwa`
- Offline fallback page
- Runtime caching strategies per resource type

---

*Architecture analysis: 2026-01-12*
*Update when major patterns change*
