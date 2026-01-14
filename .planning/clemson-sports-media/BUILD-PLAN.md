# Clemson Sports Media - Build Plan

## Overview

This build plan organizes the implementation into 5 phases, prioritized by dependency and business value. Each phase builds upon the previous, allowing for incremental delivery and testing.

---

## Phase 1: Foundation & Design System

**Focus:** Establish the visual identity and core infrastructure

### Tasks

#### 1.1 Design System Implementation
- [ ] Create Clemson color palette CSS variables
- [ ] Select and integrate sports-appropriate typography
- [ ] Design component variants (buttons, cards, badges)
- [ ] Create category badge color system

#### 1.2 WordPress Configuration
- [ ] Verify API endpoints work with clemsonsportsmedia.com
- [ ] Test category and tag endpoints
- [ ] Confirm image URL patterns
- [ ] Set up environment variables

#### 1.3 Core Component Updates
- [ ] Redesign `Header.tsx` for sports navigation
- [ ] Create category navigation menu
- [ ] Redesign `Footer.tsx` with newsletter placeholder
- [ ] Create `Breadcrumbs.tsx` component with schema

#### 1.4 Homepage Foundation
- [ ] Remove StoryBrand components (service-business focused)
- [ ] Create sports newspaper layout structure
- [ ] Build `FeaturedGrid.tsx` for hero area
- [ ] Build `CategorySection.tsx` for homepage blocks

### Deliverables
- Functional homepage skeleton with Clemson branding
- Updated header/footer
- Breadcrumb navigation system

### Dependencies
- WordPress API access
- Design assets (logo, if any)

---

## Phase 2: Content Architecture

**Focus:** Build the blog, category, and tag systems

### Tasks

#### 2.1 Data Layer Updates
- [ ] Add `getPostsByCategory()` with pagination
- [ ] Add `getPostsByTag()` with pagination
- [ ] Add `getRelatedPosts()` function
- [ ] Add `getAllCategories()` for navigation
- [ ] Add pagination metadata parsing

#### 2.2 Pagination Component
- [ ] Create `Pagination.tsx` component
- [ ] Support numbered pages + prev/next
- [ ] Handle edge cases (first/last page)
- [ ] Add keyboard navigation

#### 2.3 Category Archive Pages
- [ ] Create `/category/[slug]/page.tsx`
- [ ] Create `/category/[slug]/page/[num]/page.tsx`
- [ ] Generate static params for categories
- [ ] Implement pagination
- [ ] Add SEO metadata

#### 2.4 Tag Archive Pages
- [ ] Create `/tag/[slug]/page.tsx`
- [ ] Create `/tag/[slug]/page/[num]/page.tsx`
- [ ] Generate static params for tags
- [ ] Implement pagination
- [ ] Add SEO metadata

#### 2.5 Search Page
- [ ] Create `/search/page.tsx`
- [ ] Display search results with pagination
- [ ] Handle empty states
- [ ] Add search metadata

### Deliverables
- Paginated category archives
- Paginated tag archives
- Dedicated search results page
- All routes with proper SEO

### Dependencies
- Phase 1 completion
- WordPress category/tag data

---

## Phase 3: Article Experience

**Focus:** Enhance individual post pages

### Tasks

#### 3.1 Blog Post Enhancements
- [ ] Redesign post layout for newspaper style
- [ ] Add author information section
- [ ] Display category/tag badges
- [ ] Add publication date formatting
- [ ] Implement reading time

#### 3.2 Social Sharing
- [ ] Create `ShareButtons.tsx` component
- [ ] Implement Facebook share
- [ ] Implement Twitter/X share
- [ ] Implement LinkedIn share
- [ ] Implement Copy Link with feedback

#### 3.3 Related Posts
- [ ] Implement `getRelatedPosts()` logic
- [ ] Create `RelatedPosts.tsx` component
- [ ] Display 3-4 related articles
- [ ] Handle edge case (no related posts)

#### 3.4 Article Cards
- [ ] Redesign `BlogCard.tsx` for sports theme
- [ ] Create card variants (large, medium, small)
- [ ] Add category badge overlay
- [ ] Add author avatar + date

### Deliverables
- Enhanced article pages
- Social sharing functionality
- Related posts section
- Multiple card variants

### Dependencies
- Phase 2 completion
- Category/tag data available

---

## Phase 4: Newsletter Integration

**Focus:** Mailchimp integration and subscription forms

### Tasks

#### 4.1 Mailchimp API Setup
- [ ] Create Mailchimp account/API key
- [ ] Set up audience list
- [ ] Document API configuration

#### 4.2 Newsletter API Route
- [ ] Create `/api/newsletter/subscribe/route.ts`
- [ ] Implement Mailchimp API integration
- [ ] Add email validation
- [ ] Handle API errors gracefully
- [ ] Add rate limiting

#### 4.3 Newsletter Components
- [ ] Create `NewsletterForm.tsx` component
- [ ] Add form validation
- [ ] Add success/error states
- [ ] Add loading state

#### 4.4 Newsletter Placements
- [ ] Add to Footer (site-wide)
- [ ] Add to post pages (bottom)
- [ ] Add to homepage section
- [ ] Optional: Exit intent popup

### Deliverables
- Working Mailchimp integration
- Newsletter forms across site
- Email validation + feedback

### Dependencies
- Mailchimp account setup
- API credentials

---

## Phase 5: Polish & Optimization

**Focus:** Performance, testing, and launch preparation

### Tasks

#### 5.1 Performance Optimization
- [ ] Audit Lighthouse scores
- [ ] Optimize image loading
- [ ] Implement font preloading
- [ ] Review and optimize ISR timing
- [ ] Test Core Web Vitals

