Debug the following issue in this NestJS project: $input

Read the relevant source files before concluding. Use the knowledge base below to guide your investigation. Show the exact fix with file path and line reference.

---

## Diagnostic Knowledge Base

### Dependency Injection / Module errors

**`UnknownExportException`** — a provider is in `exports` but not in `providers` of the same module.
Fix: add the class to `providers` in the same module that exports it.

**`UnknownDependenciesException`** — a provider's dependency is not in scope. Check:
1. Is the dependency's module imported in this module?
2. Is the dependency in that module's `providers`?
3. Does that module have the dependency in its `exports`?

Key rule: `AuthModule` and `UserModule` both import `DatabaseModule` directly. Feature modules never import each other. Read `src/modules/auth/auth.module.ts` and `src/modules/user/user.module.ts`.

---

### Prisma / Database errors

**`PrismaClientInitializationError`** — `DATABASE_URL` not set or the database is unreachable. In Docker, the URL must point to the `postgres` service hostname, not `localhost`.

**`PrismaConfigEnvError`** — `DATABASE_URL` not set at generate time. `prisma/prisma.config.ts` reads `process.env.DATABASE_URL` — safe to be undefined at build time; must be set at runtime.

**Migration not applied** — run `npm run db:migrate-prod` or verify `docker-entrypoint.sh` ran successfully.

**Schema changed but types are stale** — run `npm run db:generate` after every `schema.prisma` edit.

---

### JWT / Auth errors

**`401 Unauthorized` on a protected route** — check that the `Authorization: Bearer <token>` header is present and the token is not expired.

**`401` on a route that should be public** — `@PublicRoute()` decorator is missing. Read `src/common/request/guards/jwt-access.guard.ts` to see how it checks metadata. Apply `@PublicRoute()` at the class or method level.

**`403 Forbidden`** — `RolesGuard` blocked the request. The user's `role` does not match `@AllowedRoles`. Check the decorator on the controller and the `role` field in the JWT payload.

**`@AllowedRoles` not working** — check it receives an array: `@AllowedRoles([UserRole.ADMIN])`, not `@AllowedRoles(UserRole.ADMIN)`.

---

### Validation errors (400)

**`ValidationPipe` rejection** — global pipe has `whitelist: true, forbidNonWhitelisted: true`. Any extra field in the request body causes a 400. Check the DTO has a decorated field for every property being sent.

**`transform: true` not converting types** — ensure `@Type(() => Number)` is on numeric query params when using `@Query()`.

---

### Test failures

**`clearAllMocks is not a function` or unexpected mock state** — do NOT call `jest.clearAllMocks()` manually in `beforeEach`; it is handled globally by `clearMocks: true` in `test/jest.json`.

**`Cannot find module 'src/...'`** — use the `src/` prefix (mapped via `moduleNameMapper` in `test/jest.json`), not relative `../../` paths.

**Coverage threshold failure** — check `test/jest.json` `coverageThreshold` values. Run `npm test` to see which metric (statements/branches/functions/lines) dropped. Coverage is collected only from `*.service.ts`, `*.guard.ts`, `*.filter.ts`, `*.interceptor.ts`, `*.repository.ts`.

**Mock not resetting between tests** — `clearMocks: true` resets call counts but not implementations. If `mockReturnValue` bleeds between tests, use `mockResolvedValueOnce` instead.

---

After identifying the root cause, provide:
1. The exact file path and line number of the problem
2. The corrected code
3. Any follow-up commands to run (e.g. `npm run db:generate`, `npm test`)
