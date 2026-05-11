Review the following code or file for quality, correctness, and adherence to this project's conventions: $ARGUMENTS

Read the file(s) being reviewed carefully. Then check against every rule below.

---

## Checklist

### Module structure
- [ ] Feature module imports `DatabaseModule` directly — not `UserModule` or another feature module
- [ ] No circular imports between feature modules
- [ ] Module only exports what other modules actually need
- [ ] `CommonModule` is only imported by `AppModule`

### Services
- [ ] All errors thrown as `HttpException` with an i18n key string and `HttpStatus` constant — never a raw string message
- [ ] Existence checks use a private `assertExists` helper, not inline guards
- [ ] No direct `process.env` access — use `ConfigService.getOrThrow<T>(key)`
- [ ] `@Injectable()` decorator present
- [ ] No business logic in controllers — controllers only delegate to services

### Controllers
- [ ] `@ApiTags`, `@ApiBearerAuth('accessToken')` present on class
- [ ] Every method has `@ApiEndpoint({ summary, messageKey })` — no bare HTTP decorators without doc
- [ ] Admin controllers have `@AllowedRoles([UserRole.ADMIN])` at class level
- [ ] Public routes have `@PublicRoute()` — not missing auth bypass
- [ ] Controllers return service result directly — no manual response shaping

### DTOs
- [ ] Response DTOs: `@Expose()` on every included field, `@Exclude()` on sensitive fields (passwordHash etc.)
- [ ] Response DTOs have `@ApiProperty` with a `faker` example on each field
- [ ] Input DTOs have `class-validator` decorators on every field
- [ ] Update DTOs have all fields `@IsOptional()`
- [ ] No `any` types

### Repository
- [ ] Only Prisma calls — no raw SQL unless necessary
- [ ] `findUnique` with `select: { id: true }` for existence checks (not `findFirst`)
- [ ] Soft delete sets `deletedAt: new Date()` — not a hard delete
- [ ] Returns typed entity interfaces — not raw Prisma results with `as any`

### Guards & decorators
- [ ] `@PublicRoute()` used only where truly public — health check and auth endpoints
- [ ] `@AllowedRoles` receives an array, not a spread

### Logging
- [ ] No `console.log` — use NestJS `Logger`
- [ ] Logger instantiated as `private readonly logger = new Logger(ClassName.name)`
- [ ] Only 5xx errors logged in exception filter — 4xx handled by pino-http

### Tests
- [ ] No `jest.clearAllMocks()` in `beforeEach` — handled globally
- [ ] Every public method has at least a happy path and an error path test
- [ ] Mocks are plain objects, not `jest.createMockFromModule`
- [ ] No `.toBeTruthy()` for value assertions — use `.toEqual()` or `.toBe()`

### General
- [ ] No `any` type — use `unknown` with type narrowing if necessary
- [ ] No commented-out code
- [ ] Imports use `src/` path alias, not relative `../../` paths

---

For each failed check: quote the offending line, explain the problem, and show the corrected version.
For passing checks: no need to mention them.
End with a summary: **blocking issues** (must fix) vs **suggestions** (nice to have).
