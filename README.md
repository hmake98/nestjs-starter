# NestJS Starter

<div align="center">

[![CodeQL](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen)
![Statements](https://img.shields.io/badge/statements-43.72%25-red.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-87.8%25-yellow.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-75.51%25-red.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-43.72%25-red.svg?style=flat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

<p align="center">
  A production-ready NestJS boilerplate for building scalable, enterprise-grade REST APIs.
</p>

---

## Features

| Category           | Details                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **Auth**           | JWT access + refresh tokens, Role-Based Access Control (RBAC)                               |
| **Database**       | PostgreSQL via Prisma ORM with connection pooling (`@prisma/adapter-pg`)                    |
| **Cache**          | Redis via ioredis with a typed `CacheService` wrapper                                       |
| **Queues**         | BullMQ for background job processing                                                        |
| **Logging**        | Structured JSON logging via Pino with request correlation IDs and sensitive-field redaction |
| **API Docs**       | Swagger/OpenAPI auto-generated from decorators (non-production only)                        |
| **i18n**           | Multi-language support via `nestjs-i18n`                                                    |
| **Validation**     | Class-validator with `ValidationPipe` (whitelist + forbidNonWhitelisted)                    |
| **Rate Limiting**  | Per-route throttling via `@nestjs/throttler`                                                |
| **Health Checks**  | `/health` endpoint via `@nestjs/terminus`                                                   |
| **Error Tracking** | Sentry integration for 5xx errors                                                           |
| **Testing**        | Jest + SWC with coverage thresholds                                                         |
| **Code Quality**   | ESLint, Prettier, Husky, commitlint (Conventional Commits)                                  |
| **Docker**         | Multi-stage Dockerfile with hot reload in dev, minimal production image                     |
| **AI Workflows**   | Full Claude Code + GitHub Copilot configuration — spec-driven feature scaffolding           |

---

## Tech Stack

- **Runtime**: Node.js 24, TypeScript 6
- **Framework**: NestJS 11
- **ORM**: Prisma 7 + PostgreSQL 16
- **Cache / Queues**: Redis 7, ioredis, BullMQ
- **Auth**: Passport.js, JWT (@nestjs/jwt), argon2
- **Logger**: nestjs-pino, pino-pretty
- **Testing**: Jest 30, SWC, Supertest

---

## Quick Start

### Prerequisites

- Node.js >= 24
- npm >= 11
- PostgreSQL and Redis (local or Docker)

### 1. Clone and install

```bash
git clone https://github.com/hmake98/nestjs-starter.git
cd nestjs-starter
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
# Edit .env — set DATABASE_URL, REDIS_URL, and JWT secrets
```

Generate JWT secrets:

```bash
openssl rand -base64 32   # run twice — one for access, one for refresh
```

### 3. Database setup

```bash
npm run db:generate     # generate Prisma client
npm run db:migrate      # run migrations
npm run seed:admin      # (optional) create default admin user
```

### 4. Start in development mode

```bash
npm run dev
```

API is available at `http://localhost:3000`. Swagger UI at `http://localhost:3000/docs`.

---

## Scripts

| Script                    | Description                                   |
| ------------------------- | --------------------------------------------- |
| `npm run dev`             | Start NestJS in watch mode                    |
| `npm run build`           | Compile TypeScript to `dist/`                 |
| `npm start`               | Run compiled app from `dist/`                 |
| `npm run db:generate`     | Generate Prisma client from schema            |
| `npm run db:migrate`      | Run migrations (development)                  |
| `npm run db:migrate-prod` | Run migrations (production/CI)                |
| `npm run seed:admin`      | Create the default admin user                 |
| `npm run remove:admin`    | Delete the default admin user                 |
| `npm run lint`            | Run ESLint                                    |
| `npm run lint:fix`        | Run ESLint with auto-fix                      |
| `npm run format`          | Format all source files with Prettier         |
| `npm test`                | Run all tests with coverage                   |

---

## Project Structure

```
src/
├── app/                        # Root module, config, health controller
│   ├── config/                 # Typed config factories (app, auth, redis, doc, seed)
│   ├── controllers/            # HealthController
│   └── enums/                  # APP_ENVIRONMENT
├── common/                     # Shared infrastructure
│   ├── bullmq/                 # BullMQ module (Redis-backed queues)
│   ├── cache/                  # Redis cache module + CacheService
│   ├── database/               # Prisma module, DatabaseService, repositories
│   ├── doc/                    # Swagger decorator helpers (@ApiEndpoint)
│   ├── logger/                 # Pino logger configuration
│   ├── message/                # i18n message resolution
│   ├── request/                # Guards, decorators, throttler
│   └── response/               # Interceptor, exception filter, serializer
├── modules/
│   ├── auth/                   # JWT auth — login, signup, refresh
│   └── user/                   # User CRUD — profile, update, delete
├── workers/                    # Cron schedulers
└── migration/                  # CLI seed commands
```

### Module dependency rules

- Feature modules (`AuthModule`, `UserModule`) import `DatabaseModule` directly — they never import each other.
- `CommonModule` aggregates infrastructure for `AppModule` only.
- Global providers (guards, interceptors, filters) are registered via `APP_GUARD` / `APP_INTERCEPTOR` / `APP_FILTER`.

---

## AI Developer Workflows

This project ships with full configuration for both Claude Code and GitHub Copilot. Both are set up so generated code matches project conventions on the first attempt — no extra prompting needed.

### Claude Code

Install: [claude.ai/code](https://claude.ai/code)

The CLAUDE.md file gives Claude Code complete project context. Claude reads it at the start of every session — no repo scanning required.

#### Commands

| Command | Example | What it does |
|---|---|---|
| `/scaffold-feature` | `/scaffold-feature post` | Full end-to-end feature from spec: schema → data layer → module → i18n → tests → lint |
| `/gen-module` | `/gen-module post` | Generate all 8 feature module files (no schema, no tests) |
| `/gen-prisma-model` | `/gen-prisma-model Post` | Add Prisma model + interface + repository + wire `DatabaseModule` |
| `/gen-endpoint` | `/gen-endpoint GET /post/:id returns PostResponseDto` | Add one endpoint with full decorator stack |
| `/gen-test` | `/gen-test src/modules/post/services/post.service.ts` | Generate full Jest spec following project conventions |
| `/debug` | `/debug UnknownExportException PostRepository` | Diagnose DI, Prisma, auth, and test errors |
| `/explain` | `/explain how the response interceptor works` | Explain any codebase part with file:line references |
| `/review` | `/review src/modules/post/services/post.service.ts` | Audit a file against the full project checklist |

#### Skills (multi-step workflows)

| Skill | What it does |
|---|---|
| `/scaffold-feature` | Schema → repository → module → i18n → tests → lint |
| `/quality-gate` | Lint → format → typecheck → tests → build — fixes issues at each step |
| `/db-migrate` | Validate schema → generate → typecheck → migrate → test |
| `/security-audit` | Auth bypass, input validation, data exposure, dependency vulnerability scan |

#### Hooks

A `PostToolUse` hook runs automatically after every file edit:
- **`.ts` files** — runs `eslint --fix` on the saved file
- **`schema.prisma`** — runs `npm run db:generate` automatically

#### Permissions

`.claude/settings.json` pre-approves safe read/run commands (`npm`, `npx`, `find`, `grep`, `git log/status/diff`) so Claude never pauses to ask for permission on routine operations.

---

### GitHub Copilot

The `.github/copilot-instructions.md` file is automatically attached to every Copilot Chat session. It contains the same depth of context as CLAUDE.md — real code examples, guard order, DTO patterns, error-throwing shape, testing conventions — so Copilot generates correct code without any extra explanation.

#### Scoped Instructions (auto-applied by file type)

These files in `.github/instructions/` are automatically applied when you edit matching files:

| File | Applies to |
|---|---|
| `services.instructions.md` | `src/**/*.service.ts` |
| `controllers.instructions.md` | `src/**/*.controller.ts` |
| `dtos.instructions.md` | `src/**/*.dto.ts` |
| `repositories.instructions.md` | `src/**/*.repository.ts` |
| `modules.instructions.md` | `src/**/*.module.ts` |
| `config.instructions.md` | `src/**/config/*.config.ts` |
| `interfaces.instructions.md` | `src/**/interfaces/*.interface.ts` |
| `prisma.instructions.md` | `prisma/schema.prisma` |
| `test.instructions.md` | `test/**/*.spec.ts` |

#### Prompt Files (Copilot Chat)

Type `/` in Copilot Chat to invoke these reusable prompts:

| Prompt | What it does |
|---|---|
| `/scaffold-feature` | End-to-end feature scaffold |
| `/gen-module` | Generate all 8 feature module files |
| `/gen-endpoint` | Add a single endpoint to an existing controller |
| `/gen-prisma-model` | Add a Prisma model and wire the data layer |
| `/gen-test` | Generate a Jest spec for a service file |
| `/review` | Audit a file against the full project checklist |
| `/debug` | Diagnose errors with project-specific knowledge |

> **Note:** Scoped instruction files and prompt files apply in Copilot Chat. The main `copilot-instructions.md` applies to both Chat and inline tab completions.

---

## API Endpoints

All routes are versioned (`/v1/...`) unless marked as version-neutral.

| Method   | Path                     | Auth        | Description                            |
| -------- | ------------------------ | ----------- | -------------------------------------- |
| `GET`    | `/health`                | Public      | Health check                           |
| `POST`   | `/v1/auth/signup`        | Public      | Register a new user                    |
| `POST`   | `/v1/auth/login`         | Public      | Login, returns access + refresh tokens |
| `GET`    | `/v1/auth/refresh-token` | Refresh JWT | Issue new token pair                   |
| `GET`    | `/v1/user/profile`       | JWT         | Get authenticated user profile         |
| `PUT`    | `/v1/user`               | JWT         | Update authenticated user profile      |
| `DELETE` | `/v1/admin/user/:id`     | JWT + ADMIN | Soft-delete a user                     |

Swagger UI is available at `/docs` in non-production environments.

---

## Authentication

Protected routes require a Bearer token:

```
Authorization: Bearer <access_token>
```

Role-based access is enforced via the `@AllowedRoles()` decorator (array required):

```ts
@AllowedRoles([UserRole.ADMIN])
@Delete(':id')
deleteUser(@Param('id') id: string) { ... }
```

Public routes bypass JWT entirely:

```ts
@PublicRoute()
@Post('login')
login(@Body() dto: UserLoginDto) { ... }
```

Guard execution order: `ThrottlerGuard` → `JwtAccessGuard` → `RolesGuard`

---

## Docker

The Dockerfile has three stages:

| Stage        | Purpose                                                                              |
| ------------ | ------------------------------------------------------------------------------------ |
| `dev`        | Hot reload — installs all deps, mounts source via volume, runs `nest start --watch`  |
| `builder`    | CI/production build — compiles TypeScript, prunes devDependencies                    |
| `production` | Minimal runtime image — only `dist/`, pruned `node_modules`, non-root user           |

`docker-compose.yml` uses the `dev` stage. For a deployable image: `docker build --target production`.

The entrypoint (`docker-entrypoint.sh`) runs `prisma generate` and `prisma migrate deploy` before the app starts.

Set `HTTP_HOST=0.0.0.0` inside Docker containers.

---

## Environment Variables

| Variable                    | Required | Default          | Description                                        |
| --------------------------- | -------- | ---------------- | -------------------------------------------------- |
| `APP_ENV`                   | No       | `local`          | `local` / `development` / `staging` / `production` |
| `APP_NAME`                  | No       | `nestjs-starter` | Application name (used in logs)                    |
| `APP_DEBUG`                 | No       | `false`          | Include stack traces in error responses            |
| `APP_LOG_LEVEL`             | No       | `info`           | Pino log level                                     |
| `HTTP_HOST`                 | No       | `localhost`      | Bind address (`0.0.0.0` in Docker)                 |
| `HTTP_PORT`                 | No       | `3000`           | HTTP port                                          |
| `DATABASE_URL`              | **Yes**  | —                | PostgreSQL connection string                       |
| `REDIS_URL`                 | **Yes**  | —                | Redis connection URL                               |
| `AUTH_ACCESS_TOKEN_SECRET`  | **Yes**  | —                | JWT access token signing secret                    |
| `AUTH_REFRESH_TOKEN_SECRET` | **Yes**  | —                | JWT refresh token signing secret                   |
| `AUTH_ACCESS_TOKEN_EXP`     | No       | `1d`             | Access token expiry                                |
| `AUTH_REFRESH_TOKEN_EXP`    | No       | `7d`             | Refresh token expiry                               |
| `SENTRY_DSN`                | No       | —                | Sentry DSN for error tracking                      |
| `SEED_ADMIN_EMAIL`          | No       | —                | Admin seed email                                   |
| `SEED_ADMIN_PASSWORD`       | No       | —                | Admin seed password                                |

---

## Testing

```bash
npm test                # run all tests with coverage report
```

Coverage is collected from services, guards, filters, interceptors, and repositories. Thresholds are enforced — the suite fails if coverage drops below the configured minimums.

Mock pattern used throughout:

```ts
const mockRepository = { findById: jest.fn(), existsById: jest.fn() };
// Never jest.createMockFromModule — plain objects only
// Never jest.clearAllMocks() — clearMocks: true is global in test/jest.json
```

---

## Commit Convention

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

Types: feat | fix | docs | style | refactor | perf | test | build | ci | chore | revert
```

Enforced by commitlint + Husky on every commit.

---

## License

[MIT](LICENSE)
