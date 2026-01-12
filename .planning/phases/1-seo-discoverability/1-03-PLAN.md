---
phase: 1-seo-discoverability
plan: 03
type: execute
---

<objective>
Integrate structured data into all page templates and enhance sitemap with priorities.

Purpose: Complete SEO implementation with JSON-LD on every page type and optimized sitemap for search engines.
Output: Rich snippets ready for Google Rich Results Test validation.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-phase.md
@~/.claude/get-shit-done/templates/summary.md
@~/.claude/get-shit-done/references/checkpoints.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/1-seo-discoverability/1-CONTEXT.md
@.planning/phases/1-seo-discoverability/1-01-SUMMARY.md
@.planning/phases/1-seo-discoverability/1-02-SUMMARY.md
@frontend/lib/schema.ts
@frontend/components/structured-data.tsx
@frontend/app/layout.tsx
@frontend/app/blog/[slug]/page.tsx
@frontend/app/services/[slug]/page.tsx
@frontend/app/sitemap.ts

**Vision:** Every content type with appropriate schema - Organization site-wide, Article for blog, Service for services, Breadcrumbs everywhere.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Organization schema to root layout</name>
  <files>frontend/app/layout.tsx</files>
  <action>
Add site-wide Organization schema to the root layout:

1. Import schema utilities:
   ```typescript
   import { StructuredData } from "@/components/structured-data";
   import { generateOrganizationSchema } from "@/lib/schema";
   ```

2. Create organization data (can be from env vars or hardcoded for now):
   ```typescript
   const organizationSchema = generateOrganizationSchema({
     name: process.env.NEXT_PUBLIC_SITE_NAME || "My Business",
     url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
     logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
     description: "Your business description",
     // Add social links if available
   });
   ```

3. Add StructuredData component in the body (after opening body tag):
   ```typescript
   <body>
     <StructuredData data={organizationSchema} />
     {/* rest of layout */}
   </body>
   ```

**Note:** Organization schema appears on every page - this is correct for site-wide business info.
  </action>
  <verify>`cd frontend && npx tsc --noEmit` passes</verify>
  <done>layout.tsx includes Organization schema via StructuredData component</done>
</task>

<task type="auto">
  <name>Task 2: Add Article and Breadcrumb schemas to blog posts</name>
  <files>frontend/app/blog/[slug]/page.tsx</files>
  <action>
Add structured data to blog post pages:

1. Import schema utilities:
   ```typescript
   import { MultiStructuredData } from "@/components/structured-data";
   import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/schema";
   ```

2. In the page component, generate schemas:
   ```typescript
   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

   const articleSchema = generateArticleSchema(post, siteUrl);

   const breadcrumbSchema = generateBreadcrumbSchema([
     { name: "Home", url: siteUrl },
     { name: "Blog", url: `${siteUrl}/blog` },
     { name: post.title.rendered, url: `${siteUrl}/blog/${post.slug}` },
   ]);
   ```

3. Add to page return:
   ```typescript
   return (
     <>
       <MultiStructuredData schemas={[articleSchema, breadcrumbSchema]} />
       {/* existing page content */}
     </>
   );
   ```
  </action>
  <verify>`cd frontend && npx tsc --noEmit` passes</verify>
  <done>Blog post pages include Article and Breadcrumb schemas</done>
</task>

<task type="auto">
  <name>Task 3: Add Service and Breadcrumb schemas to service pages</name>
  <files>frontend/app/services/[slug]/page.tsx</files>
  <action>
Add structured data to service pages:

1. Import schema utilities:
   ```typescript
   import { MultiStructuredData } from "@/components/structured-data";
   import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/schema";
   ```

2. Generate schemas in page component:
   ```typescript
   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

   const serviceSchema = generateServiceSchema(service, siteUrl);

   const breadcrumbSchema = generateBreadcrumbSchema([
     { name: "Home", url: siteUrl },
     { name: "Services", url: `${siteUrl}/services` },
     { name: service.title.rendered, url: `${siteUrl}/services/${service.slug}` },
   ]);
   ```

