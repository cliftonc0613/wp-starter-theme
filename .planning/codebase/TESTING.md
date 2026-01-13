# Testing Patterns

**Analysis Date:** 2026-01-12

## Test Framework

**Runner:**
- Not configured - No test framework detected
- No `vitest.config.*`, `jest.config.*`, or `playwright.config.*` files

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# No test scripts configured
npm run lint                    # ESLint only
```

## Test File Organization

**Location:**
- No test files present in codebase
- No `__tests__/` directories
- No `*.test.ts`, `*.test.tsx`, `*.spec.ts` files

**Recommended Pattern (if implemented):**
```
frontend/
  components/
    Header.tsx
    Header.test.tsx          # Co-located unit test
  lib/
    wordpress.ts
    wordpress.test.ts        # Service tests
  __tests__/
    integration/             # Integration tests
```

## Test Coverage

**Requirements:**
- No coverage target configured
- No coverage reporting

**Opportunities (High Priority):**
1. WordPress API client (`frontend/lib/wordpress.ts`)
   - Test `getPosts()`, `getServices()`, `getTestimonials()`
   - Mock fetch responses
   - Test error handling

2. Form validation (`frontend/lib/schemas/contact.ts`)
   - Zod schema validation
   - Phone regex patterns
   - Honeypot field logic

3. API routes (`frontend/app/api/*/route.ts`)
   - Request validation
   - Error responses
   - Secret verification

4. YouTube embed parsing (`frontend/components/WordPressContent.tsx`)
   - 5 regex patterns for different embed formats
   - Critical: high risk of silent failures

## Linting & Code Quality

**ESLint Configuration:**
- Config File: `frontend/eslint.config.mjs`
- Format: ESM flat config
- Extends:
  - `eslint-config-next/core-web-vitals`
  - `eslint-config-next/typescript`
- Ignores: `.next/**`, `out/**`, `build/**`

**TypeScript:**
- Config: `frontend/tsconfig.json`
- Strict mode: `true`
- Target: ES2017
- Path alias: `@/*` → `./*`

**Prettier:**
- Not configured
- No `.prettierrc` or `prettier.config.js`
- Manual formatting

**PHP:**
- No linting configured
- No phpcs.xml or phpstan.neon
- Follows WordPress conventions by practice

## Test Types (Recommended)

**Unit Tests:**
- Scope: Individual functions in isolation
- Targets: `lib/wordpress.ts`, `lib/schemas/*.ts`
- Mocking: Mock fetch for API calls

**Integration Tests:**
- Scope: Multiple modules together
- Targets: API routes with database mocks
- Setup: Test environment variables

**E2E Tests:**
- Framework: Playwright recommended
- Scope: Full user flows
- Targets: Contact form submission, navigation

## Common Patterns (Recommended)

**Async Testing:**
```typescript
it('should fetch posts', async () => {
  const posts = await getPosts();
  expect(posts).toHaveLength(10);
});
```

**Error Testing:**
```typescript
it('should throw on invalid input', () => {
  expect(() => contactFormSchema.parse({})).toThrow();
});
```

**Mocking Fetch:**
```typescript
vi.mock('global', () => ({
  fetch: vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockData)
  })
}));
```

## Gaps & Recommendations

**Critical Gaps:**
1. No test framework configured
2. No test coverage for WordPress API integration
3. No validation of YouTube embed regex patterns
4. No API route testing

**Recommended Setup:**
1. Install Vitest: `npm install -D vitest @testing-library/react`
2. Add test scripts to `package.json`
3. Create `vitest.config.ts`
4. Start with `lib/wordpress.ts` tests
5. Add form validation tests
6. Add API route tests

**Priority Order:**
1. WordPress API client (data integrity)
2. Form validation (user experience)
3. YouTube embed parsing (content rendering)
4. API routes (security)

---

*Testing analysis: 2026-01-12*
*Update when test patterns change*
