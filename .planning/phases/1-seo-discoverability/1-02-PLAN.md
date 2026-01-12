---
phase: 1-seo-discoverability
plan: 02
type: execute
---

<objective>
Create structured data (JSON-LD) components for rich snippets in Google search results.

Purpose: Enable rich snippets (breadcrumbs, articles, services, FAQ) that match Google's SEO Starter Guide reference.
Output: Schema generation library and reusable StructuredData component.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-phase.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/1-seo-discoverability/1-CONTEXT.md
@.planning/phases/1-seo-discoverability/1-01-SUMMARY.md
@frontend/lib/wordpress.ts

**Vision:** Rich snippets everywhere - breadcrumb trails, article dates, organization info, FAQ accordions like Google's own documentation pages.

**Schema types needed:** Organization, Article, Service, BreadcrumbList, FAQPage, Review (for testimonials)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create schema generation library</name>
  <files>frontend/lib/schema.ts</files>
  <action>
Create new file `frontend/lib/schema.ts` with schema generators:

1. TypeScript interfaces for input data:
   ```typescript
   interface OrganizationData {
     name: string;
     url: string;
     logo?: string;
     description?: string;
     sameAs?: string[]; // Social links
     contactPoint?: {
       telephone: string;
       email: string;
     };
   }

   interface BreadcrumbItem {
     name: string;
     url: string;
   }

   interface FAQ {
     question: string;
     answer: string;
   }
   ```

2. Schema generator functions (all return Schema.org compliant objects):

   - `generateOrganizationSchema(data: OrganizationData)` - Organization with optional LocalBusiness
   - `generateArticleSchema(post: WPPost, siteUrl: string)` - Article with author, datePublished, dateModified
   - `generateServiceSchema(service: WPService, siteUrl: string)` - Service with description, provider
   - `generateBreadcrumbSchema(items: BreadcrumbItem[])` - BreadcrumbList with position
   - `generateFAQSchema(faqs: FAQ[])` - FAQPage with Question/Answer pairs
   - `generateReviewSchema(testimonial: WPTestimonial)` - Review with rating, author

3. Each function should:
   - Return object with `@context: "https://schema.org"` and `@type`
   - Use proper Schema.org property names
   - Handle optional fields gracefully
   - Include JSDoc with example usage

**Reference:** https://schema.org and Google's Structured Data documentation
  </action>
  <verify>TypeScript compiles: `cd frontend && npx tsc --noEmit`</verify>
  <done>lib/schema.ts exists with all 6 generator functions exported, no type errors</done>
</task>

<task type="auto">
  <name>Task 2: Create StructuredData React component</name>
  <files>frontend/components/structured-data.tsx</files>
  <action>
Create new file `frontend/components/structured-data.tsx`:

1. Simple component that renders JSON-LD script tag:
   ```typescript
   interface StructuredDataProps {
     data: object | object[]; // Single schema or array of schemas
   }

   export function StructuredData({ data }: StructuredDataProps) {
     return (
       <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{
           __html: JSON.stringify(data),
         }}
       />
     );
   }
   ```

2. Alternative: Multiple schemas component for pages with several schema types:
   ```typescript
   interface MultiSchemaProps {
     schemas: object[];
   }

   export function MultiStructuredData({ schemas }: MultiSchemaProps) {
     return (
       <>
         {schemas.map((schema, index) => (
           <script
             key={index}
             type="application/ld+json"
             dangerouslySetInnerHTML={{
               __html: JSON.stringify(schema),
             }}
           />
         ))}
       </>
     );
   }
   ```

3. This is a Server Component (no "use client" directive needed).

**Note:** JSON-LD scripts should be in <head> but Next.js App Router handles this - components in page.tsx body still work for SEO.
  </action>
  <verify>TypeScript compiles: `cd frontend && npx tsc --noEmit`</verify>
  <done>components/structured-data.tsx exports StructuredData and MultiStructuredData components</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `cd frontend && npx tsc --noEmit` passes
- [ ] lib/schema.ts exports all 6 generator functions
- [ ] components/structured-data.tsx exports StructuredData component
- [ ] No linting errors: `cd frontend && npm run lint`
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- Schema generators produce valid Schema.org JSON-LD
- StructuredData component renders script tags correctly
</success_criteria>

<output>
After completion, create `.planning/phases/1-seo-discoverability/1-02-SUMMARY.md`
</output>
