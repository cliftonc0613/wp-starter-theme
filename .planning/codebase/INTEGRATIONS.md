# External Integrations

**Analysis Date:** 2026-01-11

## APIs & External Services

**WordPress REST API:**
- Primary content source for all pages
- Client: Custom fetch wrapper in `frontend/lib/wordpress.ts`
- Endpoints:
  - `/wp-json/wp/v2/posts` - Blog posts
  - `/wp-json/wp/v2/pages` - Static pages
  - `/wp-json/wp/v2/services` - Services (CPT)
  - `/wp-json/wp/v2/testimonials` - Testimonials (CPT)
  - `/wp-json/wp/v2/media` - Media files
  - `/wp-json/wp/v2/categories` - Categories
  - `/wp-json/wp/v2/tags` - Tags
- Auth: Public API (no authentication required)
- Configuration: `WORDPRESS_API_URL` environment variable

**Email/SMS:**
- Status: ❌ NOT IMPLEMENTED
- Planned: Resend, SendGrid, Nodemailer, or AWS SES
- TODO in: `frontend/app/api/contact/route.ts:15`
- Current: Contact form logs to console, no email sent

**SEO Integration:**
- Status: ❌ NOT IMPLEMENTED (PRD Phase 1)
- Planned: RankMath SEO REST API
- Endpoint: `/wp-json/rankmath/v1/getHead?url=<full-url>`
- Response: HTML string requiring parsing (see PRD for implementation)

## Data Storage

**Databases:**
- WordPress MySQL - All content storage
- No direct database access from Next.js
- All data fetched via REST API

**File Storage:**
- WordPress Media Library - User uploads, images
- Remote patterns configured in `frontend/next.config.ts`:
  - Development: `http://websiteplayground.local/wp-content/uploads/**`
  - Production: `https://wpstarter.mysites.io/wp-content/uploads/**`

**Caching:**
- Next.js ISR (Incremental Static Regeneration)
- 5-second revalidation on all pages
- On-demand revalidation via webhook

## Authentication & Identity

**Auth Provider:**
- None implemented (public website)
- WordPress admin authentication separate

**API Security:**
- Preview secret: `PREVIEW_SECRET` env var
- Revalidation secret: `REVALIDATION_SECRET` env var
- Secrets validated in API routes

## Monitoring & Observability

**Error Tracking:**
- Status: ❌ NOT IMPLEMENTED (PRD Phase 4)
- Planned: Sentry integration
- Logger prepared: `frontend/lib/logger.ts` has TODO for Sentry

**Analytics:**
- Not detected
- No Google Analytics, Mixpanel, etc.

**Logs:**
- Custom logger: `frontend/lib/logger.ts`
- Development: stdout (debug, info, warn, error)
- Production: stdout (warn, error only)
- No external log aggregation

## CI/CD & Deployment

**Hosting:**
- Frontend: Vercel (configured)
  - URL: `https://wp-starter-theme-psi.vercel.app/`
  - Deployment: Automatic on Git push
  - Environment vars: Configured in Vercel dashboard
- WordPress: Flywheel/WP Engine
  - Development: Local by Flywheel at `websiteplayground.local`
  - Production: `wpstarter.mysites.io`

**CI Pipeline:**
- Not detected
- No GitHub Actions workflows found

## Environment Configuration

**Development:**
- Required env vars:
  - `WORDPRESS_API_URL` - WordPress REST API base
  - `PREVIEW_SECRET` - Draft mode authentication
  - `REVALIDATION_SECRET` - ISR webhook authentication
  - `NEXT_PUBLIC_SITE_URL` - Frontend URL
  - `NEXT_PUBLIC_SITE_NAME` - Site name for SEO
- Secrets location: `frontend/.env.local` (gitignored)
- Mock/stub services: WordPress via Local by Flywheel

**Staging:**
- Not explicitly configured
- Same structure as production with different URLs

**Production:**
- Secrets management: Vercel environment variables
- WordPress: Separate production instance
- Template: `frontend/.env.production.example`

## Webhooks & Callbacks

**Incoming:**

**ISR Revalidation:**
- Endpoint: `frontend/app/api/revalidate/route.ts`
- Trigger: WordPress `save_post` hook - `functions.php:309-351`
- Method: POST only (security)
- Verification: `REVALIDATION_SECRET` in request body
- Events: Post save, publish, trash, untrash
- Response: `{ success: boolean, message: string, paths: string[] }`

**Preview/Draft Mode:**
- Endpoint: `frontend/app/api/preview/route.ts`
- Trigger: WordPress preview button click
- Verification: `PREVIEW_SECRET` in query params
- Response: Redirect to page with draft mode enabled

**Exit Preview:**
- Endpoint: `frontend/app/api/exit-preview/route.ts`
- Trigger: User action to exit preview
- Response: Clears draft mode cookies

**Outgoing:**

**WordPress → Next.js Revalidation:**
- Location: `functions.php:309-362`
- Trigger: WordPress post save/publish/delete
- Target: `STARTER_FRONTEND_URL/api/revalidate`
- Payload: `{ secret, type, slug }`
- Error handling: Logs failure, doesn't block WordPress save

## Advanced Custom Fields (ACF)

**Plugin Integration:**
- ACF fields exposed via REST API: `functions.php:203-214`
- JSON sync enabled: `functions.php:194-199`
- Field definitions stored in: `acf-json/`

**Field Groups:**
- Services: `acf-json/group_services_fields.json`
- Testimonials: `acf-json/group_testimonials_fields.json`

**REST API Fields:**
- `acf` property added to all post type responses
- Contains: short_description, icon, features, client_name, client_title, rating, etc.

## Not Detected

- Authentication providers (Auth0, Clerk, NextAuth.js)
- Email service integration
- Error tracking service (Sentry)
- Analytics platform
- CDN (using default Next.js/Vercel)
- Payment processing (Stripe, PayPal)
- Search service (Algolia, Elasticsearch)
- Third-party CMS tools

---

*Integration audit: 2026-01-11*
*Update when adding/removing external services*
