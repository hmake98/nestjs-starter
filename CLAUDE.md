# CLAUDE.md

This file gives Claude Code complete context to work in this repository without scanning source files each session.

## Stack

NestJS 11 · Prisma 7 + `@prisma/adapter-pg` (pg Pool, no Prisma binary engine) · PostgreSQL · Redis (ioredis via `CacheService`) · BullMQ · JWT (passport-jwt, argon2) · nestjs-pino · nestjs-i18n · Sentry · Swagger (non-production only) · TypeScript 6 · Node ≥20

## Commands

```bash
npm run dev               # nest start --watch
npm run build             # nest build → dist/
npm start                 # node dist/main
npm test                  # jest --coverage --runInBand --forceExit
npm run lint:fix          # eslint --fix
npm run format            # prettier --write
npm run db:generate       # prisma generate --config prisma/prisma.config.ts
npm run db:migrate        # prisma migrate dev
npm run db:migrate-prod   # prisma migrate deploy
npm run seed:admin        # npm run cli -- seed:admin
npm run remove:admin      # npm run cli -- remove:admin
```

## Directory Structure

```
src/
├── app/
│   ├── app.module.ts           ← root module (see Module Wiring below)
│   ├── controllers/
│   │   └── health.controller.ts
│   └── enums/
│       └── app.enum.ts         ← APP_ENVIRONMENT enum
├── common/
│   ├── common.module.ts        ← imports ConfigModule + all infra; exports DatabaseModule, CacheModule
│   ├── config/                 ← registerAs() factories; never import elsewhere directly
│   │   ├── index.ts            ← barrel: [AppConfig, AuthConfig, DocConfig, RedisConfig, SeedConfig]
│   │   ├── app.config.ts       ← 'app.*' keys
│   │   ├── auth.config.ts      ← 'auth.accessToken.*' / 'auth.refreshToken.*' keys
│   │   ├── doc.config.ts       ← 'doc.*' keys
│   │   ├── redis.config.ts     ← 'redis.*' keys
│   │   └── seed.config.ts      ← 'seed.admin.*' keys
│   ├── bullmq/                 ← BullMqModule (shared Redis connection)
│   ├── cache/
│   │   ├── cache.module.ts
│   │   ├── constants/cache.constant.ts   ← REDIS_CLIENT token
│   │   └── services/cache.service.ts     ← CacheService (ioredis wrapper)
│   ├── database/
│   │   ├── database.module.ts            ← provides + exports DatabaseService, UserRepository
│   │   ├── services/database.service.ts  ← PrismaClient via PrismaPg adapter
│   │   ├── repositories/user.repository.ts
│   │   ├── interfaces/user.interface.ts  ← UserEntity, CreateUserInput, UpdateUserInput
│   │   └── enums/role.enum.ts           ← re-exports Prisma Role as UserRole
│   ├── doc/
│   │   └── decorators/
│   │       ├── doc.api-endpoint.decorator.ts  ← @ApiEndpoint (THE decorator for all methods)
│   │       ├── doc.response.decorator.ts
│   │       ├── doc.generic.decorator.ts
│   │       └── doc.paginated.decorator.ts
│   ├── logger/
│   │   └── services/logger.service.ts
│   ├── message/
│   │   └── services/message.service.ts   ← i18n resolution
│   ├── request/
│   │   ├── request.module.ts             ← registers 3 APP_GUARDs
│   │   ├── constants/request.constant.ts ← PUBLIC_ROUTE_KEY, ROLES_KEY
│   │   ├── decorators/
│   │   │   ├── auth-user.decorator.ts    ← @AuthUser()
│   │   │   ├── public.decorator.ts       ← @PublicRoute()
│   │   │   └── roles.decorator.ts        ← @AllowedRoles([...])
│   │   ├── guards/
│   │   │   ├── jwt-access.guard.ts
│   │   │   ├── jwt-refresh.guard.ts      ← used only on refresh endpoint
│   │   │   └── roles.guard.ts
│   │   └── interfaces/request.interface.ts  ← IAuthUser, IRequest
│   └── response/
│       ├── response.module.ts
│       ├── dtos/
│       │   ├── response.success.dto.ts    ← ApiSuccessResponseDto<T>
│       │   ├── response.generic.dto.ts    ← ApiGenericResponseDto
│       │   ├── response.paginated.dto.ts
│       │   └── response.error.dto.ts
│       ├── filters/response.exception.filter.ts
│       ├── interceptors/response.interceptor.ts
│       └── services/
│           ├── response.serializer.service.ts
│           └── response.sentry.service.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── controllers/auth.public.controller.ts
│   │   ├── dtos/
│   │   │   ├── auth.login.dto.ts    ← UserLoginDto
│   │   │   ├── auth.signup.dto.ts   ← UserCreateDto extends UserLoginDto
│   │   │   └── auth.response.dto.ts ← TokenDto, AuthResponseDto, AuthRefreshResponseDto
│   │   ├── providers/
│   │   │   ├── jwt-access.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   └── services/auth.service.ts
│   └── user/
│       ├── user.module.ts
│       ├── controllers/
│       │   ├── user.public.controller.ts  ← GET /v1/user/profile, PUT /v1/user
│       │   └── user.admin.controller.ts   ← DELETE /v1/admin/user/:id
│       ├── dtos/
│       │   ├── user.dto.ts        ← UserResponseDto, UserGetProfileResponseDto, UserUpdateProfileResponseDto
│       │   └── user.update.dto.ts ← UserUpdateDto
│       └── services/user.service.ts
├── workers/
│   ├── worker.module.ts
│   └── schedulers/midnight.scheduler.ts
└── migration/
    ├── migration.module.ts
    └── seeds/user.seed.ts
```

