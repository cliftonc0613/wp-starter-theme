# Testing Patterns

**Analysis Date:** 2026-01-11

## Test Framework

**Status:** ❌ NOT CURRENTLY CONFIGURED

**Runner:**
- No test framework installed
- No test configuration files found
- No test scripts in `frontend/package.json`

**PRD Plans (Phase 4):**
- Jest + React Testing Library for unit tests
- Playwright for E2E tests
- Sentry for error tracking

**Run Commands:**
```bash
# Not yet available - testing infrastructure not implemented
# Future commands:
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm run test:coverage       # Coverage report
npm run test:e2e            # E2E tests
```

## Test File Organization

**Planned Location:**
- Co-located `*.test.ts` alongside source files (recommended)
- Or `__tests__/` directories

**Planned Naming:**
- Unit tests: `component-name.test.ts`
- Integration: `feature-name.integration.test.ts`
- E2E: `user-flow.e2e.test.ts`

**Planned Structure:**
```
frontend/
  components/
    Header.tsx
    Header.test.tsx
  lib/
    wordpress.ts
    wordpress.test.ts
  app/
    api/
      contact/
        route.ts
        route.test.ts
```

## Test Structure

**Recommended Suite Organization:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ModuleName', () => {
  describe('functionName', () => {
    beforeEach(() => {
      // reset state
    });

    it('should handle valid input', () => {
      // arrange
      const input = createTestInput();

      // act
      const result = functionName(input);

      // assert
      expect(result).toEqual(expectedOutput);
    });

    it('should throw on invalid input', () => {
      expect(() => functionName(null)).toThrow('Invalid input');
    });
  });
});
```

**Patterns (to implement):**
- Use beforeEach for per-test setup
- Use afterEach to restore mocks
- Arrange/act/assert structure
- One assertion focus per test

## Mocking

**Recommended Framework:**
- Vitest built-in mocking (vi)
- Or Jest mocks if using Jest

**Patterns (to implement):**
```typescript
import { vi } from 'vitest';

// Mock fetch for WordPress API calls
vi.mock('./wordpress', () => ({
  getPosts: vi.fn()
}));

// Mock module
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}));
```

**What to Mock:**
- WordPress REST API calls (`fetch` in `lib/wordpress.ts`)
- Next.js navigation (`notFound`, `redirect`)
- External services (when implemented)
- Environment variables

**What NOT to Mock:**
- Pure utility functions (`cn`, `formatDate`)
- Zod schemas (test actual validation)
- React component rendering

## Fixtures and Factories

**Recommended Test Data:**
```typescript
// Factory pattern for WordPress posts
function createTestPost(overrides?: Partial<WPPost>): WPPost {
  return {
    id: 1,
    slug: 'test-post',
    title: { rendered: 'Test Post' },
    content: { rendered: '<p>Content</p>' },
    excerpt: { rendered: '<p>Excerpt</p>' },
    date: '2025-01-01T00:00:00',
    ...overrides
  };
}

// Factory for services
function createTestService(overrides?: Partial<WPService>): WPService {
  return {
    id: 1,
    slug: 'test-service',
    title: { rendered: 'Test Service' },
    acf: {
      short_description: 'Description',
      icon: 'icon-name',
      features: []
    },
    ...overrides
  };
}
```

**Location (when implemented):**
- Factory functions: define in test file near usage
- Shared fixtures: `frontend/__fixtures__/`
- Mock API responses: `frontend/__fixtures__/api/`

## Coverage

**Requirements:**
- Not currently enforced
- Recommended: 80% for critical paths (lib/, api routes)

**When Implemented:**
```bash
npm run test:coverage
open coverage/index.html
```

**Focus Areas:**
- `frontend/lib/wordpress.ts` - API functions
- `frontend/lib/schemas/contact.ts` - Validation
- `frontend/app/api/*/route.ts` - API routes

## Test Types

**Unit Tests (to implement):**
- Scope: Test single function/component in isolation
- Focus:
  - `lib/wordpress.ts` fetch functions
  - `lib/schemas/contact.ts` validation
  - Component prop handling
- Speed: <100ms per test

**Integration Tests (to implement):**
- Scope: Test API routes end-to-end
- Focus:
  - `/api/contact` form submission
  - `/api/revalidate` webhook handling
  - `/api/preview` draft mode
- Mock: WordPress API, not internal modules

**E2E Tests (Playwright, to implement):**
- Scope: Full user flows
- Focus:
  - Homepage load and navigation
  - Blog listing and detail pages
  - Contact form submission
  - Mobile menu interaction
- Location: `frontend/e2e/`

## Common Patterns

**Async Testing:**
```typescript
it('should fetch posts', async () => {
  const posts = await getPosts();
  expect(posts).toHaveLength(10);
});
```

**Error Testing:**
```typescript
it('should throw on invalid slug', async () => {
  await expect(getPost('nonexistent')).rejects.toThrow();
});
```

**Form Validation Testing:**
```typescript
it('should validate email format', () => {
  const result = contactFormSchema.safeParse({
    name: 'Test',
    email: 'invalid-email',
    message: 'Hello'
  });
  expect(result.success).toBe(false);
});
```

**API Route Testing:**
```typescript
it('should return 400 for invalid input', async () => {
  const response = await POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' })
    })
  );
  expect(response.status).toBe(400);
});
```

## Current Validation

**Existing Validation (not tests, but type safety):**
- Zod schema validation for contact form: `frontend/lib/schemas/contact.ts`
- TypeScript strict mode catches type errors at build time
- ESLint catches code quality issues

**Gaps:**
- No runtime test execution
- No regression testing
- No coverage tracking
- No E2E verification

---

*Testing analysis: 2026-01-11*
*Update when test patterns change*
