---
phase: 2-performance-caching
plan: 03
type: execute
domain: next-js
---

<objective>
Optimize images embedded in WordPress content with blur-up loading effect.

Purpose: Parse WordPress HTML content and replace img tags with optimized Next.js Images. This ensures ALL images on the site (not just featured images) get the premium blur-up experience.

Output: Content images load with blur-up effect via transformed WordPressContent component.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-phase.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/2-performance-caching/2-CONTEXT.md

**Depends on:**
@.planning/phases/2-performance-caching/2-02-PLAN.md (BlurImage component)

**Key files:**
@frontend/components/WordPressContent.tsx
@frontend/components/BlurImage.tsx

**Tech stack:** Next.js 16.1.1, React 19, TypeScript
**From CONTEXT.md:**
- All images get blur treatment (not just featured)
- HTML transform approach for content images
- Mobile first priority
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create content image parser utility</name>
  <files>frontend/lib/content-images.ts</files>
  <action>
1. Create `lib/content-images.ts` with utilities to parse WordPress HTML
2. Create `extractImages(html: string)` function:
   - Use regex to find all `<img>` tags in HTML
   - Extract: src, alt, width, height, class attributes
   - Return array of image data objects
3. Create `replaceImagesWithPlaceholders(html: string)` function:
   - Replace each `<img>` tag with a placeholder div: `<div data-content-image="INDEX"></div>`
   - Return: { html: transformedHtml, images: ImageData[] }
4. Type definitions:
   ```typescript
   interface ContentImage {
     src: string;
     alt: string;
     width?: number;
     height?: number;
     className?: string;
   }
   ```

AVOID: Don't use a full DOM parser (jsdom, cheerio) - keep it lightweight with regex.
WHY: Server-side compatibility, smaller bundle, WordPress HTML is predictable.
  </action>
  <verify>
- TypeScript compiles without errors
- Functions handle common WordPress image patterns
- `npm run build` succeeds
  </verify>
  <done>
- lib/content-images.ts exports extractImages and replaceImagesWithPlaceholders
- Properly typed ContentImage interface
- Handles WordPress image HTML patterns
  </done>
</task>

<task type="auto">
  <name>Task 2: Create ContentImage component</name>
  <files>frontend/components/ContentImage.tsx</files>
  <action>
1. Create `components/ContentImage.tsx` as a client component
2. Props: ContentImage data (src, alt, width, height, className)
3. Implementation:
   - Use BlurImage component for the actual rendering
   - If width/height provided, use them; otherwise use responsive sizing
   - Apply original className plus any blur styles
   - Handle the blur-up transition
4. For images without dimensions:
   - Use `fill` prop with a container div
   - Set aspect-ratio via CSS (default 16/9 for content images)

AVOID: Don't fetch image dimensions at runtime - use what WordPress provides or sensible defaults.
WHY: Fetching dimensions adds latency and complexity. WordPress usually includes dimensions.
  </action>
  <verify>
- Component renders images with blur effect
- Handles both dimensioned and non-dimensioned images
- `npm run build` succeeds
  </verify>
  <done>
- ContentImage component created
- Uses BlurImage internally
- Handles WordPress image data correctly
- Responsive sizing for images without dimensions
  </done>
</task>

<task type="auto">
  <name>Task 3: Update WordPressContent to render optimized images</name>
  <files>frontend/components/WordPressContent.tsx</files>
  <action>
1. Read current WordPressContent.tsx implementation
2. Update to use the content image parser:
   - Import replaceImagesWithPlaceholders from lib/content-images
   - Process the HTML prop through the parser
   - Render the transformed HTML via dangerouslySetInnerHTML
3. After rendering HTML, hydrate image placeholders:
   - Use useEffect to find all `[data-content-image]` elements
   - Create React portals or replace with ContentImage components
4. Alternative simpler approach if portals are complex:
   - Parse HTML and split into segments: [html, image, html, image, html]
   - Render as React fragments with ContentImage components inline
5. Ensure existing functionality preserved (prose styles, className prop)

AVOID: Don't break existing WordPressContent usage - it should be a drop-in enhancement.
WHY: Pages already use WordPressContent; changes should be transparent.
  </action>
  <verify>
- `npm run build` succeeds
- Blog posts with images render correctly
- Content images show blur-up effect
- No layout shifts
  </verify>
  <done>
- WordPressContent processes images through parser
- Content images render via ContentImage/BlurImage
- Existing functionality preserved
- Blur-up effect works on content images
  </done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `npm run build` succeeds without errors
- [ ] Content images in blog posts show blur-up effect
- [ ] No layout shifts when images load
- [ ] WordPressContent API unchanged (drop-in enhancement)
- [ ] No TypeScript errors
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- Content images have blur-up loading effect
- Existing page layouts preserved
- Mobile-friendly image loading
</success_criteria>

<output>
After completion, create `.planning/phases/2-performance-caching/2-03-SUMMARY.md`
</output>
