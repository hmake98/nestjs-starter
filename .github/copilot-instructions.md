# NestJS Starter — GitHub Copilot Instructions

Complete project context embedded below. Do not scan source files to re-derive what is already here.

## Stack

NestJS 11 · Prisma 7 + `@prisma/adapter-pg` (pg Pool, no binary engine) · PostgreSQL · Redis ioredis · BullMQ · JWT (passport-jwt + argon2) · nestjs-pino · nestjs-i18n · Sentry · Swagger (non-prod only) · TypeScript 6 · Node ≥20

## Directory Layout

```
src/
├── app/
│   ├── app.module.ts              root module
│   ├── config/                    registerAs() factories (index.ts barrel)
│   │   ├── app.config.ts          'app.*'
│   │   ├── auth.config.ts         'auth.accessToken.*' / 'auth.refreshToken.*'
│   │   ├── redis.config.ts        'redis.*'
│   │   ├── doc.config.ts          'doc.*'
│   │   └── seed.config.ts         'seed.admin.*'
│   ├── controllers/health.controller.ts
│   └── enums/app.enum.ts
├── common/
│   ├── common.module.ts           imports all infra; exports DatabaseModule + CacheModule only
│   ├── bullmq/bullmq.module.ts    shared BullMQ Redis connection
│   ├── cache/services/cache.service.ts
│   ├── database/
│   │   ├── database.module.ts     provides+exports DatabaseService, UserRepository
│   │   ├── services/database.service.ts
│   │   ├── repositories/user.repository.ts
│   │   ├── interfaces/user.interface.ts   UserEntity, CreateUserInput, UpdateUserInput
│   │   └── enums/role.enum.ts            re-exports Prisma Role as UserRole
│   ├── doc/decorators/
│   │   └── doc.api-endpoint.decorator.ts  @ApiEndpoint (only decorator for controller methods)
│   ├── request/
│   │   ├── request.module.ts      registers ThrottlerGuard → JwtAccessGuard → RolesGuard
│   │   ├── decorators/auth-user.decorator.ts    @AuthUser()
│   │   ├── decorators/public.decorator.ts       @PublicRoute()
│   │   ├── decorators/roles.decorator.ts        @AllowedRoles([...])
│   │   ├── guards/jwt-access.guard.ts
│   │   ├── guards/jwt-refresh.guard.ts
│   │   └── interfaces/request.interface.ts      IAuthUser = { userId, role }
│   └── response/
│       ├── dtos/response.success.dto.ts    ApiSuccessResponseDto<T>
│       ├── dtos/response.generic.dto.ts    ApiGenericResponseDto
│       ├── filters/response.exception.filter.ts
│       └── interceptors/response.interceptor.ts
├── modules/
│   ├── auth/                      public: login, signup, refresh
│   └── user/                      public: profile CRUD; admin: delete
└── workers/schedulers/            Cron schedulers (MidNightScheduleWorker)
```

## Module Wiring Rules

**AppModule** imports: `ConfigModule.forRoot({ load: configs, isGlobal: true })`, `TerminusModule`, `CommonModule`, `WorkerModule`, `AuthModule`, `UserModule`.

- Feature modules (`AuthModule`, `UserModule`) import `DatabaseModule` directly — never each other.
- `CommonModule` is only imported by `AppModule`.
- New feature module → import `DatabaseModule` + add to `AppModule` imports.
- New repository → add to `DatabaseModule` providers AND exports.

## Guard Order & Auth Decorators

Guards execute in this fixed order (all registered via `APP_GUARD` in `RequestModule`):
1. `ThrottlerGuard` — 10 req / 60s (config: `app.throttle.ttl`, `app.throttle.limit`)
2. `JwtAccessGuard` — JWT validation; bypassed when `@PublicRoute()` metadata present
3. `RolesGuard` — role check; no-op when `@AllowedRoles` metadata absent

```typescript
@PublicRoute()                    // bypass JWT entirely (login, signup, health)
@AllowedRoles([UserRole.ADMIN])  // array required — never spread
@AuthUser()                       // param decorator → IAuthUser = { userId: string, role: UserRole }
@UseGuards(JwtRefreshGuard)       // only on GET /v1/auth/refresh-token
```

**Existing route examples:**
- `POST /v1/auth/login` — `@PublicRoute()` at class level, no auth
- `GET /v1/auth/refresh-token` — `@UseGuards(JwtRefreshGuard)` + `@ApiBearerAuth('refreshToken')`
- `GET /v1/user/profile` — JWT-protected, `@AuthUser()` extracts user
- `DELETE /v1/admin/user/:id` — `@AllowedRoles([UserRole.ADMIN])` at class level
- `GET /health` — `VERSION_NEUTRAL`, `@PublicRoute()`

