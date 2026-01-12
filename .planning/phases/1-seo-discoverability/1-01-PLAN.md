---
phase: 1-seo-discoverability
plan: 01
type: execute
---

<objective>
Create RankMath SEO API integration with HTML parsing utility for headless WordPress.

Purpose: Enable automatic SEO metadata flow from WordPress RankMath to Next.js generateMetadata().
Output: Working `lib/seo.ts` with getRankMathMeta() function integrated into page templates.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-phase.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/1-seo-discoverability/1-CONTEXT.md
@frontend/lib/wordpress.ts
@frontend/app/blog/[slug]/page.tsx
@frontend/app/services/[slug]/page.tsx

**Constraint:** RankMath returns HTML string from `/wp-json/rankmath/v1/getHead?url=<full-url>`, not structured JSON. Parsing utility required.

**Pattern:** Follow existing wordpress.ts patterns for API functions (getApiUrl(), error handling, TypeScript interfaces).
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create SEO library with RankMath integration</name>
  <files>frontend/lib/seo.ts</files>
  <action>
Create new file `frontend/lib/seo.ts` with:

1. TypeScript interfaces:
   - `RankMathMeta` - parsed SEO data (title, description, canonical, robots, og_*, twitter_*, schema[])
   - `RankMathResponse` - API response shape ({ success: boolean, head: string })

2. HTML parsing utilities:
   - `extractMetaProperty(html, property)` - extract og:* meta content
   - `extractMetaName(html, name)` - extract name-based meta content
   - `parseRankMathHead(html)` - parse full HTML string into RankMathMeta

3. Main API function:
   - `getRankMathMeta(pageUrl: string)` - fetch from RankMath API, parse response
   - Use `getApiUrl()` pattern from wordpress.ts (but for rankmath/v1 endpoint)
   - Handle errors gracefully with fallback to null

4. Helper for Next.js metadata:
   - `generateSeoMetadata(meta: RankMathMeta | null, fallback: Metadata)` - convert to Next.js Metadata format

Follow wordpress.ts conventions: JSDoc comments, error logging, TypeScript strict mode.

**Important:** The RankMath endpoint is `/wp-json/rankmath/v1/getHead` (not wp/v2). Construct URL as `${WORDPRESS_API_URL.replace('/wp/v2', '')}/rankmath/v1/getHead`.
  </action>
  <verify>TypeScript compiles without errors: `cd frontend && npx tsc --noEmit`</verify>
  <done>lib/seo.ts exists with exported getRankMathMeta() and generateSeoMetadata() functions, no type errors</done>
</task>

<task type="auto">
  <name>Task 2: Integrate RankMath meta into page generateMetadata</name>
  <files>frontend/app/blog/[slug]/page.tsx, frontend/app/services/[slug]/page.tsx</files>
  <action>
Update generateMetadata() in both page files to use RankMath:

1. Import from lib/seo.ts:
   ```typescript
   import { getRankMathMeta, generateSeoMetadata } from "@/lib/seo";
   ```

2. Update generateMetadata() function:
   - Construct full page URL using `process.env.NEXT_PUBLIC_SITE_URL` + slug
   - Call `getRankMathMeta(pageUrl)`
   - Use `generateSeoMetadata()` with existing metadata as fallback
   - Keep existing fallback logic for when RankMath returns null

3. Pattern for blog/[slug]/page.tsx:
   ```typescript
   export async function generateMetadata({ params }: Props): Promise<Metadata> {
     const { slug } = await params;
     const post = await getPost(slug);
     if (!post) return {};

     const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
     const pageUrl = `${siteUrl}/blog/${slug}`;
     const rankMathMeta = await getRankMathMeta(pageUrl);

     const fallback: Metadata = {
       title: post.title.rendered,
       description: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
       // ... existing fallback
     };

     return generateSeoMetadata(rankMathMeta, fallback);
   }
   ```

4. Same pattern for services/[slug]/page.tsx but with service data.

**Important:** Keep existing fallback metadata - RankMath integration should enhance, not break existing SEO.
  </action>
  <verify>
1. `cd frontend && npx tsc --noEmit` passes
2. `cd frontend && npm run build` succeeds
  </verify>
  <done>Both page files use getRankMathMeta() in generateMetadata(), build passes, existing fallback preserved</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `cd frontend && npx tsc --noEmit` passes
- [ ] `cd frontend && npm run build` succeeds without errors
- [ ] lib/seo.ts exports getRankMathMeta and generateSeoMetadata
- [ ] Blog and service pages import and use SEO functions
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- No TypeScript errors
- RankMath API integration ready for use
- Fallback metadata preserved when RankMath unavailable
</success_criteria>

<output>
After completion, create `.planning/phases/1-seo-discoverability/1-01-SUMMARY.md`
</output>
