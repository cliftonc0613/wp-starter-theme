---
phase: 2-performance-caching
plan: 02
type: execute
domain: next-js
---

<objective>
Create BlurImage component with blur placeholder support for featured/hero images.

Purpose: Implement Medium-style blur-up image loading for featured images. Low-quality placeholder sharpens into full image for a polished, premium feel.

Output: BlurImage component used for all featured images on blog posts and service pages.
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

**Key files:**
@frontend/app/blog/[slug]/page.tsx
@frontend/app/services/[slug]/page.tsx

**Tech stack:** Next.js 16.1.1, React 19, TypeScript
**From CONTEXT.md:**
- Blur-up like Medium — LQIP that sharpens into full image
- All images get the treatment
- Mobile first priority
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create BlurImage component</name>
  <files>frontend/components/BlurImage.tsx</files>
  <action>
1. Create `components/BlurImage.tsx` as a client component ('use client')
2. Component props should extend Next.js ImageProps:
   - All standard Image props (src, alt, width, height, fill, sizes, priority, etc.)
   - Optional `blurDataURL` prop for custom placeholder
3. Implementation:
   - Use Next.js Image component internally
   - Set `placeholder="blur"` by default
   - For remote images without blurDataURL, use a tiny transparent placeholder or CSS blur effect
   - Add smooth transition CSS for the blur-to-sharp effect
4. Handle both cases:
   - If blurDataURL provided: use it directly
   - If no blurDataURL: use CSS-based blur effect with onLoad transition
5. Add CSS for smooth transition:
   ```css
   .blur-load {
     filter: blur(20px);
     transition: filter 0.3s ease-out;
   }
   .blur-load.loaded {
     filter: blur(0);
   }
   ```

AVOID: Don't try to generate blur placeholders at runtime for remote images - Next.js only supports this for local images.
WHY: Remote images need either a pre-generated blurDataURL or CSS-based approach. We'll use CSS blur for simplicity and consistency.
  </action>
  <verify>
- Component exports correctly
- TypeScript types are correct
- `npm run build` succeeds
  </verify>
  <done>
- BlurImage component created at components/BlurImage.tsx
- Extends Next.js Image with blur placeholder support
- Handles both blurDataURL and CSS-based blur approaches
- Smooth transition from blur to sharp
  </done>
</task>

<task type="auto">
  <name>Task 2: Update featured images to use BlurImage</name>
  <files>frontend/app/blog/[slug]/page.tsx, frontend/app/services/[slug]/page.tsx</files>
  <action>
1. In `app/blog/[slug]/page.tsx`:
   - Import BlurImage from '@/components/BlurImage'
   - Replace the featured image `<Image>` component with `<BlurImage>`
   - Keep all existing props (src, alt, fill, sizes, priority, className)
2. In `app/services/[slug]/page.tsx`:
   - Same replacement for the featured image
3. Ensure both pages still render correctly with the new component

AVOID: Don't change image sizing, layout, or other visual properties - only swap the component.
WHY: We want the blur effect without breaking existing layouts.
  </action>
  <verify>
- `npm run build` succeeds
- Both pages still render featured images correctly
- No layout shifts or visual regressions
  </verify>
  <done>
- blog/[slug]/page.tsx uses BlurImage for featured image
- services/[slug]/page.tsx uses BlurImage for featured image
- Build passes
- Images display correctly with blur-up effect
  </done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `npm run build` succeeds without errors
- [ ] BlurImage component exists and exports correctly
- [ ] Blog post featured images use BlurImage
- [ ] Service page featured images use BlurImage
- [ ] No TypeScript errors
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- Featured images have blur-up loading effect
- No layout shifts or visual regressions
</success_criteria>

<output>
After completion, create `.planning/phases/2-performance-caching/2-02-SUMMARY.md`
</output>
