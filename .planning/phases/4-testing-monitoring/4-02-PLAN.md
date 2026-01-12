---
phase: 4-testing-monitoring
plan: 02
type: execute
---

<objective>
Add unit tests for core library functions: WordPress API client, schema generators, and contact form validation.

Purpose: Cover the critical business logic that powers SEO, data fetching, and form handling.
Output: Comprehensive test coverage for lib/ modules with mocked external dependencies.
</objective>

<execution_context>
~/.claude/get-shit-done/workflows/execute-phase.md
~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/4-testing-monitoring/4-01-SUMMARY.md

**Tech stack available:** Vitest, React Testing Library, jsdom
**Established patterns:**
- Factory functions for test data (createTestPost, createTestService)
- Mock fetch for API calls
- Arrange/act/assert structure

**Constraining decisions:**
- Phase 1-02: Schema generators are pure functions (easy to test)
- Phase 1-01: Regex-based HTML parsing (test parsing logic)

@frontend/lib/wordpress.ts
@frontend/lib/schema.ts
@frontend/lib/schemas/contact.ts
@frontend/lib/test-utils.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add WordPress API client tests</name>
  <files>frontend/lib/__tests__/wordpress.test.ts</files>
  <action>
Create tests for lib/wordpress.ts covering:

1. getPosts():
   - Returns array of posts from mocked API
   - Handles empty response
   - Passes query params correctly (per_page, categories, tags)

2. getPost(slug):
   - Returns single post by slug
   - Returns null for non-existent slug
   - Includes embedded data (_embed param)

3. getCategories() / getTags():
   - Returns taxonomy terms
   - Respects hide_empty parameter

4. search():
   - Combines results from multiple content types
   - Handles partial failures gracefully (per 3-01 decision)

Mock fetch globally using vi.mock or vi.spyOn(global, 'fetch').
Use factory functions from test-utils.ts for mock response data.
Do NOT test actual network calls - mock all fetch responses.
  </action>
  <verify>npm run test:run -- wordpress.test.ts shows all tests passing</verify>
  <done>WordPress API functions have tests covering happy path and error cases</done>
</task>

<task type="auto">
  <name>Task 2: Add schema generator tests</name>
  <files>frontend/lib/__tests__/schema.test.ts</files>
  <action>
Create tests for lib/schema.ts covering all 6 generators:

1. generateOrganizationSchema():
   - Returns valid Organization schema with @context and @type
   - Includes required fields (name, url, logo)

2. generateArticleSchema(post):
   - Returns Article schema from WPPost
   - Handles missing optional fields gracefully
   - Formats dates correctly

3. generateServiceSchema(service):
   - Returns Service schema from WPService
   - Maps ACF fields correctly

4. generateBreadcrumbSchema(items):
   - Returns BreadcrumbList with ordered items
   - Each item has position, name, item URL

5. generateFAQSchema(items):
   - Returns FAQPage schema
   - Formats question/answer pairs correctly

6. generateReviewSchema(testimonial):
   - Returns Review schema from WPTestimonial
   - Includes rating if present

Each test should verify:
- @context is "https://schema.org"
- @type is correct for the schema type
- Required properties are present
- Output is valid JSON-LD structure
  </action>
  <verify>npm run test:run -- schema.test.ts shows all tests passing</verify>
  <done>All 6 schema generators have tests validating output structure</done>
</task>

<task type="auto">
  <name>Task 3: Add contact form validation tests</name>
  <files>frontend/lib/__tests__/contact.test.ts</files>
  <action>
Create tests for lib/schemas/contact.ts Zod schema:

1. Valid input:
   - Accepts valid name, email, message
   - Accepts optional phone, company, budget, timeline

2. Invalid email:
   - Rejects malformed emails
   - Rejects empty email

3. Required fields:
   - Rejects missing name
   - Rejects missing email
   - Rejects missing message

4. Field constraints:
   - Name minimum length
   - Message minimum length
   - Budget must be valid option if provided
   - Timeline must be valid option if provided

5. Edge cases:
   - Trims whitespace from inputs
   - Handles unicode characters in name/message

Use safeParse() to test validation without throwing.
Verify error messages are user-friendly.
  </action>
  <verify>npm run test:run -- contact.test.ts shows all tests passing</verify>
  <done>Contact form schema has comprehensive validation tests</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `npm run test:run` executes all test files
- [ ] All tests pass (wordpress, schema, contact)
- [ ] No TypeScript errors in test files
- [ ] Tests use mocks appropriately (no real API calls)
</verification>

<success_criteria>

- WordPress API client tested with mocked fetch
- All 6 schema generators tested
- Contact form validation thoroughly tested
- No flaky tests (all deterministic)
</success_criteria>

<output>
After completion, create `.planning/phases/4-testing-monitoring/4-02-SUMMARY.md`
</output>
