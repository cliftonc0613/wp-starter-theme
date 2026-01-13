# Coding Conventions

**Analysis Date:** 2026-01-12

## Naming Patterns

**Files:**
- `PascalCase.tsx` - React components (`Header.tsx`, `ContactForm.tsx`, `Hero.tsx`)
- `kebab-case` directories - Page routes (`app/blog/[slug]/page.tsx`)
- `camelCase.ts` - Utilities and services (`wordpress.ts`, `logger.ts`, `utils.ts`)
- `index.ts` - Barrel exports (`components/storybrand/index.ts`)

**Functions:**
- camelCase for all functions (`getPosts`, `getServices`, `fetchAPI`)
- No special prefix for async functions
- `handle*` for event handlers (`handleSubmit`)
- `use*` for React hooks (standard convention)

**Variables:**
- camelCase for variables and function parameters
- SCREAMING_SNAKE_CASE for PHP constants (`STARTER_THEME_VERSION`)
- No underscore prefix for private members

**Types:**
- PascalCase for interfaces and types (`WPPost`, `WPService`, `ContactFormValues`)
- `WP` prefix for WordPress-related interfaces
- `*Props` suffix for component props (`HeroProps`, `ContactFormProps`)

## Code Style

**Formatting (TypeScript/React):**
- 2 space indentation
- Double quotes for strings and JSX attributes
- Semicolons present
- ~100 character line length
- No Prettier configured (manual formatting)

**Formatting (PHP):**
- 4 space indentation (WordPress standard)
- Single quotes for array keys
- Semicolons required
- PSR-2 compatible style

**Linting:**
- ESLint with flat config (`frontend/eslint.config.mjs`)
- Extends `eslint-config-next/core-web-vitals`
- Extends `eslint-config-next/typescript`
- Run: `npm run lint`

## Import Organization

**Order:**
1. React and Next.js imports (`"react"`, `"next/link"`)
2. External packages (`"zod"`, `"lucide-react"`)
3. Internal modules (`"@/components/ui/button"`)
4. Relative imports (`"./utils"`)
5. Type imports (`import type { ... }`)

**Grouping:**
- Blank line between groups
- Related imports grouped together

**Path Aliases:**
- `@/*` maps to `frontend/*` (configured in `tsconfig.json`)
- Example: `import { Button } from "@/components/ui/button"`

## Error Handling

**Patterns:**
- Try/catch at API boundaries
- Graceful degradation with fallback UI
- Toast notifications for user errors via Sonner

**Error Types:**
- Throw on validation failures
- Return JSON error responses from API routes
- Log errors with context in development

**Logging:**
- `console.error()` for errors
- Custom `logger.ts` for structured logging
- WordPress `error_log()` for PHP errors

## Logging

**Framework:**
- `frontend/lib/logger.ts` - Custom logger utility
- Console-based (no external service)
- Levels: info, warn, error, debug

**Patterns:**
- Log at service boundaries
- Include context in error logs
- No console.log in production (ESLint rule)

## Comments

**When to Comment:**
- Explain why, not what
- Document business logic and edge cases
- Complex regex patterns (see `WordPressContent.tsx`)

**JSDoc/TSDoc:**
- Used for exported functions and components
- Include `@param`, `@returns` tags
- Example in `frontend/lib/wordpress.ts`

**TODO Comments:**
- Format: `// TODO: description`
- Link to issue if exists
- Present in `logger.ts`, `contact/route.ts`

**Section Markers:**
- HTML comments for visual separation in TSX
- Example: `{/* ============================================ SECTION 1: HERO */}`

## Function Design

**Size:**
- Keep under 50 lines
- Extract helpers for complex logic
- Large files exist but should be refactored

**Parameters:**
- Max 3 positional parameters
- Use options object for more
- Destructure in parameter list

**Return Values:**
- Explicit return statements
- Return early for guard clauses
- TypeScript return types on public functions

## Module Design

**Exports:**
- Named exports preferred
- Default exports for React components (optional)
- Barrel files for public API (`index.ts`)

**Barrel Files:**
- `frontend/components/storybrand/index.ts`
- `frontend/lib/schemas/index.ts`
- Re-export public API only

**Component Patterns:**
- "use client" directive for client components
- Server components by default (Next.js 13+)
- Props interface above component definition

## WordPress Conventions

**PHP Functions:**
- snake_case with theme prefix (`starter_theme_*`)
- Hook callbacks follow action/filter name
- DocBlocks with `@param`, `@return`

**Hooks:**
- `add_action()` and `add_filter()` patterns
- Priority 10 default, explicit when needed
- Callback function defined before hook registration

**REST API:**
- `register_rest_field()` for custom fields
- `rest_api_init` hook for registration
- JSON responses via WordPress functions

---

*Convention analysis: 2026-01-12*
*Update when patterns change*