3. Add to page return (same pattern as blog).
  </action>
  <verify>`cd frontend && npx tsc --noEmit` passes</verify>
  <done>Service pages include Service and Breadcrumb schemas</done>
</task>

<task type="auto">
  <name>Task 4: Enhance sitemap with priorities and change frequencies</name>
  <files>frontend/app/sitemap.ts</files>
  <action>
Enhance the existing sitemap.ts with proper priorities:

1. Check if sitemap.ts exists - if not, create it following Next.js App Router convention.

2. Update to include all content types with appropriate settings:
   ```typescript
   import { MetadataRoute } from 'next';
   import { getPosts, getPages, getServices } from '@/lib/wordpress';

   export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
     const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

     const [posts, pages, services] = await Promise.all([
       getPosts(),
       getPages(),
       getServices(),
     ]);

     const sitemap: MetadataRoute.Sitemap = [
       // Homepage - highest priority
       {
         url: siteUrl,
         lastModified: new Date(),
         changeFrequency: 'weekly',
         priority: 1.0,
       },
       // Services listing
       {
         url: `${siteUrl}/services`,
         lastModified: new Date(),
         changeFrequency: 'weekly',
         priority: 0.9,
       },
       // Blog listing
       {
         url: `${siteUrl}/blog`,
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 0.8,
       },
       // Individual services - high priority
       ...services.map((service) => ({
         url: `${siteUrl}/services/${service.slug}`,
         lastModified: new Date(service.modified),
         changeFrequency: 'monthly' as const,
         priority: 0.8,
       })),
       // Blog posts - medium priority
       ...posts.map((post) => ({
         url: `${siteUrl}/blog/${post.slug}`,
         lastModified: new Date(post.modified),
         changeFrequency: 'monthly' as const,
         priority: 0.6,
       })),
       // Static pages - lower priority
       ...pages.map((page) => ({
         url: `${siteUrl}/${page.slug}`,
         lastModified: new Date(page.modified),
         changeFrequency: 'monthly' as const,
         priority: 0.5,
       })),
     ];

     return sitemap;
   }
   ```

3. Ensure all published content types are included.
  </action>
  <verify>
1. `cd frontend && npx tsc --noEmit` passes
2. `cd frontend && npm run build` succeeds
  </verify>
  <done>sitemap.ts includes all content types with appropriate priorities and change frequencies</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Complete SEO implementation with RankMath integration, structured data, and enhanced sitemap</what-built>
  <how-to-verify>
    1. Run: `cd frontend && npm run dev`
    2. Visit: http://localhost:3000
    3. View page source (Ctrl/Cmd+U) and search for "application/ld+json"
    4. Confirm Organization schema appears
    5. Visit: http://localhost:3000/blog/[any-post-slug]
    6. View source - confirm Article and BreadcrumbList schemas appear
    7. Visit: http://localhost:3000/services/[any-service-slug]
    8. View source - confirm Service and BreadcrumbList schemas appear
    9. Visit: http://localhost:3000/sitemap.xml
    10. Confirm sitemap loads with priority values
    11. Optional: Test a page URL in Google Rich Results Test (https://search.google.com/test/rich-results)
  </how-to-verify>
  <resume-signal>Type "approved" to complete Phase 1, or describe issues to fix</resume-signal>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `cd frontend && npm run build` succeeds
- [ ] Organization schema in layout.tsx
- [ ] Article + Breadcrumb schemas in blog/[slug]/page.tsx
- [ ] Service + Breadcrumb schemas in services/[slug]/page.tsx
- [ ] Sitemap includes all content types with priorities
- [ ] Human verification approved
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- JSON-LD appears in page source for all page types
- Sitemap accessible at /sitemap.xml with correct structure
- Phase 1 complete - SEO & Discoverability implemented
</success_criteria>

<output>
After completion, create `.planning/phases/1-seo-discoverability/1-03-SUMMARY.md`

This is the final plan for Phase 1. After completion, update STATE.md to mark Phase 1 complete.
</output>
