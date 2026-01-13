# Technology Stack

**Analysis Date:** 2026-01-12

## Languages

**Primary:**
- TypeScript 5 - Next.js frontend application code (`frontend/package.json`, `frontend/tsconfig.json`)
- PHP 7.4+ - WordPress theme backend (`functions.php`, `index.php`)

**Secondary:**
- JavaScript - Build scripts, config files (`frontend/eslint.config.mjs`, `frontend/postcss.config.mjs`)
- CSS - Design system and styling (`frontend/app/globals.css`)

## Runtime

**Environment:**
- Node.js 20+ (inferred from `@types/node: ^20` in `frontend/package.json`)
- WordPress 6.x (PHP runtime via Local by Flywheel)

**Package Manager:**
- npm (primary)
- Lockfile: `frontend/package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.1 - React framework with App Router (`frontend/package.json`)
- React 19.2.3 - UI library (`frontend/package.json`)
- WordPress - Headless CMS backend (`style.css` theme header)

**Testing:**
- Not configured - No test framework detected
- ESLint 9 for code quality (`frontend/eslint.config.mjs`)

**Build/Dev:**
- TypeScript 5 - Type checking and compilation (`frontend/package.json`)
- Tailwind CSS 4 - Utility-first CSS (`frontend/package.json`)
- PostCSS 4 - CSS processing (`@tailwindcss/postcss: ^4`)
- @ducanh2912/next-pwa 10.2.9 - PWA support (`frontend/next.config.ts`)

## Key Dependencies

**Critical:**
- `@radix-ui/*` - Accessible UI primitives (accordion, dialog, navigation-menu, select, tabs)
- `react-hook-form: ^7.70.0` - Form state management
- `zod: ^4.3.5` - Schema validation
- `gsap: ^3.14.2` - Animation library (ScrollTrigger)
- `headroom.js: ^0.12.0` - Smart header behavior

**Infrastructure:**
- `video.js: ^8.23.4` - Video player
- `videojs-youtube: ^3.0.1` - YouTube plugin
- `lucide-react: ^0.562.0` - Icons
- `sonner: ^2.0.7` - Toast notifications
- `next-themes: ^0.4.6` - Theme switching
- `embla-carousel-react: ^8.6.0` - Carousel component

**Utilities:**
- `clsx: ^2.1.1` - Class name construction
- `class-variance-authority: ^0.7.1` - Variant handling
- `tailwind-merge: ^3.4.0` - Tailwind class merging

## Configuration

**Environment:**
- `.env.local` for development (`frontend/.env.local`)
- `.env.production.example` for production template (`frontend/.env.production.example`)
- Required vars: `WORDPRESS_API_URL`, `PREVIEW_SECRET`, `REVALIDATION_SECRET`
- Public vars: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`

**Build:**
- `next.config.ts` - Next.js configuration with PWA, image optimization
- `tsconfig.json` - TypeScript strict mode, `@/*` path alias
- `eslint.config.mjs` - ESLint flat config with Next.js presets
- `postcss.config.mjs` - Tailwind CSS processor
- `components.json` - shadcn/ui configuration (New York style)

## Platform Requirements

**Development:**
- macOS/Linux/Windows with Node.js 20+
- Local by Flywheel for WordPress (or any local WordPress)
- No Docker required

**Production:**
- Vercel for Next.js frontend deployment
- Any WordPress host for backend (wpstarter.mysites.io)
- Separate deployments for WordPress and Next.js

---

*Stack analysis: 2026-01-12*
*Update after major dependency changes*
