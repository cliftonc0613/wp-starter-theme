# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