## Config Factory Pattern

```typescript
// src/app/config/auth.config.ts
export default registerAs('auth', () => ({
    accessToken: { secret: process.env.AUTH_ACCESS_TOKEN_SECRET, tokenExp: process.env.AUTH_ACCESS_TOKEN_EXP },
    refreshToken: { secret: process.env.AUTH_REFRESH_TOKEN_SECRET, tokenExp: process.env.AUTH_REFRESH_TOKEN_EXP },
}));

// In service — ALWAYS getOrThrow, NEVER process.env:
this.configService.getOrThrow<string>('auth.accessToken.secret')
this.configService.getOrThrow<string>('app.http.port')
```

`process.env` is read **only** inside config factories. Everywhere else: `ConfigService.getOrThrow<T>('dot.path')`.

## Repository Pattern

```typescript
@Injectable()
export class PostRepository {
    constructor(private readonly db: DatabaseService) {}

    findById(id: string): Promise<PostEntity | null> {
        return this.db.post.findUnique({ where: { id } });
    }

    async existsById(id: string): Promise<boolean> {
        const found = await this.db.post.findUnique({ where: { id }, select: { id: true } });
        return found !== null;                          // never count(), never findFirst()
    }

    create(data: CreatePostInput): Promise<PostEntity> {
        return this.db.post.create({ data });
    }

    update(id: string, data: UpdatePostInput): Promise<PostEntity> {
        return this.db.post.update({ where: { id }, data });
    }

    softDelete(id: string): Promise<PostEntity> {
        return this.db.post.update({ where: { id }, data: { deletedAt: new Date() } });
    }

    async hardDeleteById(id: string): Promise<void> {  // test cleanup only
        await this.db.post.delete({ where: { id } });
    }
}
```

## Service Pattern

```typescript
@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}
    // inject repositories — NOT DatabaseService directly

    async getProfile(userId: string): Promise<UserGetProfileResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpException('user.error.userNotFound', HttpStatus.NOT_FOUND);
        return user;  // typed DTO, not raw entity
    }

    async updateUser(userId: string, data: UserUpdateDto): Promise<UserUpdateProfileResponseDto> {
        await this.assertExists(userId);  // use helper for repeated checks
        return this.userRepository.update(userId, data);
    }

    async deleteUser(userId: string): Promise<ApiGenericResponseDto> {
        await this.assertExists(userId);
        await this.userRepository.softDelete(userId);
        return { success: true, message: 'user.success.userDeleted' };  // plain object, not new ApiGenericResponseDto()
    }

    private async assertExists(userId: string): Promise<void> {
        const exists = await this.userRepository.existsById(userId);
        if (!exists) throw new HttpException('user.error.userNotFound', HttpStatus.NOT_FOUND);
    }
}
```

Throw map: not-found → `HttpStatus.NOT_FOUND` · conflict → `HttpStatus.CONFLICT` · bad input → `HttpStatus.BAD_REQUEST` · unauthorized → `HttpStatus.UNAUTHORIZED` · forbidden → `HttpStatus.FORBIDDEN`

Logger: `private readonly logger = new Logger(ClassName.name)` — only `logger.error(...)` for unexpected 5xx.

## Controller Pattern

```typescript
@ApiTags('public.user')
@ApiBearerAuth('accessToken')
@Controller({ path: '/user', version: '1' })
export class UserPublicController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @ApiEndpoint({ summary: 'Get profile', serialization: UserGetProfileResponseDto, messageKey: 'user.success.profile' })
    getProfile(@AuthUser() user: IAuthUser): Promise<UserGetProfileResponseDto> {
        return this.userService.getProfile(user.userId);  // return directly, no wrapping
    }

    @Put()
    @ApiEndpoint({ summary: 'Update profile', serialization: UserUpdateProfileResponseDto, messageKey: 'user.success.updated' })
    updateUser(@AuthUser() user: IAuthUser, @Body() payload: UserUpdateDto): Promise<UserUpdateProfileResponseDto> {
        return this.userService.updateUser(user.userId, payload);
    }
}

@ApiTags('admin.user')
@ApiBearerAuth('accessToken')
@AllowedRoles([UserRole.ADMIN])           // always array
@Controller({ path: '/admin/user', version: '1' })
export class UserAdminController {
    @Delete(':id')
    @ApiEndpoint({ summary: 'Delete user', messageKey: 'user.success.deleted' })
    deleteUser(@Param('id') userId: string): Promise<ApiGenericResponseDto> {
        return this.userService.deleteUser(userId);
    }
}
```

**`@ApiEndpoint` options:**

