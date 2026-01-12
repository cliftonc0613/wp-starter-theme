# Coding Conventions

**Analysis Date:** 2026-01-11

## Naming Patterns

**Files:**
- PascalCase for React components: `Header.tsx`, `BlogCard.tsx`, `ContactForm.tsx`
- kebab-case for utility modules: `wordpress.ts`, `logger.ts`, `utils.ts`
- Lowercase for shadcn/ui primitives: `button.tsx`, `card.tsx`, `dialog.tsx`
- `page.tsx`, `route.ts` for Next.js conventions

**Functions:**
- camelCase for all functions: `getPosts()`, `getService()`, `formatDate()`
- No special prefix for async functions
- `handle*` for event handlers: `handleSubmit`, `handleClick`

**Variables:**
- camelCase for variables: `headerRef`, `currentYear`, `validatedData`
- Boolean prefix conventions: `isOpen`, `isSubmitting`, `isDev`
- UPPER_SNAKE_CASE for constants: `STARTER_THEME_VERSION` (PHP)
- camelCase for config objects: `budgetOptions`, `timelineOptions`, `navItems`

**Types:**
- PascalCase for interfaces: `HeroProps`, `ContactFormProps`, `WPPost`
- `WP` prefix for WordPress content types: `WPPost`, `WPService`, `WPTestimonial`
- `ACF` prefix for ACF field types: `ServiceACF`, `TestimonialACF`
- Type inference via Zod: `export type ContactFormValues = z.infer<typeof contactFormSchema>`

## Code Style

**Formatting:**
- 2-space indentation
- Double quotes for strings in JSX and TypeScript
- Semicolons required
- No trailing commas in function parameters

**Linting:**
- ESLint with modern flat config: `frontend/eslint.config.mjs`
- Extends: `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`
- Global ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`
- Run: `npm run lint`

**CRITICAL:** Never use inline styles. Always use Tailwind classes or global CSS.
- Per CLAUDE.md: "Never, ever use inline styles; always use the global style sheet."

## Import Organization

**Order:**
1. External packages: `import { z } from "zod"`
2. Next.js imports: `import type { Metadata } from "next"`
3. Internal modules via path alias: `import { cn } from "@/lib/utils"`
4. Relative imports: `import { Button } from "./button"`

**Grouping:**
- Blank line between groups
- Type imports mixed with regular imports

**Path Aliases:**
- `@/*` maps to `frontend/` root - `frontend/tsconfig.json`
- Example: `@/components/Header`, `@/lib/wordpress`, `@/lib/utils`

## Error Handling

**Patterns:**
- API routes: try/catch with NextResponse error returns
- Page components: `notFound()` for missing content
- Form validation: Zod schemas with error messages

**Error Types:**
- Throw on validation failure, API errors
- Return structured error responses from API routes
- Log errors with context via `frontend/lib/logger.ts`

**API Route Pattern:**
```typescript
try {
  const validatedData = schema.safeParse(body);
  if (!validatedData.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  // ... logic
  return NextResponse.json({ success: true });
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json({ error: "Internal error" }, { status: 500 });
}
```

## Logging

**Framework:**
- Custom logger abstraction: `frontend/lib/logger.ts`
- Levels: debug, info, warn, error

**Patterns:**
- Development: Verbose (debug, info, warn, error)
- Production: Minimal (warn, error only)
- Structured format: `[timestamp] [LEVEL] message {context}`

**Usage:**
```typescript
logger.debug("Fetching posts", { count: 10 });
logger.error("API failed", error, { endpoint: "/posts" });
```

## Comments

**When to Comment:**
- Explain why, not what
- Document business logic and edge cases
- Section dividers in large files

**Section Comments (used in page.tsx):**
```typescript
/* ============================================
   SECTION 1: HERO
   Pass the "grunt test"
   ============================================ */
```

**JSDoc/TSDoc:**
- Required for exported functions in lib/
- Optional for component props (interface is self-documenting)
- Use `@param`, `@returns` tags

**TODO Comments:**
- Format: `// TODO: description`
- Example: `// TODO: Integrate with error tracking service`

## Function Design

**Size:**
- Keep functions focused and readable
- Extract helpers for complex logic

**Parameters:**
- Use object destructuring for multiple props
- Default values in destructuring: `{ size = "default" }: HeroProps`

**Return Values:**
- Explicit return statements
- Return early for guard clauses
- Use `notFound()` for missing content in pages

## Module Design

**Exports:**
- Named exports preferred: `export function Hero()`
- Default exports only for page components (Next.js convention)

**Component Pattern:**
```typescript
interface ComponentProps {
  title: string;
  subtitle?: string;
  size?: "default" | "large" | "small";
}

export function Component({ title, subtitle, size = "default" }: ComponentProps) {
  return (/* JSX */);
}
```

**Server vs Client Components:**
- Server components by default (no directive)
- Client components explicitly marked: `"use client";` at file top
- Client components: Forms, interactive UI, browser APIs

## Styling Approach

**Tailwind CSS:**
- Utility classes only, no inline styles
- `cn()` helper for conditional classes: `cn("base-class", isActive && "active-class")`
- CSS variables in `globals.css` for theme values

**Component Variants:**
- Use `class-variance-authority` (CVA) for variants
- Example in shadcn/ui components

**Responsive:**
- Mobile-first with Tailwind breakpoints: `sm:`, `md:`, `lg:`

---

*Convention analysis: 2026-01-11*
*Update when patterns change*
