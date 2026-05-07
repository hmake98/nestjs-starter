Debug the following issue in this NestJS project: $ARGUMENTS

Read the relevant files and diagnose the root cause. Use the knowledge below to guide your investigation.

---

## Common issues and where to look

### Dependency Injection / Module errors
`UnknownExportException` — a provider is in `exports` but not in `providers` of the same module.
`UnknownDependenciesException` — a provider's dependency is not in scope. Check:
1. Is the dependency's module imported?
2. Is the dependency in that module's `providers`?
3. Is that module in `exports` so it's visible here?

Key rule in this repo: `AuthModule` and `UserModule` both import `DatabaseModule` directly. Feature modules never import each other. Read `src/modules/auth/auth.module.ts` and `src/modules/user/user.module.ts`.

### Prisma / database errors
`PrismaClientInitializationError` — `DATABASE_URL` not set or unreachable. In Docker, the URL must point to the `postgres` service name, not `localhost`.
`PrismaConfigEnvError` — `DATABASE_URL` not set at build time. `prisma generate` uses `prisma/prisma.config.ts` which reads `process.env.DATABASE_URL` (no throw on undefined — safe at build time).
Migration not applied — run `npm run db:migrate-prod` or check `docker-entrypoint.sh` ran successfully.

### Docker / container errors
`Cannot find module '...'` — `npm prune --omit=dev` removed a package that should be in `dependencies` not `devDependencies`. Check `package.json`.
App binding to `127.0.0.1` — `HTTP_HOST` must be `0.0.0.0` in Docker. Set in `docker-compose.yml` environment block.
Stale `dist/` — volume mount `.:/app` overwrites the built dist. The `docker-compose.yml` in this repo uses the `dev` stage with `nest start --watch`, not a pre-built dist.

### JWT / Auth errors
`401 Unauthorized` on a protected route — check the `Authorization: Bearer <token>` header is present and the token is not expired.
`401` on a public route — check `@PublicRoute()` decorator is applied. Read `src/common/request/guards/jwt-access.guard.ts` to see how it checks the metadata.
`403 Forbidden` — `RolesGuard` blocked the request. Check `@AllowedRoles` on the route matches the user's `role` field.

### Validation errors (400)
`ValidationPipe` is global with `whitelist: true, forbidNonWhitelisted: true` — any extra field in the body causes a 400. Check the DTO has a field for every property being sent.

### Test failures
`clearAllMocks is not a function` — do NOT call `jest.clearAllMocks()` manually; it is handled globally by `clearMocks: true` in `test/jest.json`.
Module path not found in tests — use `src/` prefix (mapped via `moduleNameMapper` in jest.json), not relative paths.
Coverage threshold failure — check `test/jest.json` `coverageThreshold` values; run `npm test` to see which metric dropped.

---

After identifying the root cause, show the exact fix with file path and line reference. If the issue is ambiguous, read the relevant source files before concluding.