## Module Wiring

**AppModule** (`src/app/app.module.ts`) imports:
```
ConfigModule.forRoot({ load: configs, isGlobal: true, cache: true })
TerminusModule
CommonModule      ← all infrastructure
WorkerModule      ← cron schedulers
AuthModule        ← feature
UserModule        ← feature
```

**CommonModule** imports `DatabaseModule, CustomLoggerModule, RequestModule, ResponseModule, CacheModule, BullMqModule` and **exports only** `DatabaseModule, CacheModule`.

**Feature modules** (`AuthModule`, `UserModule`) import `DatabaseModule` directly — never each other.

**Adding a new feature module:**
1. Create `src/modules/<name>/<name>.module.ts` with `imports: [DatabaseModule]`
2. Add `<Name>Module` to `AppModule` imports

**Adding a new repository:**
1. Create `src/common/database/repositories/<name>.repository.ts`
2. Add to both `providers` and `exports` in `src/common/database/database.module.ts`

## Guard Order & Auth Decorators

`RequestModule` registers guards in this exact order via `APP_GUARD`:
1. `ThrottlerGuard` — rate limiting (config: `app.throttle.ttl` = 60s, `app.throttle.limit` = 10 req)
2. `JwtAccessGuard` — JWT validation; skipped when `@PublicRoute()` metadata is present
3. `RolesGuard` — role check; skipped when no `@AllowedRoles` metadata

| Decorator | Import from | Effect |
|---|---|---|
| `@PublicRoute()` | `src/common/request/decorators/public.decorator` | Bypasses JwtAccessGuard |
| `@AllowedRoles([UserRole.ADMIN])` | `src/common/request/decorators/roles.decorator` | **Array required**; RolesGuard checks `request.user.role` |
| `@AuthUser()` | `src/common/request/decorators/auth-user.decorator` | Extracts `IAuthUser` from `request.user` |
| `@UseGuards(JwtRefreshGuard)` | guard + `@nestjs/common` | Only on the refresh-token endpoint |

`IAuthUser = { userId: string, role: UserRole }` — defined in `src/common/request/interfaces/request.interface.ts`

**Existing routes:**
- `POST /v1/auth/login` — `@PublicRoute()` at class level
- `POST /v1/auth/signup` — `@PublicRoute()` at class level
- `GET /v1/auth/refresh-token` — `@UseGuards(JwtRefreshGuard)` + `@ApiBearerAuth('refreshToken')`
- `GET /v1/user/profile` — JWT-protected, uses `@AuthUser()`
- `PUT /v1/user` — JWT-protected, uses `@AuthUser()`
- `DELETE /v1/admin/user/:id` — `@AllowedRoles([UserRole.ADMIN])` at class level
- `GET /health` — `VERSION_NEUTRAL`, `@PublicRoute()`

