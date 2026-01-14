# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.1] - 2026-01-14

### Security
- Added DOMPurify sanitization for WordPress HTML content to prevent XSS attacks
- Removed weak default secrets for preview and revalidation endpoints
- Added path validation to exit-preview route to prevent open redirect attacks
- Implemented rate limiting (5 requests/minute per IP) on contact form API
- Restricted health endpoint to only expose detailed metrics with authentication

### Added
- New `lib/sanitize.ts` utility for HTML sanitization with configurable allowlists
- New `lib/rate-limit.ts` utility with token bucket rate limiter
- Comprehensive security audit report (`SECURITY-AUDIT.md`)

### Changed
- WordPressContent component now sanitizes HTML before rendering
- About page uses WordPressContent for safe HTML rendering
- Health endpoint returns basic status publicly, detailed info requires `X-Health-Detail` header
- Contact form API returns rate limit headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset`)

## [1.6.0] - 2026-01-14

### Added
- PWA loading screen component displaying mobile screenshot as splash screen
- Standalone mode detection for Progressive Web App functionality
- Enhanced PWA experience with branded loading screen

## [1.5.0] - 2026-01-13

### Added
- ACF-powered customizable homepage template with dynamic content management
- Coming soon page design with visible API endpoint status table
- Frontend link opening in new window for better UX

### Changed
- Homepage redesigned as coming soon page with API endpoint visibility
- Homepage layout refined to fit single viewport for better first impression
- Homepage styling matches Next.js frontend design system for consistency
- API endpoint rows centered for improved visual balance

### Fixed
- Frontend link now opens in new window instead of same tab

## [1.2.0] - 2026-01-11

### Added
- YouTube video player integration with videojs-youtube library
- YouTube video caption/subtitle support for accessibility
- WordPress content integration for YouTube video embedding
- WordPress block editor classes for headless content rendering
- Enhanced header and page templates with dynamic body classes
- URL configuration reference documentation

### Changed
- Simplified video.js YouTube player styling to use framework defaults
- Improved YouTube embed detection patterns for WordPress content
- Reduced ISR revalidation interval from 60s to 5s for better performance
- Updated fluid typography for h1-h6 headings using CSS calc()

### Fixed
- YouTube embed detection patterns for WordPress-generated content
- Frontend force-dynamic rendering on blog post pages for real-time WordPress sync
- Cache-busting implementation for WordPress API requests
- Blog page data revalidation with no-store cache policy
- Added margin below images in prose/blog content for better spacing

### Chores
- Removed .DS_Store files from version control
- Added comprehensive root .gitignore for theme
- Removed debug logging from blog page components

## [1.0.0] - 2026-01-09

### Added
- Complete PRD code quality improvements implementation (Phases 0-5)
- Performance and developer experience enhancements
- Security improvements for WordPress theme

### Changed
- Refactored codebase following PRD guidelines
- Improved code organization and structure

### Fixed
- Disabled image optimization in development environment
- Rewritten OpenGraph image URLs for proper blog post sharing
- Image URL handling for production domain

### Security
- Implemented Phase 3 security improvements from PRD
- Enhanced WordPress theme security practices

### Documentation
- Marked PRD code improvements as completed
- Updated project documentation with implementation status

---

## Release Notes

This is the first stable release of the WordPress theme, featuring comprehensive code quality improvements based on the Project Requirements Document (PRD). The release includes:

**Code Quality Improvements (P0-P5):**
- P0 & P1: Foundation refactoring and code organization
- P2: Structure improvements and modularity
- P3: Security enhancements
- P4 & P5: Performance optimizations and developer experience improvements

**Bug Fixes:**
- Fixed image optimization issues in development
- Corrected OpenGraph image URL generation for social sharing
- Resolved production domain image URL rewrites

**Developer Experience:**
- Improved development workflow
- Enhanced code maintainability
- Better documentation coverage

This release represents a production-ready WordPress theme with solid foundations for future development.
