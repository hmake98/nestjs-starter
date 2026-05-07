# CLAUDE.md

This file gives Claude Code the context needed to work effectively in this repository.

## Project Overview

NestJS 11 REST API starter. PostgreSQL via Prisma, Redis cache, BullMQ queues, JWT auth, Pino logging, Swagger docs, i18n, Sentry error tracking. Node 24, TypeScript 6.

## Claude Code Commands and Skills

### Commands — focused, single-task prompts (`.claude/commands/`)

| Command | Usage | What it does |
|---|---|---|
| `/gen-module` | `/gen-module post` | Scaffolds a complete feature module — service, public + admin controllers, DTOs, interface, repository, module file |
| `/gen-prisma-model` | `/gen-prisma-model Post` | Adds a Prisma model to the schema, creates the entity interface and repository, registers in DatabaseModule |
| `/gen-endpoint` | `/gen-endpoint GET /post/:id returns PostResponseDto` | Adds one endpoint to an existing controller with full decorator stack, updates the service, creates DTOs if needed |
| `/gen-test` | `/gen-test src/modules/post/services/post.service.ts` | Generates a full Jest spec following the project's mock and assertion conventions |
| `/debug` | `/debug UnknownExportException PostRepository in PostModule` | Diagnoses DI, Prisma, Docker, auth, and validation errors using project-specific knowledge |
| `/explain` | `/explain how the response interceptor works` | Explains any part of the codebase with file:line references and design rationale |
| `/review` | `/review src/modules/post/services/post.service.ts` | Audits a file against the full project checklist — module rules, service patterns, DTO conventions, test quality |

### Skills — multi-step orchestrated workflows (`.claude/skills/`)

| Skill | What it does |
|---|---|
| `scaffold-feature` | Full end-to-end feature: schema → generate → repository → module → tests → lint, in sequence |
| `quality-gate` | Lint → format → typecheck → tests with coverage → build → module integrity, fixes issues at each step |
| `db-migrate` | Safe schema change workflow: validate → generate → typecheck → update interfaces → create migration → run tests |
| `security-audit` | Auth bypass check, input validation audit, sensitive data exposure scan, dep vulnerability report |

## Development Commands

```bash
npm run docker:up          # start everything (Postgres + Redis + app with hot reload)
npm run docker:down        # stop all containers
npm run dev                # local watch mode (requires running Postgres + Redis)
npm run build              # compile to dist/
npm test                   # run tests with coverage
npm run lint:fix           # ESLint auto-fix
npm run format             # Prettier format
npm run db:generate        # generate Prisma client after schema changes
npm run db:migrate         # run migrations (dev)
npm run db:migrate-prod    # run migrations (production)
npm run seed:admin         # create default admin user
```

## Architecture

### Module Rules

- Feature modules (`AuthModule`, `UserModule`) import `DatabaseModule` directly for repository access — they **never** import each other.
- `CommonModule` aggregates infrastructure for `AppModule` only (database, cache, logger, request/response pipeline).
- Global providers are registered via `APP_GUARD` / `APP_INTERCEPTOR` / `APP_FILTER` tokens — do not use `useGlobalGuards()` etc. on the app instance.

### Guard Execution Order

Registered in `RequestModule` in this order: `ThrottlerGuard` → `JwtAccessGuard` → `RolesGuard`.

### Request / Response Pipeline

```
Request → ThrottlerGuard → JwtAccessGuard → RolesGuard → Controller
        → ResponseInterceptor (wraps success response)
        → ResponseExceptionFilter (catches all errors, logs 5xx, sends to Sentry)
```

### Key Directories

```
src/
├── app/config/         # Typed config factories — always use ConfigService.getOrThrow()
├── common/database/    # DatabaseService (Prisma), UserRepository
├── common/request/     # Guards, decorators (@PublicRoute, @AllowedRoles, @AuthUser)
├── common/response/    # Interceptor, filter, serializer, Sentry service
├── common/cache/       # CacheService wrapping ioredis
├── common/message/     # i18n message resolution via MessageService
├── modules/auth/       # Login, signup, refresh — uses DatabaseModule directly
├── modules/user/       # Profile CRUD — uses DatabaseModule directly
└── workers/            # Cron schedulers (WorkerModule)
```

## Coding Conventions

### NestJS Patterns

- Inject `ConfigService` and call `.getOrThrow<T>(key)` — never access `process.env` directly inside services or controllers.
- Use `@PublicRoute()` to exempt a route from JWT. Protected by default.
- Use `@AllowedRoles(UserRole.ADMIN)` for role-gating.
- Use `@AuthUser()` to extract the authenticated user from the request.
- Controllers return plain objects/entities — `ResponseInterceptor` wraps them into the standard envelope.
- Throw `HttpException` subclasses from services — `ResponseExceptionFilter` handles translation and formatting.

### Logging

- Use NestJS `Logger` (`private readonly logger = new Logger(ClassName.name)`) in services.
- Only log unexpected 5xx errors from services; pino-http handles all HTTP request/response logging automatically.
- Sensitive fields (passwords, tokens, card numbers) are redacted by the Pino config — do not add manual redaction.

### Database

- Prisma schema lives in `prisma/schema.prisma`. After any schema change: `npm run db:generate`.
- `DatabaseModule` provides both `DatabaseService` (Prisma client) and `UserRepository`. Import `DatabaseModule` in any module that needs either.
- Add new repositories to `DatabaseModule` providers and exports.

### DTOs and Validation

- All DTOs use `class-validator` decorators.
- `ValidationPipe` is global with `whitelist: true` and `forbidNonWhitelisted: true` — any extra property in the request body causes a 400.
- Response DTOs use `class-transformer` (`@Expose`, `@Exclude`) — `ResponseInterceptor` calls `classToPlain` during serialisation.

## Testing

Tests live in `test/` mirroring the `src/` structure. Framework is Jest + SWC.

```
test/
├── common/     # DatabaseService, MessageService, CacheService specs
├── modules/    # AuthService, UserService specs
└── mocks/      # faker.mock.ts (deterministic test data)
```

- `clearMocks: true` and `restoreMocks: true` are set globally — do **not** call `jest.clearAllMocks()` in `beforeEach`.
- Mock repository/service dependencies with plain objects (`{ methodName: jest.fn() }`), not `jest.createMockFromModule`.
- Coverage is collected from `*.service.ts`, `*.guard.ts`, `*.filter.ts`, `*.interceptor.ts`, `*.repository.ts`. Thresholds are enforced — check `test/jest.json` for current minimums.

## Docker

- `docker-compose.yml` always uses the `dev` Dockerfile stage with source mounted at `/app` and `node_modules` pinned via anonymous volume.
- `docker-entrypoint.sh` runs `db:generate` + `db:migrate-prod` before starting the app — safe for both dev and production stages.
- Production image is built directly via `docker build --target production` — not via Compose.
- `HTTP_HOST` must be `0.0.0.0` inside Docker (set in `docker-compose.yml`).

## Environment

Copy `.env.example` to `.env`. Required variables: `DATABASE_URL`, `REDIS_URL`, `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET`.

Generate JWT secrets with: `openssl rand -base64 32`

## Commit Convention

Conventional Commits enforced by commitlint + Husky:

```
feat | fix | docs | style | refactor | perf | test | build | ci | chore | revert
```

Example: `feat(auth): add email verification flow`