## Config Factory Pattern

Config keys use dot-path notation mirroring `registerAs` nesting. Always `ConfigService.getOrThrow<T>(key)` — never `process.env` in services/controllers.

```typescript
// src/common/config/auth.config.ts
export default registerAs('auth', () => ({
    accessToken: {
        secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
        tokenExp: process.env.AUTH_ACCESS_TOKEN_EXP,
    },
    refreshToken: {
        secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
        tokenExp: process.env.AUTH_REFRESH_TOKEN_EXP,
    },
}));

// Usage in service:
this.configService.getOrThrow<string>('auth.accessToken.secret')
this.configService.getOrThrow<string>('auth.refreshToken.tokenExp')
```

**Available config key namespaces:**
- `app.env`, `app.name`, `app.http.host`, `app.http.port`, `app.throttle.ttl`, `app.throttle.limit`, `app.cors`, `app.debug`, `app.logLevel`
- `auth.accessToken.secret`, `auth.accessToken.tokenExp`, `auth.refreshToken.secret`, `auth.refreshToken.tokenExp`
- `redis.url`
- `doc.*`
- `seed.admin.*`

## Database / Repository Pattern

`DatabaseService` wraps `PrismaClient` with `PrismaPg` adapter. It exposes Prisma delegates directly: `this.db.user.*`, `this.db.post.*`, etc.

```typescript
// Repository — src/common/database/repositories/user.repository.ts
@Injectable()
export class UserRepository {
    constructor(private readonly db: DatabaseService) {}

    findById(id: string): Promise<UserEntity | null> {
        return this.db.user.findUnique({ where: { id } });
    }

    findByEmail(email: string): Promise<UserEntity | null> {
        return this.db.user.findUnique({ where: { email } });
    }

    async existsById(id: string): Promise<boolean> {
        const found = await this.db.user.findUnique({ where: { id }, select: { id: true } });
        return found !== null;
    }

    async existsByEmail(email: string): Promise<boolean> {
        const found = await this.db.user.findUnique({ where: { email }, select: { id: true } });
        return found !== null;
    }

    create(data: CreateUserInput): Promise<UserEntity> {
        const { password, ...rest } = data;
        return this.db.user.create({ data: { ...rest, passwordHash: password } });
    }

    update(id: string, data: UpdateUserInput): Promise<UserEntity> {
        return this.db.user.update({ where: { id }, data });
    }

    softDelete(id: string): Promise<UserEntity> {
        return this.db.user.update({ where: { id }, data: { deletedAt: new Date() } });
    }

    async hardDeleteByEmail(email: string): Promise<number> {
        const result = await this.db.user.deleteMany({ where: { email } });
        return result.count;
    }
}
```

Rules:
- Existence checks: `findUnique({ select: { id: true } })` — never `count`, never `findFirst`
- Soft delete: set `deletedAt: new Date()` — never `delete()`
- `hardDelete*` only for test cleanup
- Return types use `*Entity` interfaces, not raw Prisma with `as any`

## Service Pattern

```typescript
// src/modules/user/services/user.service.ts
@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getProfile(userId: string): Promise<UserGetProfileResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpException('user.error.userNotFound', HttpStatus.NOT_FOUND);
        return user;
    }

    async updateUser(userId: string, data: UserUpdateDto): Promise<UserUpdateProfileResponseDto> {
        await this.assertExists(userId);
        return this.userRepository.update(userId, data);
    }

    async deleteUser(userId: string): Promise<ApiGenericResponseDto> {
        await this.assertExists(userId);
        await this.userRepository.softDelete(userId);
        return { success: true, message: 'user.success.userDeleted' };
    }

    private async assertExists(userId: string): Promise<void> {
        const exists = await this.userRepository.existsById(userId);
        if (!exists) throw new HttpException('user.error.userNotFound', HttpStatus.NOT_FOUND);
    }
}
```

Rules:
- Inject repositories (not `DatabaseService` directly)
- Logger: `private readonly logger = new Logger(ClassName.name)` — only log unexpected 5xx
- Errors: `throw new HttpException('domain.error.key', HttpStatus.STATUS)` — always i18n key string
- `private async assertExists(id)` for repeated existence checks
- Boolean success: return `{ success: true, message: 'domain.success.key' }` (plain object matching `ApiGenericResponseDto`)