#### 5.2 SEO Finalization
- [ ] Audit all meta tags
- [ ] Verify Open Graph images
- [ ] Test Twitter Cards
- [ ] Validate JSON-LD schema
- [ ] Test sitemap generation
- [ ] Configure robots.txt

#### 5.3 PWA Updates
- [ ] Update manifest.json for Clemson branding
- [ ] Generate new app icons
- [ ] Update offline page design
- [ ] Test install experience

#### 5.4 Testing
- [ ] Write E2E tests for new routes
- [ ] Test category pagination
- [ ] Test tag pagination
- [ ] Test newsletter submission
- [ ] Test social sharing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness audit

#### 5.5 Documentation
- [ ] Update README for sports site
- [ ] Document environment variables
- [ ] Create deployment checklist
- [ ] Document WordPress requirements

### Deliverables
- Performance-optimized site
- Complete SEO implementation
- Updated PWA experience
- Test coverage
- Documentation

### Dependencies
- All previous phases
- Content in WordPress

---

## Implementation Schedule Matrix

| Phase | Priority | Complexity | Dependencies |
|-------|----------|------------|--------------|
| 1. Foundation | Critical | Medium | WordPress API |
| 2. Content Architecture | Critical | High | Phase 1 |
| 3. Article Experience | High | Medium | Phase 2 |
| 4. Newsletter | Medium | Medium | Mailchimp setup |
| 5. Polish | High | Low | All phases |

---

## File Creation Checklist

### New Files to Create

```
frontend/
├── app/
│   ├── category/
│   │   ├── [slug]/
│   │   │   ├── page.tsx
│   │   │   └── page/
│   │   │       └── [num]/
│   │   │           └── page.tsx
│   ├── tag/
│   │   ├── [slug]/
│   │   │   ├── page.tsx
│   │   │   └── page/
│   │   │       └── [num]/
│   │   │           └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   └── api/
│       └── newsletter/
│           └── subscribe/
│               └── route.ts
├── components/
│   ├── Breadcrumbs.tsx
│   ├── ShareButtons.tsx
│   ├── RelatedPosts.tsx
│   ├── Pagination.tsx
│   ├── NewsletterForm.tsx
│   ├── FeaturedGrid.tsx
│   ├── CategorySection.tsx
│   ├── CategoryBadge.tsx
│   └── AuthorInfo.tsx
└── lib/
    └── mailchimp.ts
```

### Files to Modify

```
frontend/
├── app/
│   ├── page.tsx                    # Homepage redesign
│   ├── blog/[slug]/page.tsx        # Add sharing, related
│   ├── globals.css                 # Clemson design system
│   └── layout.tsx                  # Update metadata
├── components/
│   ├── Header.tsx                  # Sports navigation
│   ├── Footer.tsx                  # Add newsletter
│   └── BlogCard.tsx                # Sports card design
├── lib/
│   └── wordpress.ts                # Add pagination functions
└── public/
    └── manifest.json               # Clemson branding
```

---

## Environment Variables Required

```env
# Existing (verify)
WORDPRESS_API_URL=https://clemsonsportsmedia.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Clemson Sports Media

# New (add)
MAILCHIMP_API_KEY=your-api-key
MAILCHIMP_AUDIENCE_ID=your-audience-id
MAILCHIMP_DC=us1  # Data center from API key suffix
```

---

## Risk Mitigation Strategies

### WordPress API Risks
- **Risk:** API rate limiting or downtime
- **Mitigation:** Implement aggressive ISR caching, add fallback states

### Design Risks
- **Risk:** Generic "AI slop" aesthetics
- **Mitigation:** Follow CLAUDE.md guidelines, use distinctive typography, bold color choices

### Performance Risks
- **Risk:** Not meeting sub-2s load targets
- **Mitigation:** Leverage existing Serwist caching, optimize images early

### Integration Risks
- **Risk:** Mailchimp API changes/issues
- **Mitigation:** Abstract behind service layer, add comprehensive error handling

---

## Testing Strategy

### Unit Tests (Vitest)
- `wordpress.ts` pagination functions
- `mailchimp.ts` API functions
- Form validation logic
- Schema generation

### E2E Tests (Playwright)
- Category navigation flow
- Tag archive browsing
- Pagination controls
- Newsletter subscription
- Social sharing buttons
- Search functionality

### Manual Testing Checklist
- [ ] Mobile responsiveness (320px-768px)
- [ ] Tablet experience (768px-1024px)
- [ ] Desktop experience (1024px+)
- [ ] PWA install flow
- [ ] Offline functionality
- [ ] Cross-browser (Chrome, Firefox, Safari)

---

## Launch Checklist

### Pre-Launch
- [ ] All API integrations verified
- [ ] SEO meta tags on all pages
- [ ] Newsletter subscription working
- [ ] Mobile responsive verified
- [ ] Performance targets met
- [ ] Cross-browser tested
- [ ] Analytics configured
- [ ] Search console setup
- [ ] Sitemap submitted
- [ ] Robots.txt verified

### Post-Launch Monitoring
- [ ] Performance monitoring active
- [ ] Error tracking (Sentry) configured
- [ ] Newsletter analytics setup
- [ ] Search rankings baseline captured
- [ ] Core Web Vitals monitoring

---

## Quick Start Commands

```bash
# Development
cd frontend
npm run dev

# Build (with PWA)
npm run build

# Test
npm run test
npm run test:e2e

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Notes

- This plan builds incrementally - each phase produces a deployable state
- Newsletter (Phase 4) can run in parallel with Phase 3 if Mailchimp is ready
- PWA features are bonus value not in original PRD
- Existing test infrastructure should be extended, not replaced
