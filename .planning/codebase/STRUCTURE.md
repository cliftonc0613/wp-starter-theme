# Codebase Structure

**Analysis Date:** 2026-01-11

## Directory Layout

```
mytheme/
├── .claude/                # Claude Code automation
│   ├── agents/            # AI agent configurations
│   ├── commands/          # Custom slash commands
│   └── skills/            # Specialized skills
├── .planning/             # Project planning documents
│   └── codebase/          # Codebase analysis (this file)
├── acf-json/              # ACF field group exports
├── context/               # Business/brand documentation
│   └── core/              # Core profiles (JSON)
├── docs/                  # Project documentation
├── frontend/              # Next.js application
│   ├── app/              # App Router pages and routes
│   ├── components/       # React components
│   ├── lib/              # Utility libraries
│   ├── public/           # Static assets
│   └── types/            # TypeScript definitions
├── knowledge/             # Content drafts and research
├── functions.php          # WordPress theme setup
├── index.php              # Headless placeholder
├── style.css              # Theme metadata
└── CLAUDE.md              # Project instructions
```

## Directory Purposes

**frontend/app/**
- Purpose: Next.js App Router pages, API routes, global styles
- Contains: `page.tsx`, `layout.tsx`, `route.ts` files
- Key files:
  - `layout.tsx` - Root layout with Header/Footer
  - `page.tsx` - Homepage with StoryBrand sections
  - `globals.css` - Tailwind config and CSS variables
  - `sitemap.ts`, `robots.ts` - SEO files
- Subdirectories:
  - `api/` - API routes (contact, preview, revalidate)
  - `blog/` - Blog listing and `[slug]` detail
  - `services/` - Services listing and `[slug]` detail
  - `[slug]/` - Dynamic page routes

**frontend/components/**
- Purpose: Reusable React components
- Contains: `.tsx` component files (14 total)
- Key files:
  - `Header.tsx` - Navigation with Headroom.js
  - `Footer.tsx` - Site footer
  - `ContactForm.tsx` - Contact form with validation
  - `BlogCard.tsx`, `ServiceCard.tsx`, `TestimonialCard.tsx`
  - `YouTubePlayer.tsx` - Video.js YouTube integration
- Subdirectories:
  - `ui/` - shadcn/ui primitive components
  - `storybrand/` - StoryBrand framework sections

**frontend/lib/**
- Purpose: Utility libraries and services
- Contains: TypeScript modules
- Key files:
  - `wordpress.ts` - API client (575 lines)
  - `utils.ts` - Utility functions (cn helper)
  - `logger.ts` - Logging abstraction
- Subdirectories:
  - `schemas/` - Zod validation schemas (`contact.ts`)

**acf-json/**
- Purpose: ACF field group exports (version controlled)
- Contains: JSON field group definitions
- Key files:
  - `group_services_fields.json`
  - `group_testimonials_fields.json`

**context/core/**
- Purpose: Business and brand documentation for AI
- Contains: JSON profile files
- Key files:
  - `business-profile.json`
  - `voice-dna.json`
  - `icp.json` (Ideal Client Profile)

**docs/**
- Purpose: Project documentation
- Contains: Markdown documentation files
- Key files:
  - `PRD-headless-theme-enhancements.md` - Enhancement roadmap

## Key File Locations

**Entry Points:**
- `functions.php` - WordPress theme setup, REST API customization
- `frontend/app/layout.tsx` - Next.js root layout
- `frontend/app/page.tsx` - Homepage

**Configuration:**
- `frontend/next.config.ts` - Next.js config (images, env vars)
- `frontend/tsconfig.json` - TypeScript config
- `frontend/postcss.config.mjs` - Tailwind CSS 4
- `frontend/components.json` - shadcn/ui config
- `frontend/.env.local` - Development environment (gitignored)
- `frontend/.env.production.example` - Production template

**Core Logic:**
- `frontend/lib/wordpress.ts` - WordPress API client
- `frontend/lib/schemas/contact.ts` - Contact form validation
- `frontend/app/api/revalidate/route.ts` - ISR webhook
- `frontend/app/api/preview/route.ts` - Draft mode handler
- `frontend/app/api/contact/route.ts` - Contact form API

**Testing:**
- Not currently configured
- Planned: `frontend/__tests__/` or co-located `*.test.ts`

**Documentation:**
- `CLAUDE.md` - Project instructions for Claude Code
- `docs/` - Technical documentation

## Naming Conventions

**Files:**
- `PascalCase.tsx` - React components (`Header.tsx`, `BlogCard.tsx`)
- `kebab-case.ts` - Utility modules (`wordpress.ts`, `logger.ts`)
- `page.tsx` - Next.js page files (App Router convention)
- `route.ts` - Next.js API route files
- `*.json` - Configuration and data files

**Directories:**
- `kebab-case` - All directories (`storybrand/`, `acf-json/`)
- `[param]` - Dynamic route parameters (`[slug]/`)

**Special Patterns:**
- `globals.css` - Global styles in app directory
- `components.json` - shadcn/ui configuration
- `UPPERCASE.md` - Important project files (CLAUDE.md, README.md)

## Where to Add New Code

**New Feature:**
- Primary code: `frontend/app/[route]/page.tsx` for pages
- Components: `frontend/components/[Component].tsx`
- Utilities: `frontend/lib/[module].ts`
- Tests: Co-located as `*.test.ts` (when implemented)

**New Component:**
- UI primitives: `frontend/components/ui/`
- Feature components: `frontend/components/`
- StoryBrand sections: `frontend/components/storybrand/`
- Types: Inline interface in component file

**New API Route:**
- Definition: `frontend/app/api/[name]/route.ts`
- Validation: `frontend/lib/schemas/[name].ts`

**New WordPress Feature:**
- Custom post type: Add to `functions.php`
- ACF fields: Export to `acf-json/`
- REST API customization: `functions.php`

**Utilities:**
- Shared helpers: `frontend/lib/utils.ts`
- Type definitions: `frontend/types/`
- Validation schemas: `frontend/lib/schemas/`

## Special Directories

**.planning/**
- Purpose: Project planning documents (GSD workflow)
- Source: Generated by Claude Code commands
- Committed: Yes

**acf-json/**
- Purpose: ACF field group sync (version controlled)
- Source: Exported from WordPress ACF plugin
- Committed: Yes (enables field group versioning)

**frontend/node_modules/**
- Purpose: npm dependencies
- Source: Generated by `npm install`
- Committed: No (in .gitignore)

**frontend/.next/**
- Purpose: Next.js build output
- Source: Generated by `npm run build`
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-01-11*
*Update when directory structure changes*