## Controller Pattern

```typescript
// Public controller
@ApiTags('public.user')
@ApiBearerAuth('accessToken')
@Controller({ path: '/user', version: '1' })
export class UserPublicController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @ApiEndpoint({ summary: 'Get user profile', serialization: UserGetProfileResponseDto, messageKey: 'user.success.profile' })
    getProfile(@AuthUser() user: IAuthUser): Promise<UserGetProfileResponseDto> {
        return this.userService.getProfile(user.userId);
    }

    @Put()
    @ApiEndpoint({ summary: 'Update user profile', serialization: UserUpdateProfileResponseDto, messageKey: 'user.success.updated' })
    updateUser(@AuthUser() user: IAuthUser, @Body() payload: UserUpdateDto): Promise<UserUpdateProfileResponseDto> {
        return this.userService.updateUser(user.userId, payload);
    }
}

// Admin controller
@ApiTags('admin.user')
@ApiBearerAuth('accessToken')
@AllowedRoles([UserRole.ADMIN])
@Controller({ path: '/admin/user', version: '1' })
export class UserAdminController {
    @Delete(':id')
    @ApiEndpoint({ summary: 'Delete user', messageKey: 'user.success.deleted' })
    deleteUser(@Param('id') userId: string): Promise<ApiGenericResponseDto> {
        return this.userService.deleteUser(userId);
    }
}
```

**`@ApiEndpoint` signature:**
```typescript
ApiEndpoint({ summary, serialization?, paginated?, messageKey, httpStatus? })
```
- With `serialization`: wraps in `ApiSuccessResponseDto<T>` envelope
- With `paginated: true` + `serialization`: wraps in paginated envelope
- Without `serialization`: uses `ApiGenericResponseDto` shape
- `httpStatus` defaults to `HttpStatus.OK`; set `HttpStatus.CREATED` for POST

## DTO Patterns

**Response DTOs** (`<name>.dto.ts`):
```typescript
export class UserResponseDto implements Omit<UserEntity, 'passwordHash'> {
    @ApiProperty({ example: faker.string.uuid() }) @Expose() @IsUUID() id: string;
    @ApiProperty({ example: faker.internet.email() }) @Expose() @IsEmail() email: string;
    @ApiProperty({ example: faker.person.firstName(), required: false, nullable: true })
    @Expose() @IsString() @IsOptional() firstName: string | null;
    @ApiProperty({ enum: UserRole, example: faker.helpers.arrayElement(Object.values(UserRole)) })
    @Expose() @IsEnum(UserRole) role: UserRole;
    // ... all fields with @Expose() + @ApiProperty()

    @ApiHideProperty() @Exclude() passwordHash: string; // sensitive: hide + exclude
}

export class UserGetProfileResponseDto extends UserResponseDto {}
export class UserUpdateProfileResponseDto extends UserResponseDto {}
```

- Every included field: `@Expose()` + `@ApiProperty({ example: faker.* })`
- Nullable optional: `required: false, nullable: true` in `@ApiProperty`
- Sensitive fields: `@ApiHideProperty()` + `@Exclude()`
- Named variants extend base — no field duplication
- `ResponseInterceptor` uses `plainToInstance(SerializationClass, data, { excludeExtraneousValues: true })` — fields without `@Expose()` are stripped

**Input DTOs** (`<name>.update.dto.ts`):
```typescript
export class UserUpdateDto {
    @ApiProperty({ example: faker.internet.email(), required: false })
    @IsEmail() @IsOptional()
    @Transform(({ value }) => value?.toLowerCase().trim())
    email?: string;

    @ApiProperty({ example: faker.person.firstName(), required: false })
    @IsString() @IsOptional() @MinLength(2) @MaxLength(50)
    @Transform(({ value }) => value?.trim())
    firstName?: string;
}
```

- Every field: class-validator decorator(s) + `@ApiProperty`
- Update DTOs: `@IsOptional()` first, then type validators
- String sanitization: `@Transform(({ value }) => value?.toLowerCase().trim())`
- `ValidationPipe` is global: `whitelist: true, forbidNonWhitelisted: true, transform: true`

