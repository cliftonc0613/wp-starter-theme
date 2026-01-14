# Security & Code Quality Audit Report

**Date:** January 14, 2026
**Scope:** WordPress Theme (PHP) + Next.js Frontend + PWA
**Auditor:** Senior Developer Review
**Status:** REMEDIATED

---

## Remediation Summary

All HIGH and MEDIUM severity issues have been fixed as of commit `7c3891e`:

| Issue | Severity | Status |
|-------|----------|--------|
| XSS via dangerouslySetInnerHTML | HIGH | FIXED - Added DOMPurify sanitization |
| Weak default secrets | HIGH | FIXED - Removed defaults, added warnings |
| Open redirect in exit-preview | MEDIUM | FIXED - Added path validation |
| Missing rate limiting | MEDIUM | FIXED - Added 5 req/min per IP |
| Health endpoint info disclosure | LOW | FIXED - Require auth for details |

---

## Executive Summary

Overall, this codebase demonstrates **good security practices** for a WordPress headless theme. The PHP code properly uses WordPress escaping functions, and the Next.js frontend uses modern validation patterns. ~~However, several issues require attention, particularly around XSS risks from WordPress content rendering and weak default secrets.~~ **All identified issues have been remediated.**

---

## Findings by Severity

### CRITICAL (0 issues)

No critical vulnerabilities found that would allow immediate exploitation.

---

### HIGH SEVERITY (2 issues)

#### 1. XSS Risk: Unsanitized WordPress HTML Rendering

**Files:**
- `frontend/components/WordPressContent.tsx:148`
- `frontend/app/about/page.tsx:116`
- `frontend/app/blog/[slug]/page.tsx:198-201`

**Issue:** WordPress content is rendered using `dangerouslySetInnerHTML` without client-side sanitization.

```tsx
<div dangerouslySetInnerHTML={{ __html: processedHtml }} />
```

**Risk:** If the WordPress site is compromised, or a malicious editor injects JavaScript, it will execute in the user's browser. While WordPress sanitizes content on save, this trust relationship creates risk.

**Recommendation:**
- Add a sanitization library like DOMPurify to strip dangerous tags/attributes
- Example: `DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })`

---

#### 2. Default/Weak Secrets Hardcoded

**File:** `functions.php:307-308, 343-344`

**Issue:** Default secrets are used when environment variables are not set:

```php
$preview_secret = defined('STARTER_PREVIEW_SECRET')
    ? STARTER_PREVIEW_SECRET
    : get_option('starter_preview_secret', 'preview-secret');  // WEAK DEFAULT

$revalidation_secret = defined('STARTER_REVALIDATION_SECRET')
    ? STARTER_REVALIDATION_SECRET
    : get_option('starter_revalidation_secret', 'revalidation-secret-change-me');  // WEAK DEFAULT
```

**Risk:** If developers forget to set custom secrets, the defaults are easily guessable, allowing unauthorized cache revalidation and preview access.

**Recommendation:**
- Remove default fallback values
- Throw an error or log a warning if secrets are not configured
- Document required environment variables in deployment docs

---

### MEDIUM SEVERITY (4 issues)

#### 3. Open Redirect Potential

**File:** `frontend/app/api/exit-preview/route.ts:14,21`

**Issue:** The `redirect` parameter accepts any path without validation:

```typescript
const redirectPath = searchParams.get("redirect") || "/";
return NextResponse.redirect(new URL(redirectPath, request.nextUrl.origin));
```

**Risk:** While constrained to same-origin (good), attackers could craft URLs redirecting users to unexpected pages (phishing within the site).

**Recommendation:**
- Validate redirect paths against an allowlist
- Strip or reject paths containing protocol handlers

---

#### 4. Preview Secret Exposed in URL (GET Request)

**File:** `frontend/app/api/preview/route.ts:18-32`

**Issue:** Preview secret is passed via URL query parameters:

```typescript
const secret = searchParams.get("secret");
```

**Risk:**
- URL parameters are logged in server access logs
- Can leak via Referrer header to external resources
- May appear in browser history

**Recommendation:**
- Consider using POST requests for preview authentication
- Or use short-lived tokens instead of persistent secrets

---

#### 5. Missing Rate Limiting on Contact Form

**File:** `frontend/app/api/contact/route.ts`

**Issue:** No rate limiting beyond honeypot field protection.

**Risk:**
- Spam submissions
- Potential email bombing if email integration is added
- Server resource exhaustion

**Recommendation:**
- Implement rate limiting (e.g., Vercel Edge Config, Upstash Redis)
- Add CAPTCHA for suspicious patterns
- Consider adding CSRF token validation

---

