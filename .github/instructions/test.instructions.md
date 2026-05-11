---
applyTo: "test/**/*.spec.ts"
---

# Test Conventions

- Mock every injected dependency as a plain object: `const mockRepo = { method: jest.fn() }`. Never use `jest.createMockFromModule`.
- Provide mocks via `{ provide: Token, useValue: mockObject }`.
- `ConfigService` mock: `{ getOrThrow: jest.fn((key: string) => configMap[key]) }` with a typed key→value map.
- Never call `jest.clearAllMocks()` in `beforeEach` — handled globally by `clearMocks: true` in `test/jest.json`.
- Use `src/` path alias in imports, not relative `../../` paths.
- Output path mirrors `src/`: `src/modules/post/services/post.service.ts` → `test/modules/post.service.spec.ts`.
- Faker: import `@faker-js/faker` normally — aliased to `test/mocks/faker.mock.ts` for deterministic values.
- Structure: `describe('ClassName') > describe('methodName') > it('should...')`.
- Every public method needs: happy path (`resolves.toEqual`), guard/error throw (`rejects.toThrow(HttpException)`), dependency propagation.
- Assertions: `resolves.toEqual(...)`, `rejects.toThrow(HttpException)`, `toHaveBeenCalledWith(...)`. Never `.toBeTruthy()` for value checks.
