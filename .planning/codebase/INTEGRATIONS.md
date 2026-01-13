# External Integrations

**Analysis Date:** 2026-01-12

## APIs & External Services

**WordPress REST API:**
- Primary data source for all content
- Client: `frontend/lib/wordpress.ts` (custom TypeScript client)
- Endpoints used:
  - `/wp-json/wp/v2/posts` - Blog posts
  - `/wp-json/wp/v2/pages` - Static pages
  - `/wp-json/wp/v2/services` - Custom post type
  - `/wp-json/wp/v2/testimonials` - Custom post type
  - `/wp-json/wp/v2/categories` - Taxonomies
- Auth: None (public REST API)
- Features: `_embed=true` for linked resources

**Email/SMS:**
- Not configured
- Placeholder in `frontend/app/api/contact/route.ts`
- Documented options: Resend, SendGrid, Nodemailer, AWS SES
- TODO comment at line 15

**External APIs:**
- None currently integrated

## Data Storage

**Databases:**
- WordPress MySQL - Primary content storage
- Connection: Managed by WordPress/Local by Flywheel
- Client: WordPress core functions
- No direct database access from Next.js

**File Storage:**
- WordPress Media Library - User uploads
- Served via: WordPress domain (CDN in production)
- Image paths: `wp-content/uploads/`

**Caching:**
- Next.js ISR - Page-level caching
- PWA Service Worker - Browser caching
- No Redis or external cache

## Authentication & Identity

**Auth Provider:**
- None for end users
- WordPress admin for content editors

**Preview/Revalidation Auth:**
- `PREVIEW_SECRET` - Draft preview authentication
- `REVALIDATION_SECRET` - ISR webhook validation
- Both passed via environment variables

**OAuth Integrations:**
- None configured

## Monitoring & Observability

**Error Tracking:**
- Not configured
- TODO in `frontend/lib/logger.ts` line 60
- Recommended: Sentry

**Analytics:**
- Not configured
- No Google Analytics, Mixpanel, etc.

**Logs:**
- Console.log/error in Next.js
- WordPress error_log() for PHP
- Vercel logs for production

## CI/CD & Deployment

**Hosting:**
- Next.js: Vercel (automatic on push)
- WordPress: Custom host (wpstarter.mysites.io)
- Development: Local by Flywheel

**CI Pipeline:**
- GitHub repository
- No CI workflows configured
- Vercel handles Next.js deployment

## Environment Configuration

**Development:**
- Required: `WORDPRESS_API_URL` (local WordPress)
- Optional: `PREVIEW_SECRET`, `REVALIDATION_SECRET`
- Location: `frontend/.env.local`

**Production:**
- Required:
  - `WORDPRESS_API_URL`
  - `PREVIEW_SECRET`
  - `REVALIDATION_SECRET`
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SITE_NAME`
- Template: `frontend/.env.production.example`

**WordPress Constants:**
- `STARTER_FRONTEND_URL` - Next.js frontend URL
- `STARTER_PREVIEW_SECRET` - Preview authentication
- `STARTER_REVALIDATION_SECRET` - ISR webhook auth
- Set in: wp-config.php or WordPress options

## Webhooks & Callbacks

**Incoming:**
- `/api/revalidate` - ISR cache invalidation from WordPress
  - Verification: Secret token in request body
  - Events: Post publish, update, trash
  - Source: `functions.php` lines 309-362

- `/api/preview` - Draft preview from WordPress
  - Verification: Secret in query params
  - Events: Preview link click in WordPress
  - Source: `functions.php` lines 283-304

**Outgoing:**
- WordPress → Next.js revalidation webhook
  - Trigger: `save_post`, `transition_post_status` hooks
  - Endpoint: `{FRONTEND_URL}/api/revalidate`
  - Payload: `{ secret, type, slug }`

## PWA Integration

**Service Worker:**
- Library: `@ducanh2912/next-pwa: ^10.2.9`
- Config: `frontend/next.config.ts` lines 6-88
- Registration: Automatic in production

**Caching Strategies:**
| Resource | Strategy | TTL |
|----------|----------|-----|
| Google Fonts | CacheFirst | 1 year |
| Static Assets | StaleWhileRevalidate | 24 hours |
| Images | StaleWhileRevalidate | 30 days |
| WordPress API | NetworkFirst | 1 hour (10s timeout) |
| WP Uploads | CacheFirst | 30 days |

**Offline Support:**
- Fallback page: `frontend/app/offline/page.tsx`
- Document fallback: `/offline`

## Video Integration

**Video.js:**
- Library: `video.js: ^8.23.4`
- YouTube plugin: `videojs-youtube: ^3.0.1`
- Component: `frontend/components/YouTubePlayer.tsx`

**WordPress Shortcode:**
- Format: `[youtube_player id="VIDEO_ID" ...]`
- Implementation: `functions.php` lines 371-389
- Attributes: autoplay, loop, muted, controls, captions

---

*Integration audit: 2026-01-12*
*Update when adding/removing external services*
