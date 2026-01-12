---
phase: 4-testing-monitoring
plan: 03
type: execute
---

<objective>
Set up Playwright for E2E testing with tests covering critical user flows.

Purpose: Verify the application works correctly from the user's perspective across the full stack.
Output: Playwright configured with E2E tests for homepage, blog, and contact form flows.
</objective>

<execution_context>
~/.claude/get-shit-done/workflows/execute-phase.md
~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/4-testing-monitoring/4-01-SUMMARY.md
@.planning/phases/4-testing-monitoring/4-02-SUMMARY.md
@.planning/codebase/TESTING.md

**Tech stack available:** Next.js 16.1.1, Vitest (unit tests), TypeScript
**Established patterns:**
- E2E tests in frontend/e2e/ directory
- User flow naming: user-flow.e2e.test.ts

**Key pages to test:**
- Homepage (/)
- Blog listing (/blog)
- Blog post (/blog/[slug])
- Services (/services)
- Contact (/contact)

@frontend/package.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install and configure Playwright</name>
  <files>frontend/package.json, frontend/playwright.config.ts, frontend/e2e/.gitkeep</files>
  <action>
Install Playwright:
- npm install -D @playwright/test
- npx playwright install chromium (just chromium for speed, can add more later)

Create playwright.config.ts with:
- testDir: './e2e'
- baseURL: 'http://localhost:3000' (or from env)
- webServer config to start dev server before tests
- Single project for Chromium initially
- Screenshot on failure
- Reasonable timeout (30s)
- Retries: 0 in CI, 1 locally

Add scripts to package.json:
- "test:e2e": "playwright test"
- "test:e2e:ui": "playwright test --ui"

Create frontend/e2e/ directory with .gitkeep.

Do NOT install all browsers - just chromium to keep setup fast.
  </action>
  <verify>npx playwright test --version shows installed version</verify>
  <done>Playwright installed, configured with webServer, ready for tests</done>
</task>

<task type="auto">
  <name>Task 2: Create core user flow E2E tests</name>
  <files>frontend/e2e/navigation.e2e.ts, frontend/e2e/blog.e2e.ts, frontend/e2e/contact.e2e.ts</files>
  <action>
Create E2E tests for critical user flows:

1. frontend/e2e/navigation.e2e.ts:
   - Homepage loads with hero section
   - Navigation menu is visible
   - Can navigate to Blog page
   - Can navigate to Services page
   - Can navigate to Contact page
   - Mobile menu works (test at mobile viewport)

2. frontend/e2e/blog.e2e.ts:
   - Blog listing page loads
   - Blog posts are displayed (or empty state message)
   - Category filter changes URL params
   - Tag filter changes URL params
   - Search modal opens with Cmd/Ctrl+K (if keyboard test feasible)
   - Can click through to blog post detail (if posts exist)

3. frontend/e2e/contact.e2e.ts:
   - Contact page loads with form
   - Form shows validation errors for empty submit
   - Form shows validation error for invalid email
   - Form fields accept valid input
   - (Skip actual submission - would need test API endpoint)

Use page object pattern or simple locators.
Use data-testid attributes where needed for reliable selection.
Tests should be resilient to content changes (test structure, not specific text).

Note: These tests require the dev server running with WordPress backend accessible.
For CI, may need to mock API or skip tests that require live data.
  </action>
  <verify>npm run test:e2e shows tests executing (may skip if no dev server)</verify>
  <done>E2E tests created for navigation, blog, and contact flows</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] Playwright installed and configured
- [ ] E2E test files created in frontend/e2e/
- [ ] Tests have clear, descriptive names
- [ ] playwright.config.ts has webServer configuration
</verification>

<success_criteria>

- Playwright configured with Chromium
- 3 E2E test files covering core flows
- Tests can run against local dev server
- npm run test:e2e script works
</success_criteria>

<output>
After completion, create `.planning/phases/4-testing-monitoring/4-03-SUMMARY.md`
</output>