## Response Envelope

All responses follow this shape (set by `ResponseInterceptor`):
```json
{ "statusCode": 200, "message": "User profile retrieved", "timestamp": "2026-01-01T00:00:00.000Z", "data": { ... } }
```

Error responses (from `ResponseExceptionFilter`):
```json
{ "statusCode": 404, "message": "User not found", "timestamp": "2026-01-01T00:00:00.000Z" }
```

`ApiGenericResponseDto` shape (for boolean success operations):
```json
{ "success": true, "message": "user.success.userDeleted" }
```

## i18n Keys

Language files: `src/languages/en/<domain>.json`

Structure:
```json
{
  "success": { "profile": "User profile retrieved", "updated": "User updated" },
  "error": { "userNotFound": "User not found", "userExists": "User already exists" }
}
```

- Services throw: `'user.error.userNotFound'`, `'auth.error.invalidPassword'`
- Controller `messageKey`: `'user.success.profile'`, `'auth.success.loggedIn'`
- `MessageService` resolves at response time — raw key returned if missing

## Prisma Schema Conventions

```prisma
model Post {
  id        String    @id @default(uuid())
  title     String
  authorId  String    @map("author_id")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  author    User      @relation(fields: [authorId], references: [id])

  @@map("posts")
}
```

- PK: `id String @id @default(uuid())`
- Standard timestamps on every model: `createdAt`, `updatedAt @updatedAt`, `deletedAt?` — all `@map("snake_case")`
- Field names: camelCase in schema, `@map("snake_case")` on every non-trivial field
- Table: `@@map("plural_snake_case")`
- Enums: define in schema, re-export from `src/common/database/enums/<name>.enum.ts` as `export { Role as UserRole } from '@prisma/client'`
- After any change: `npm run db:generate` then `npm run db:migrate`

## CacheService API

Inject via constructor: `constructor(private readonly cacheService: CacheService) {}`

```typescript
cacheService.get<T>(key)               // T | null; auto-JSON-deserialises
cacheService.set(key, value, ttlSec?)  // persist or with TTL
cacheService.del(...keys)              // delete one or more keys
cacheService.exists(key)               // boolean
cacheService.keys(pattern)             // glob match, avoid on large datasets
cacheService.hset(key, field, value)   // hash set
cacheService.hget<T>(key, field)       // T | null
cacheService.hgetall<T>(key)           // T | null
cacheService.hdel(key, ...fields)
cacheService.incr(key) / decr(key)    // atomic counter
cacheService.expire(key, ttlSec)
cacheService.ttl(key)                  // -1=no expiry, -2=missing
cacheService.flush()                   // flushdb — use with caution
cacheService.isHealthy()               // boolean
cacheService.getClient()               // raw ioredis client
```

## Cron Scheduler Pattern

```typescript
// src/workers/schedulers/midnight.scheduler.ts
@Injectable({ scope: Scope.DEFAULT })
export class MidNightScheduleWorker {
    private readonly logger = new Logger(MidNightScheduleWorker.name);

    @Cron('0 0 * * *')
    handleCron() {
        this.logger.log('Task to be run at 12 midnight');
    }
}
```

- Register in `src/workers/worker.module.ts` providers

## Testing Patterns

```typescript
// test/modules/user.service.spec.ts
const mockUserRepository = {
    findById: jest.fn(),
    existsById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
};

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: UserRepository, useValue: mockUserRepository },
            ],
        }).compile();
        service = module.get(UserService);
    });

    it('should be defined', () => expect(service).toBeDefined());

    describe('getProfile', () => {
        it('returns user when found', async () => {
            mockUserRepository.findById.mockResolvedValue({ id: '1', email: 'a@b.com' });
            await expect(service.getProfile('1')).resolves.toEqual({ id: '1', email: 'a@b.com' });
        });

        it('throws NOT_FOUND when user is missing', async () => {
            mockUserRepository.findById.mockResolvedValue(null);
            await expect(service.getProfile('1')).rejects.toThrow(HttpException);
        });
    });
});
```

