# Technology Stack

**Analysis Date:** 2026-01-11

## Languages

**Primary:**
- TypeScript 5.x (strict mode) - All frontend application code - `frontend/tsconfig.json`
- PHP 7.4+ - WordPress theme - `functions.php`

**Secondary:**
- CSS 4 with PostCSS - Styling via Tailwind - `frontend/postcss.config.mjs`
- JavaScript - Config files and build scripts

## Runtime

**Environment:**
- Node.js 20.x (LTS) - `frontend/package.json` @types/node
- WordPress/PHP runtime - Server-side CMS

**Package Manager:**
- npm 10.x
- Lockfile: `frontend/package-lock.json` present (280KB)

## Frameworks

**Core:**
- Next.js 16.1.1 - Frontend framework with App Router - `frontend/package.json`
- React 19.2.3 - UI library - `frontend/package.json`
- WordPress 6.x - Headless CMS (REST API only)

**Testing:**
- Not currently configured
- PRD plans: Jest + React Testing Library, Playwright for E2E

**Build/Dev:**
- TypeScript 5.x - Type checking and compilation - `frontend/tsconfig.json`
- Tailwind CSS 4.x - Utility-first styling - `frontend/postcss.config.mjs`
- PostCSS - CSS processing with `@tailwindcss/postcss` plugin

## Key Dependencies

**Critical:**
- `react-hook-form` 7.70.0 - Form state management - `frontend/components/ContactForm.tsx`
- `zod` 4.3.5 - Schema validation - `frontend/lib/schemas/contact.ts`
- `next-themes` 0.4.6 - Dark mode theming

**UI:**
- `@radix-ui/react-*` 1.2+ - Headless UI components (accordion, dialog, navigation-menu, select, tabs)
- `lucide-react` 0.562.0 - Icon library
- `class-variance-authority` 0.7.1 - Component variant styling
- `clsx` 2.1.1 + `tailwind-merge` 3.4.0 - Class name utilities

**Animation:**
- `gsap` 3.14.2 - Animation library
- `embla-carousel-react` 8.6.0 - Carousel component
- `headroom.js` 0.12.0 - Header hide-on-scroll
- `tw-animate-css` 1.4.0 - Tailwind animations

**Media:**
- `video.js` 8.23.4 - Video player
- `videojs-youtube` 3.0.1 - YouTube support

**Utilities:**
- `sonner` 2.0.7 - Toast notifications

## Configuration

**Environment:**
- `.env.local` - Development environment variables (gitignored)
- `.env.production` - Production configuration
- Key vars: `WORDPRESS_API_URL`, `PREVIEW_SECRET`, `REVALIDATION_SECRET`, `NEXT_PUBLIC_SITE_URL`

**Build:**
- `frontend/next.config.ts` - Next.js configuration, image optimization
- `frontend/tsconfig.json` - TypeScript config (ES2017 target, strict mode, path aliases)
- `frontend/postcss.config.mjs` - Tailwind CSS 4 PostCSS setup
- `frontend/components.json` - shadcn/ui configuration

## Platform Requirements

**Development:**
- macOS/Linux/Windows with Node.js 20+
- Local by Flywheel for WordPress (IPv4 DNS workaround in `frontend/instrumentation.ts`)
- No external dependencies beyond WordPress

**Production:**
- Frontend: Vercel (configured in `.env.production.example`)
- WordPress: Flywheel/WP Engine compatible hosting
- Images: Served from WordPress domain, optimized by Next.js

---

*Stack analysis: 2026-01-11*
*Update after major dependency changes*
