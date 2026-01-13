# Codebase Concerns

**Analysis Date:** 2026-01-12

## Tech Debt

**Contact Form Email Not Implemented:**
- Issue: Form submissions accepted but never sent anywhere
- Files: `frontend/app/api/contact/route.ts` (line 15 TODO)
- Why: Placeholder for email service integration
- Impact: Users believe messages are sent when they aren't
- Fix approach: Integrate Resend, SendGrid, or Nodemailer

**Error Tracking Not Integrated:**
- Issue: Errors logged to console only, not captured
- Files: `frontend/lib/logger.ts` (line 60 TODO)
- Why: External service not yet configured
- Impact: Production errors go unnoticed
- Fix approach: Integrate Sentry or similar service

**Hardcoded Domains in PWA Config:**
- Issue: Cache patterns use specific WordPress domains
- Files: `frontend/next.config.ts` (lines 65, 99-111)
- Why: Configuration not externalized
- Impact: Cache patterns won't match on different domains
- Fix approach: Use environment variables for domain patterns

**Duplicate Path Mapping:**
- Issue: Post type to URL path mapping in two places
- Files: `frontend/app/api/revalidate/route.ts` (lines 46-51), `frontend/app/api/preview/route.ts` (lines 47-54)
- Why: Ad-hoc implementation without abstraction
- Impact: Must update both files when adding post types
- Fix approach: Extract to shared config file

## Known Bugs

**No critical bugs identified during analysis.**

## Security Considerations

**Overly Permissive CORS:**
- Risk: Wildcard CORS (`Access-Control-Allow-Origin: *`) when WP_DEBUG is true
- Files: `functions.php` (lines 246-260)
- Current mitigation: Only enabled with WP_DEBUG flag
- Recommendations: Restrict to specific frontend domains even in development

**Weak Default Secrets:**
- Risk: Hardcoded defaults 'preview-secret' and 'revalidation-secret-change-me'
- Files: `functions.php` (lines 289-291, 325-327)
- Current mitigation: Documentation to change them
- Recommendations: Add validation that rejects default values in production

**XSS Risk in WordPress Content:**
- Risk: WordPress HTML rendered via dangerouslySetInnerHTML without sanitization
- Files: `frontend/components/WordPressContent.tsx` (lines 152, 201, 227)
- Current mitigation: WordPress REST API generally safe
- Recommendations: Add sanitize-html library for additional protection

## Performance Bottlenecks

**N+1 Query Pattern in REST Fields:**
- Problem: Three REST field callbacks per post type
- Files: `functions.php` (lines 198-240)
- Measurement: 3+ extra queries per post in list views
- Cause: Separate `get_fields()`, `wp_get_attachment_image_src()`, `get_the_author_meta()` calls
- Improvement path: Consolidate into single callback or use `_embed=true` parameter

**Image Optimization Disabled:**
- Problem: Development images not optimized
- Files: `frontend/next.config.ts` (line 95)
- Measurement: Larger image payloads in development
- Cause: `unoptimized: isDev` configuration
- Improvement path: Enable optimization or use production images in development

## Fragile Areas

**YouTube Embed Parsing:**
- Files: `frontend/components/WordPressContent.tsx` (lines 25-121)
- Why fragile: 5 different regex patterns parsing WordPress HTML
- Common failures: Silent failures when WordPress HTML structure changes
- Safe modification: Add unit tests before changing regex patterns
- Test coverage: None - high priority for testing

**WordPress Hook Chain:**
- Files: `functions.php` (multiple hook registrations)
- Why fragile: Order-dependent hook execution
- Common failures: Hook order changes break functionality
- Safe modification: Document hook dependencies, test individually

## Scaling Limits

**No scaling limits identified.** Current architecture is stateless and horizontally scalable via Vercel.

## Dependencies at Risk

**No deprecated or unmaintained dependencies detected.** Stack is modern and actively maintained:
- React 19 (latest)
- Next.js 16 (latest)
- Tailwind CSS 4 (latest)

## Missing Critical Features

**No Testing Framework:**
- Problem: No unit, integration, or E2E tests
- Current workaround: Manual testing
- Blocks: Confident refactoring, CI/CD quality gates
- Implementation complexity: Low - add Vitest and initial tests

**No Analytics:**
- Problem: No user behavior tracking
- Current workaround: Vercel analytics (if enabled)
- Blocks: Data-driven decisions
- Implementation complexity: Low - add Google Analytics or similar

## Test Coverage Gaps

**WordPress API Client:**
- What's not tested: All fetch functions in `frontend/lib/wordpress.ts`
- Risk: API changes break silently
- Priority: High
- Difficulty to test: Medium - requires fetch mocking

**Form Validation:**
- What's not tested: Zod schemas in `frontend/lib/schemas/`
- Risk: Validation bypass or unexpected rejections
- Priority: Medium
- Difficulty to test: Low - pure functions

**YouTube Embed Regex:**
- What's not tested: 5 regex patterns for different embed formats
- Risk: Content rendering breaks silently
- Priority: High
- Difficulty to test: Low - pure string matching

**API Routes:**
- What's not tested: `frontend/app/api/*/route.ts` handlers
- Risk: Security issues, incorrect responses
- Priority: Medium
- Difficulty to test: Medium - requires request mocking

---

*Concerns audit: 2026-01-12*
*Update as issues are fixed or new ones discovered*