| Option | Required | Notes |
|---|---|---|
| `summary` | Yes | Swagger operation summary |
| `messageKey` | Yes | i18n key resolved by ResponseInterceptor |
| `serialization` | No | DTO class; omit for `ApiGenericResponseDto` shape |
| `paginated` | No | `true` + `serialization` for paginated envelope |
| `httpStatus` | No | Default `HttpStatus.OK`; use `HttpStatus.CREATED` for POST |

## DTO Patterns

**Response DTOs:**
```typescript
export class UserResponseDto implements Omit<UserEntity, 'passwordHash'> {
    @ApiProperty({ example: faker.string.uuid() }) @Expose() @IsUUID() id: string;
    @ApiProperty({ example: faker.internet.email() }) @Expose() @IsEmail() email: string;
    @ApiProperty({ example: faker.person.firstName(), required: false, nullable: true })
    @Expose() @IsString() @IsOptional() firstName: string | null;
    @ApiProperty({ enum: UserRole, example: faker.helpers.arrayElement(Object.values(UserRole)) })
    @Expose() @IsEnum(UserRole) role: UserRole;
    @ApiProperty({ example: faker.date.past().toISOString() }) @Expose() @IsDate() createdAt: Date;

    @ApiHideProperty() @Exclude() passwordHash: string;  // sensitive: hide from Swagger + strip from response
}
export class UserGetProfileResponseDto extends UserResponseDto {}    // named variants extend base
export class UserUpdateProfileResponseDto extends UserResponseDto {}
```

- Every included field: `@Expose()` + `@ApiProperty({ example: faker.* })`
- Nullable/optional: `@ApiProperty({ required: false, nullable: true })`
- Sensitive fields: `@ApiHideProperty()` + `@Exclude()`
- `ResponseInterceptor` calls `plainToInstance(Dto, data, { excludeExtraneousValues: true })` — no `@Expose()` = stripped

**Input/Request DTOs:**
```typescript
export class UserUpdateDto {
    @ApiProperty({ example: faker.internet.email(), required: false })
    @IsEmail() @IsOptional()                          // @IsOptional() FIRST for update DTOs
    @Transform(({ value }) => value?.toLowerCase().trim())
    email?: string;

    @ApiProperty({ example: faker.person.firstName(), required: false })
    @IsString() @IsOptional() @MinLength(2) @MaxLength(50)
    @Transform(({ value }) => value?.trim())
    firstName?: string;
}
```

`ValidationPipe` global: `whitelist: true, forbidNonWhitelisted: true, transform: true` — extra body props = 400.

## Response Envelope

```json
{ "statusCode": 200, "message": "User profile retrieved", "timestamp": "2026-...", "data": { ... } }
{ "statusCode": 201, "message": "User created", "timestamp": "2026-...", "data": { ... } }
{ "statusCode": 404, "message": "User not found", "timestamp": "2026-..." }
```

`ApiGenericResponseDto` (no-serialization shape):
```json
{ "success": true, "message": "user.success.userDeleted" }
```

## i18n Keys

Files: `src/languages/en/<domain>.json`
```json
{ "success": { "profile": "User profile", "updated": "User updated" },
  "error": { "userNotFound": "User not found", "userExists": "User already exists" } }
```

- Services throw keys: `'user.error.userNotFound'`, `'auth.error.invalidPassword'`
- Controllers set: `messageKey: 'user.success.profile'`
- Every new throw key + every new controller messageKey needs a matching entry in the JSON file

## Prisma Schema Conventions

```prisma
model Post {
  id        String    @id @default(uuid())
  title     String
  authorId  String    @map("author_id")           // camelCase → @map("snake_case")
  published Boolean   @default(false)
  createdAt DateTime  @default(now()) @map("created_at")  // required on every model
  updatedAt DateTime  @updatedAt @map("updated_at")       // required on every model
  deletedAt DateTime? @map("deleted_at")                  // soft-delete, required on every model

  author    User      @relation(fields: [authorId], references: [id])

  @@map("posts")  // plural_snake_case
}
```

After any schema edit: `npm run db:generate` → `npm run db:migrate`

Enum re-export pattern: `export { Role as UserRole } from '@prisma/client'` in `src/common/database/enums/role.enum.ts`

## CacheService API

```typescript
// Inject: constructor(private readonly cacheService: CacheService) {}
await cacheService.get<T>(key)              // T | null, auto-JSON-parse
await cacheService.set(key, value, ttl?)    // ttl in seconds, optional
await cacheService.del(...keys)
await cacheService.exists(key)             // boolean
await cacheService.hset(key, field, value) / hget<T> / hgetall<T> / hdel
await cacheService.incr(key) / decr(key)   // atomic counter
await cacheService.expire(key, ttl)
await cacheService.ttl(key)                // -1=no expiry, -2=missing
cacheService.isHealthy()                   // boolean (sync)
cacheService.getClient()                   // raw ioredis Redis instance
```

