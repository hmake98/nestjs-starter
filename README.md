# NestJS Starter

<div align="center">

[![CodeQL](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen)
![Statements](https://img.shields.io/badge/statements-45%25-orange.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-87%25-brightgreen.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-62%25-yellow.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-45%25-orange.svg?style=flat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

<p align="center">
  A production-ready NestJS boilerplate for building scalable, enterprise-grade REST APIs.
</p>

---

## Features

| Category | Details |
|---|---|
| **Auth** | JWT access + refresh tokens, Role-Based Access Control (RBAC) |
| **Database** | PostgreSQL via Prisma ORM with connection pooling (`@prisma/adapter-pg`) |
| **Cache** | Redis via ioredis with a typed `CacheService` wrapper |
| **Queues** | BullMQ for background job processing |
| **Logging** | Structured JSON logging via Pino with request correlation IDs and sensitive-field redaction |
| **API Docs** | Swagger/OpenAPI auto-generated from decorators |
| **i18n** | Multi-language support via `nestjs-i18n` |
| **Validation** | Class-validator with `ValidationPipe` (whitelist + forbidNonWhitelisted) |
| **Rate Limiting** | Per-route throttling via `@nestjs/throttler` |
| **Health Checks** | `/health` endpoint via `@nestjs/terminus` |
| **Error Tracking** | Sentry integration for 5xx errors |
| **Testing** | Jest + SWC with coverage thresholds |
| **Code Quality** | ESLint, Prettier, Husky, commitlint (Conventional Commits) |
| **Docker** | Multi-stage Dockerfile, single Docker Compose with hot reload |

---

## Tech Stack

- **Runtime**: Node.js 24, TypeScript 6
- **Framework**: NestJS 11
- **ORM**: Prisma 7 + PostgreSQL 16
- **Cache / Queues**: Redis 7, ioredis, BullMQ
- **Auth**: Passport.js, JWT (@nestjs/jwt)
- **Logger**: nestjs-pino, pino-pretty
- **Testing**: Jest 30, SWC, Supertest
- **Containerisation**: Docker, Docker Compose

---

## Quick Start

### Prerequisites

- Node.js >= 24
- npm >= 11
- Docker + Docker Compose

### 1. Clone and install

```bash
git clone https://github.com/hmake98/nestjs-starter.git
cd nestjs-starter
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
# Edit .env — set DATABASE_URL, REDIS_URL, JWT secrets
```

### 3. Start with Docker (recommended)

```bash
npm run docker:up
```

This starts PostgreSQL, Redis, and the NestJS app with **hot reload** enabled. File changes in `src/` are picked up instantly — no rebuild needed.

### 4. Start locally (without Docker)

Requires a running PostgreSQL and Redis instance.

```bash
npm run db:generate     # generate Prisma client
npm run db:migrate      # run migrations
npm run dev             # start with watch mode
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run docker:up` | Build and start all services with hot reload |
| `npm run docker:down` | Stop all services |
| `npm run dev` | Start NestJS in watch mode (local) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run db:generate` | Generate Prisma client from schema |
| `npm run db:migrate` | Run migrations (development) |
| `npm run db:migrate-prod` | Run migrations (production/CI) |
| `npm run seed:admin` | Create the default admin user |
| `npm run remove:admin` | Delete the default admin user |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format all source files with Prettier |
| `npm test` | Run all tests with coverage |

---

## Project Structure

```
src/
├── app/                        # Root module, config, health controller
│   ├── config/                 # Typed config (app, auth, redis, doc, seed)
│   ├── controllers/            # HealthController
│   └── enums/                  # APP_ENVIRONMENT
├── common/                     # Shared infrastructure
│   ├── bullmq/                 # BullMQ module (Redis-backed queues)
│   ├── cache/                  # Redis cache module + CacheService
│   ├── database/               # Prisma module, DatabaseService, UserRepository
│   ├── doc/                    # Swagger decorator helpers
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
- `CommonModule` aggregates infrastructure (database, cache, logger, request/response pipeline) for `AppModule`.
- Global providers (guards, interceptors, filters) are registered via `APP_GUARD` / `APP_INTERCEPTOR` / `APP_FILTER` in `RequestModule` and `ResponseModule`.

---

## API Endpoints

All routes are versioned (`/v1/...`) unless marked as version-neutral.

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Health check |
| `POST` | `/v1/auth/signup` | Public | Register a new user |
| `POST` | `/v1/auth/login` | Public | Login, returns access + refresh tokens |
| `GET` | `/v1/auth/refresh-token` | Refresh JWT | Issue new token pair |
| `GET` | `/v1/user/profile` | JWT | Get authenticated user profile |
| `PUT` | `/v1/user` | JWT | Update authenticated user profile |
| `DELETE` | `/v1/admin/user/:id` | JWT + ADMIN | Soft-delete a user |

Swagger UI is available at `/docs` in non-production environments.

---

## Authentication

Requests to protected routes require:

```
Authorization: Bearer <access_token>
```

Role-based access is enforced via the `@AllowedRoles()` decorator:

```ts
@AllowedRoles(UserRole.ADMIN)
@Delete(':id')
deleteUser(@Param('id') id: string) { ... }
```

Public routes bypass JWT entirely:

```ts
@PublicRoute()
@Post('login')
login(@Body() dto: UserLoginDto) { ... }
```

---

## Docker

The Dockerfile has three stages:

| Stage | Purpose |
|---|---|
| `dev` | Hot reload — installs all deps, mounts source via volume, runs `nest start --watch` |
| `builder` | CI/production build — compiles TypeScript, prunes devDependencies |
| `production` | Minimal runtime image — only `dist/`, pruned `node_modules`, non-root user |

`docker-compose.yml` always uses the `dev` stage. The `builder`/`production` stages are for producing a deployable image directly via `docker build`.

The entrypoint (`docker-entrypoint.sh`) runs `prisma generate` and `prisma migrate deploy` before handing off to the application process.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `APP_ENV` | No | `local` | `local` / `development` / `staging` / `production` |
| `APP_NAME` | No | `nestjs-starter` | Application name (used in logs) |
| `APP_DEBUG` | No | `false` | Include stack traces in error responses |
| `APP_LOG_LEVEL` | No | `info` | Pino log level |
| `HTTP_HOST` | No | `localhost` | Bind address (`0.0.0.0` in Docker) |
| `HTTP_PORT` | No | `3000` | HTTP port |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `REDIS_URL` | **Yes** | — | Redis connection URL |
| `AUTH_ACCESS_TOKEN_SECRET` | **Yes** | — | JWT access token signing secret |
| `AUTH_REFRESH_TOKEN_SECRET` | **Yes** | — | JWT refresh token signing secret |
| `AUTH_ACCESS_TOKEN_EXP` | No | `1d` | Access token expiry |
| `AUTH_REFRESH_TOKEN_EXP` | No | `7d` | Refresh token expiry |
| `SENTRY_DSN` | No | — | Sentry DSN for error tracking |
| `SEED_ADMIN_EMAIL` | No | — | Admin seed email |
| `SEED_ADMIN_PASSWORD` | No | — | Admin seed password |

---

## Testing

```bash
npm test                # run all tests with coverage report
npm run test:debug      # run with Node inspector attached
```

Coverage is collected from services, guards, filters, interceptors, and repositories. Thresholds are enforced — the suite fails if coverage drops below the configured minimums.

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
