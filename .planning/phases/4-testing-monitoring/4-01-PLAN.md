---
phase: 4-testing-monitoring
plan: 01
type: execute
---

<objective>
Set up Vitest + React Testing Library testing infrastructure for the Next.js frontend.

Purpose: Establish the testing foundation that all subsequent test plans will build upon.
Output: Working test runner with first passing test demonstrating the setup works.
</objective>

<execution_context>
~/.claude/get-shit-done/workflows/execute-phase.md
~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/codebase/TESTING.md
@.planning/codebase/CONVENTIONS.md

**Tech stack available:** Next.js 16.1.1, React 19, TypeScript 5, Tailwind 4, SWR
**Established patterns:**
- Co-located test files (*.test.ts next to source)
- Factory pattern for test data
- Arrange/act/assert structure

**Constraining decisions:**
- Phase 1-02: Separate schema generators from React components (makes them easily testable)
- Phase 2-01: SWR hooks reuse existing API functions (test API functions, not hooks)

@frontend/package.json
@frontend/tsconfig.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install Vitest and React Testing Library</name>
  <files>frontend/package.json, frontend/vitest.config.ts, frontend/vitest.setup.ts</files>
  <action>
Install test dependencies:
- vitest (test runner, faster than Jest for Vite-adjacent projects)
- @testing-library/react (component testing)
- @testing-library/jest-dom (DOM matchers)
- @vitejs/plugin-react (for JSX transform in tests)
- jsdom (DOM environment)

Create vitest.config.ts with:
- Environment: jsdom
- Setup files: vitest.setup.ts
- Include pattern: **/*.test.{ts,tsx}
- Path alias resolution matching tsconfig.json (@/* -> ./)
- Globals: true (so tests don't need imports)

Create vitest.setup.ts with:
- Import @testing-library/jest-dom for extended matchers
- Any global test setup

Add scripts to package.json:
- "test": "vitest"
- "test:run": "vitest run"
- "test:coverage": "vitest run --coverage"

Use Vitest over Jest because: faster startup, native ESM support, better TypeScript integration, simpler config for modern projects.
  </action>
  <verify>npm run test:run exits with 0 (no tests yet, but runner works)</verify>
  <done>Vitest installed, configured, and executable via npm test</done>
</task>

<task type="auto">
  <name>Task 2: Create test utilities and first test</name>
  <files>frontend/lib/__tests__/utils.test.ts, frontend/lib/test-utils.ts</files>
  <action>
Create frontend/lib/test-utils.ts with:
- Re-export everything from @testing-library/react
- Custom render function that wraps with providers if needed
- Factory functions for test data (createTestPost, createTestService)

Create frontend/lib/__tests__/utils.test.ts testing the cn() utility:
- Test basic class merging
- Test conditional classes
- Test Tailwind merge behavior (conflicting classes)

This validates the test infrastructure works end-to-end.
  </action>
  <verify>npm run test:run shows 1 test file, all tests passing</verify>
  <done>Test utilities created, cn() utility has passing tests, infrastructure validated</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `npm run test:run` executes without errors
- [ ] At least 1 test file found and executed
- [ ] All tests pass
- [ ] No TypeScript errors in test files
</verification>

<success_criteria>

- Vitest + RTL installed and configured
- Test scripts added to package.json
- First test passing (cn utility)
- Test utilities with factory functions ready for use
</success_criteria>

<output>
After completion, create `.planning/phases/4-testing-monitoring/4-01-SUMMARY.md`
</output>