## Testing Patterns

```typescript
// test/modules/post.service.spec.ts  (mirrors src/modules/post/services/post.service.ts)
const mockPostRepository = { findById: jest.fn(), existsById: jest.fn(), create: jest.fn() };
const mockConfigService = { getOrThrow: jest.fn((key: string) => ({ 'app.name': 'test' }[key])) };

describe('PostService', () => {
    let service: PostService;

    beforeEach(async () => {  // NEVER call jest.clearAllMocks() here — clearMocks: true is global
        const module = await Test.createTestingModule({
            providers: [
                PostService,
                { provide: PostRepository, useValue: mockPostRepository },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();
        service = module.get(PostService);
    });

    describe('getPost', () => {
        it('returns post when found', async () => {
            mockPostRepository.findById.mockResolvedValue({ id: '1', title: 'Test' });
            await expect(service.getPost('1')).resolves.toEqual({ id: '1', title: 'Test' });
        });
        it('throws NOT_FOUND when missing', async () => {
            mockPostRepository.findById.mockResolvedValue(null);
            await expect(service.getPost('1')).rejects.toThrow(HttpException);
        });
        it('propagates repository error', async () => {
            mockPostRepository.findById.mockRejectedValue(new Error('DB down'));
            await expect(service.getPost('1')).rejects.toThrow('DB down');
        });
    });
});
```

Rules:
- Plain object mocks `{ method: jest.fn() }` — never `jest.createMockFromModule`
- `clearMocks: true` + `restoreMocks: true` global in `test/jest.json` — no manual reset needed
- `@faker-js/faker` aliased to `test/mocks/faker.mock.ts` — deterministic
- `src/` alias in imports — never `../../` relative paths
- Coverage from: `*.service.ts`, `*.guard.ts`, `*.filter.ts`, `*.interceptor.ts`, `*.repository.ts`

## File Naming

Pattern: `<feature>.<type>.ts` — dot = type delimiter, kebab within segments.
Never: `jwt.access.guard.ts` ❌ → `jwt-access.guard.ts` ✅

| With feature prefix | Bare (already descriptive) |
|---|---|
| `auth.module.ts`, `user.service.ts` | `jwt-access.guard.ts`, `roles.guard.ts` |
| `auth.public.controller.ts` | `public.decorator.ts`, `auth-user.decorator.ts` |
| `auth.login.dto.ts`, `user.update.dto.ts` | `jwt-access.strategy.ts`, `midnight.scheduler.ts` |
| `cache.constant.ts`, `app.config.ts` | `health.controller.ts` |

## Dev Commands

```bash
npm run dev             # hot-reload watch
npm run build           # compile → dist/
npm test                # jest --coverage --runInBand
npm run lint:fix        # eslint --fix
npm run format          # prettier --write
npm run db:generate     # regenerate Prisma client
npm run db:migrate      # run migrations (dev)
npm run seed:admin      # create default admin user
```

Available prompts (Copilot Chat):
- `/scaffold-feature <name>` — end-to-end: schema → data layer → module → i18n → tests → lint
- `/gen-module <name>` — feature module only (no schema, no tests)
- `/gen-endpoint METHOD /path returns Dto` — single endpoint to existing controller
- `/gen-prisma-model <Name>` — schema block + interface + repository
- `/gen-test src/.../<file>.ts` — Jest spec for a service file
- `/review <file>` — audit against full project checklist
- `/debug <error>` — diagnose DI, Prisma, auth, validation errors

---

## Common Pitfalls

1. Forgetting `@PublicRoute()` on login/health — `JwtAccessGuard` blocks them.
2. Editing `schema.prisma` without `npm run db:generate`.
3. `process.env` in services — use `ConfigService.getOrThrow`.
4. No `@Expose()` on DTO field — `ResponseInterceptor` strips it.
5. `@AllowedRoles(UserRole.ADMIN)` without array — `RolesGuard` expects `UserRole[]`.
6. Non-nullable Prisma field without default — `db:generate` passes, `tsc` fails.
7. `jest.clearAllMocks()` in `beforeEach` — redundant with global `clearMocks: true`.
8. Returning Prisma entity without `@Exclude()` on `passwordHash` — leaks password hash.
9. Importing `CommonModule` in a feature module — import `DatabaseModule` directly instead.
10. Missing i18n JSON entry for a new error/success key — `MessageService` returns raw key as fallback.