Rules:
- Mock deps as plain objects `{ method: jest.fn() }` — never `jest.createMockFromModule`
- **Never** call `jest.clearAllMocks()` in `beforeEach` — `clearMocks: true` is global in `test/jest.json`
- `@faker-js/faker` is aliased to `test/mocks/faker.mock.ts` — deterministic values
- Use `src/` alias in imports — never `../../` relative paths
- Test location: `test/` mirrors `src/` (e.g. `test/modules/user.service.spec.ts`)
- Structure: `describe('ClassName') > describe('method') > it('should...')`
- Assertions: `resolves.toEqual(...)`, `rejects.toThrow(HttpException)`, `toHaveBeenCalledWith(...)`
- Every public method: happy path + error/guard throw + dependency propagation
- Coverage from: `*.service.ts`, `*.guard.ts`, `*.filter.ts`, `*.interceptor.ts`, `*.repository.ts`

## File Naming

Pattern: `<feature>.<type>.ts`. Dot = type delimiter. Kebab within segments.

| Feature-prefixed | Bare name |
|---|---|
| `auth.module.ts`, `user.service.ts` | `jwt-access.guard.ts`, `roles.guard.ts` |
| `auth.public.controller.ts`, `user.admin.controller.ts` | `public.decorator.ts`, `auth-user.decorator.ts` |
| `auth.login.dto.ts`, `user.update.dto.ts` | `jwt-access.strategy.ts`, `midnight.scheduler.ts` |
| `response.interceptor.ts`, `response.exception.filter.ts` | `health.controller.ts` |
| `cache.constant.ts`, `app.config.ts`, `request.interface.ts` | |

## Environment Variables

Required: `DATABASE_URL`, `REDIS_URL`, `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET`

Optional: `APP_ENV` (local/development/staging/production), `APP_NAME`, `APP_PORT`, `HTTP_HOST`, `AUTH_ACCESS_TOKEN_EXP`, `AUTH_REFRESH_TOKEN_EXP`, `SENTRY_DSN`, `APP_CORS_ORIGINS`, `APP_DEBUG`

Generate secrets: `openssl rand -base64 32`

## Docker

- `docker-compose.yml` — dev stage: source mounted at `/app`, node_modules pinned via anonymous volume
- `docker-entrypoint.sh` — runs `db:generate` + `db:migrate-prod` before app start
- Production: `docker build --target production` (not via Compose)
- `HTTP_HOST` must be `0.0.0.0` inside Docker

## Commit Convention

```
feat | fix | docs | style | refactor | perf | test | build | ci | chore | revert
```
Example: `feat(auth): add email verification flow`

---

## Claude Code Commands & Skills

| Command | Usage |
|---|---|
| `/gen-module post` | Scaffold complete feature module (8 files) |
| `/gen-prisma-model Post` | Add Prisma model + interface + repository + wire DatabaseModule |
| `/gen-endpoint GET /post/:id returns PostResponseDto` | Add one endpoint to existing controller |
| `/gen-test src/modules/post/services/post.service.ts` | Generate full Jest spec |
| `/debug UnknownExportException PostRepository in PostModule` | Diagnose DI/Prisma/auth/test errors |
| `/explain how the response interceptor works` | Explain any codebase part with file:line refs |
| `/review src/modules/post/services/post.service.ts` | Audit against full project checklist |
Skills: `/scaffold-feature`, `/quality-gate`, `/db-migrate`, `/security-audit`

## Common Pitfalls

1. Forgetting `@PublicRoute()` on auth/health routes — `JwtAccessGuard` blocks them
2. Editing `schema.prisma` without `npm run db:generate`
3. Reading `process.env` in services — use `ConfigService.getOrThrow`
4. Returning controller data without `@Expose()` on DTO fields — `ResponseInterceptor` strips them
5. `@AllowedRoles(UserRole.ADMIN)` without array — `RolesGuard` expects `UserRole[]`
6. Adding non-nullable Prisma field without default — `db:generate` passes but `tsc` fails
7. Calling `jest.clearAllMocks()` in `beforeEach` — redundant with global `clearMocks: true`
8. Returning raw Prisma entity with `passwordHash` — `@Exclude()` on DTO prevents this, don't skip it
9. Importing `CommonModule` in a feature module — it's `AppModule`-only; import `DatabaseModule` directly
