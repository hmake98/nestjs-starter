Generate a complete Jest unit test file for: $input

Provide the path to the file to test, e.g.: `src/modules/post/services/post.service.ts`

Study these reference files first:
- `test/modules/user.service.spec.ts`
- `test/modules/auth.service.spec.ts`
- `test/jest.json`

---

## Output Location

Mirror `src/` under `test/`:
- `src/modules/post/services/post.service.ts` → `test/modules/post.service.spec.ts`
- `src/common/cache/services/cache.service.ts` → `test/common/cache.service.spec.ts`

---

## Non-Negotiable Rules

**Mocking:**
- Mock every injected dependency as a plain object: `const mockPostRepository = { findById: jest.fn(), create: jest.fn() }`
- Provide via: `{ provide: PostRepository, useValue: mockPostRepository }`
- `ConfigService` mock: `{ getOrThrow: jest.fn((key: string) => configMap[key]) }` with a `Record<string, string>` covering all keys the service calls
- Module-level mocks (argon2, ioredis, Prisma): `jest.mock('module-name', () => ({ method: jest.fn() }))` at top of file
- Never use `jest.createMockFromModule`

**Setup:**
- Never call `jest.clearAllMocks()` in `beforeEach` — it is handled globally by `clearMocks: true` in `test/jest.json`
- Never import `jest` — it is a global
- Use `src/` path alias (mapped in jest.json) — not relative `../../` paths

**Faker:**
- Import `@faker-js/faker` normally — it is aliased to `test/mocks/faker.mock.ts` and returns deterministic values

**Structure:**
```typescript
describe('PostService', () => {
    let service: PostService;
    // declare mock variables

    beforeEach(async () => {
        const module = await Test.createTestingModule({ ... }).compile();
        service = module.get(PostService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getPost', () => {
        it('should return a post', async () => { ... });
        it('throws NOT_FOUND when post does not exist', async () => { ... });
        it('propagates repository error', async () => { ... });
    });
});
```

**Assertions:**
- Success: `await expect(service.method(args)).resolves.toEqual(expectedValue)`
- Error: `await expect(service.method(args)).rejects.toThrow(HttpException)`
- After writes: `expect(mock.method).toHaveBeenCalledWith(expect.objectContaining({ field: value }))`
- Never use `.toBeTruthy()` for value assertions — use `.toEqual()` or `.toBe()`

**Coverage per method:**
1. Happy path returning expected value
2. Guard/not-found path throwing `HttpException`
3. Dependency rejection propagation

---

Generate the complete spec file. Include all public methods of the class being tested.