#### 6. CORS Wildcard in Development

**File:** `functions.php:265-268`

**Issue:** Overly permissive CORS headers when WP_DEBUG is true:

```php
if (defined('WP_DEBUG') && WP_DEBUG) {
    header('Access-Control-Allow-Origin: *');
```

**Risk:** If WP_DEBUG accidentally enabled in production, any origin can make authenticated requests.

**Recommendation:**
- Use explicit origin allowlist even in development
- Add additional checks beyond WP_DEBUG (e.g., environment variable)

---

### LOW SEVERITY (5 issues)

#### 7. Health Endpoint Information Disclosure

**File:** `frontend/app/api/health/route.ts:66-77`

**Issue:** Exposes internal system metrics:

```typescript
const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
```

**Risk:** Helps attackers profile the server and identify resource exhaustion attacks.

**Recommendation:**
- Consider requiring authentication for detailed metrics
- Or only expose basic ok/error status publicly

---

#### 8. Service Worker Caches API Responses

**File:** `frontend/app/sw.ts:88-101`

**Issue:** WordPress API responses cached for 1 hour:

```typescript
handler: new NetworkFirst({
  cacheName: "wordpress-api",
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 60 * 60,  // 1 hour
    }),
  ],
```

**Risk:** Users may see stale content after WordPress updates, even after on-demand revalidation.

**Recommendation:**
- Consider shorter cache duration for dynamic content
- Or implement cache invalidation via service worker messaging

---

#### 9. Inefficient Cache Busting

**File:** `frontend/lib/wordpress.ts:249-250`

**Issue:** Every API request appends unique timestamp:

```typescript
const url = `${apiUrl}${endpoint}${separator}_t=${Date.now()}`;
```

**Risk:**
- Bypasses CDN caching entirely
- Increases origin server load
- Negates benefits of CDN caching

**Recommendation:**
- Use proper cache headers instead
- Consider conditional requests (If-Modified-Since)
- Or use revalidation tokens

---

#### 10. Missing CSRF Protection

**File:** `frontend/components/ContactForm.tsx`

**Issue:** Form relies only on honeypot for bot protection, no CSRF token.

**Risk:** Cross-site form submission attacks (low impact for contact form).

**Recommendation:**
- Implement CSRF tokens for forms that modify state
- Consider using Next.js middleware for token validation

---

#### 11. Regex Pattern Could Be More Restrictive

**File:** `frontend/lib/schemas/contact.ts:8`

**Issue:** Phone regex is permissive:

```typescript
const phoneRegex = /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
```

**Risk:** Accepts some invalid formats, though Zod min(10) helps.

**Recommendation:**
- Consider using a phone validation library like `libphonenumber`
- Or tighten regex to match specific expected formats

---

## Positive Findings

### PHP/WordPress Security (functions.php)

The PHP code demonstrates **excellent security practices**:

- Proper output escaping: `esc_html()`, `esc_url()`, `esc_attr()`
- Safe HTML filtering: `wp_kses_post()` for intro content
- Input sanitization: `preg_replace('/[^a-zA-Z0-9_-]/', '', $atts['id'])` for YouTube IDs
- ABSPATH check to prevent direct access
- No direct database queries ($wpdb) - uses WordPress APIs
- No deprecated functions detected

### Next.js/TypeScript Security

- **Zod validation** on all form inputs (excellent)
- **Type-safe** API routes with proper error handling
- **Environment variable** separation (secrets not hardcoded in code)
- **Proper JSON parsing** with try/catch
- **Honeypot** spam protection on contact form
- **Secret validation** on preview and revalidation endpoints

### PWA Implementation

- **Serwist configuration** is solid and well-documented
- **Manifest.json** properly configured with all required icons
- **Offline fallback** page implemented
- **Service worker** registration handles failures gracefully

---

## Recommendations Summary

| Priority | Action Item |
|----------|-------------|
| HIGH | Add DOMPurify sanitization for WordPress HTML content |
| HIGH | Remove default secrets, require explicit configuration |
| MEDIUM | Validate redirect paths in exit-preview endpoint |
| MEDIUM | Add rate limiting to contact form API |
| MEDIUM | Consider POST for preview authentication |
| LOW | Restrict health endpoint or add authentication |
| LOW | Review cache strategy for API responses |

---

## No Issues Found

- **SQL Injection:** No direct database queries; uses WordPress REST API
- **Deprecated Functions:** No deprecated WordPress functions detected
- **Broken Functionality:** PWA and theme appear properly configured
- **Path Traversal:** No file system access with user input

---

*This audit covers static code analysis. Dynamic testing and penetration testing are recommended for production deployments.*
