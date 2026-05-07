Generate unit tests for: $ARGUMENTS

Read these files first to understand the exact testing patterns used in this project:
- `test/modules/user.service.spec.ts` — service test pattern
- `test/modules/auth.service.spec.ts` — service test with external mocks (argon2, jwt)
- `test/common/cache.service.spec.ts` — common service test pattern
- `test/common/database.service.spec.ts` — class mocking pattern with jest.mock()
- `test/jest.json` — Jest config (clearMocks + restoreMocks are global — do NOT add jest.clearAllMocks() in beforeEach)

Then read the actual file being tested to understand all methods, branches, and error paths.

Rules to follow:

**Structure**
- File goes in `test/` mirroring the `src/` path (e.g. `src/modules/post/services/post.service.ts` → `test/modules/post.service.spec.ts`)
- Top-level `describe('<ClassName>')` block
- Nested `describe('<methodName>')` for each public method
- `it('should be defined')` smoke test

**Mocking**
- Mock all injected dependencies as plain objects with `jest.fn()` for every method
- Do NOT use `jest.createMockFromModule` or `@golevelup/ts-jest`
- For module-level mocks (argon2, ioredis, prisma client) use `jest.mock('module-name')` at the top of the file
- `ConfigService` mock: implement `getOrThrow` with a `Record<string, string>` map covering all keys the service accesses

**Test cases — for every method generate:**
1. Happy path — returns expected value
2. Not-found / guard clause — throws `HttpException` with correct `HttpStatus`
3. Dependency failure — mock rejects, assert the error propagates or is handled
4. Edge cases specific to the method's branching logic

**Assertions**
- Use `await expect(promise).resolves.toEqual(...)` and `await expect(promise).rejects.toThrow(HttpException)`
- After write operations assert the repository method was called with `expect(mock.method).toHaveBeenCalledWith(...)`
- Use `expect.objectContaining({})` when only part of the call args matters

**Do NOT**
- Call `jest.clearAllMocks()` — handled globally by jest config
- Import `jest` — it is a global
- Add unnecessary `async` to tests that don't `await`
