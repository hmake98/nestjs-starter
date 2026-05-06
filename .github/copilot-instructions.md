# NestJS Starter - AI Coding Agent Instructions

## Architecture

A lean NestJS API with a clear layering:

- **Bootstrap** (`src/app/`): `AppModule`, env-driven `config/`, health controller, top-level enums.
- **Common Infrastructure** (`src/common/`): cross-cutting modules — `auth`, `cache`, `database`, `logger`, `message` (i18n), `request` (guards/decorators/middleware), `response` (interceptor/filter/DTOs), `doc` (Swagger decorators), `bullmq` (queue connection scaffolding).
- **Feature Modules** (`src/modules/`): business logic. Each module owns its `controllers/`, `services/`, and a flat `dtos/` folder with `*.dto.ts` files.
- **Workers** (`src/workers/`): cron schedulers. (No Bull processors are wired by default — register your own in `worker.module.ts`.)
- **Migration / CLI** (`src/migration/`, `src/cli.ts`): one-off `nestjs-command` tasks. `MigrationModule` aggregates all seed providers under `src/migration/seeds/`. Bootstrapped via a separate context so CLI runs don't pull in the HTTP stack.

Feature modules import `DatabaseModule` (and any other piece of `common/`) directly. They never import each other.

## Workflow

```bash
npm run dev               # hot-reload dev server
npm run build             # production build
npm test                  # Jest + SWC
npm run db:migrate        # apply migrations (dev)
npm run db:generate       # regenerate Prisma client after schema edits
npm run cli -- <command>  # run a nestjs-command task
npm run seed:admin        # create the default admin user (idempotent)
npm run remove:admin      # delete the default admin user (idempotent)
docker-compose up         # full stack (app, postgres, redis)
```

### Migration / CLI tasks
- Seed providers live in `src/migration/seeds/<entity>.seed.ts`. Each file exports an `@Injectable()` class whose methods are decorated with `@Command({ command, describe })` (from `nestjs-command`).
- Register the class in `src/migration/migration.module.ts` providers.
- Run with `npm run cli -- <command>`. Defaults are baked into the seed file as constants (no CLI args).
- Both **forward** (e.g. `seed:admin`) and **reverse** (e.g. `remove:admin`) commands should be **idempotent** so they can be re-run safely.

## Conventions

### Auth & guards
- Global guards (registered in `RequestModule` via `APP_GUARD`): `JwtAccessGuard`, `RolesGuard`, `ThrottlerGuard`.
- Public endpoints: `@PublicRoute()`.
- Role gating: `@AllowedRoles([Role.ADMIN])` (Prisma enum).
- Tokens are signed via `JwtService` inside `AuthService` using `auth.accessToken.*` and `auth.refreshToken.*` config keys. Passwords are hashed with `argon2`.

### Responses
Wrap controller methods with `@DocResponse({ serialization, httpStatus, messageKey })`. The global `ResponseInterceptor` translates `messageKey` via `MessageService` and shapes responses as:

```json
{ "statusCode": 200, "message": "...", "timestamp": "...", "data": ... }
```

`@DocGenericResponse({ httpStatus, messageKey })` is the equivalent for boolean-style success responses.

### Database
- Inject `DatabaseService` (extends `PrismaClient`) from `src/common/database/`.
- Soft-deletable models carry a `deletedAt` column — filter with `where: { deletedAt: null }`.

### API versioning
- URI versioning (`/v1/...`) is enabled in `main.ts`.
- Controllers declare `@Controller({ version: '1', path: '/...' })`.
- Naming: `*.public.controller.ts` for authenticated public APIs, `*.admin.controller.ts` for role-gated admin APIs.

### Background work
- `WorkerModule` boots `ScheduleModule.forRoot()` and registers cron classes. Add Bull processors here when needed.
- `BullMqModule` (under `src/common/bullmq/`) configures the global Bull connection from `redis.url`. Register feature queues with `BullModule.registerQueue({ name })` inside the consuming module.

### i18n
- JSON files in `src/languages/<lang>/`.
- Services return translation keys (e.g. `'user.error.userNotFound'`); the response interceptor and exception filter translate them via `MessageService`.

### File naming
Pattern: `<feature>.<type>.ts`. Use the **most specific identifier needed to be unambiguous in context** — i.e. include the module name only when the bare name would be too generic.

| Bare name is generic → prefix it | Bare name is descriptive → keep it bare |
|---|---|
| `auth.module.ts`, `user.service.ts`, `auth.public.controller.ts` | `jwt-access.guard.ts`, `roles.guard.ts`, `public.decorator.ts`, `auth-user.decorator.ts` |
| `response.interceptor.ts`, `response.exception.filter.ts`, `request.middleware.ts` | `jwt-access.strategy.ts`, `midnight.scheduler.ts`, `health.controller.ts` |
| `auth.login.dto.ts`, `user.update.dto.ts`, `doc.api-endpoint.decorator.ts` | |
| `cache.constant.ts`, `request.interface.ts`, `app.config.ts` | |

Within a segment, separate words with `-` (kebab). The dot is reserved as the type delimiter — i.e. `jwt-access.guard.ts`, **never** `jwt.access.guard.ts`. This matches what `nest g <type> <feature>` produces, so scaffolded files don't need renaming.

### Testing
- Specs mirror `src/` under `test/` (e.g. `test/modules/user.service.spec.ts`).
- `@faker-js/faker` is mocked via `test/mocks/faker.mock.ts`.
- SWC transform via `test/jest.json`.

## Common pitfalls

1. Forgetting `@PublicRoute()` on login/health routes — global `JwtAccessGuard` will block them.
2. Editing `prisma/schema.prisma` without rerunning `prisma:generate`.
3. Reading env vars via `process.env` — use `ConfigService.get` instead so config is centralised.
4. Returning a non-DTO from a controller annotated with `@DocResponse({ serialization })` — the interceptor `plainToInstance`s with `excludeExtraneousValues: true`, so unmarked fields drop out.
