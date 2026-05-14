<div align="center">

# NestJS Starter

**Clone. Configure. Ship.**

Everything you need to build a production API — auth, database, cache, queues, logging, and tests — already wired together so you can focus on what makes your product different.

[![CodeQL](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql)
&nbsp;
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
&nbsp;
![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
&nbsp;
![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat)

</div>

---

## What's included

```
Auth          JWT access + refresh tokens · argon2 hashing · RBAC
Database      PostgreSQL · Prisma 7 · pg Pool adapter (no binary engine)
Cache         Redis · ioredis · typed CacheService wrapper
Queues        BullMQ with shared Redis connection
Logging       Structured JSON via nestjs-pino · request correlation IDs
API Docs      Swagger / OpenAPI — dev and staging only
i18n          Multi-language support via nestjs-i18n
Validation    class-validator · whitelist · forbidNonWhitelisted
Rate Limiting Per-route throttling via @nestjs/throttler
Health        /health endpoint via @nestjs/terminus
Error Tracking Sentry integration for 5xx errors
Testing       Jest · SWC · 100% coverage enforced
Code Quality  ESLint · Prettier · Husky · Conventional Commits
Docker        Multi-stage image · hot reload in dev · minimal prod image
```

---

## Getting started

**Prerequisites:** Node.js ≥ 20, PostgreSQL, Redis

```bash
# 1. Clone and install
git clone https://github.com/hmake98/nestjs-starter.git
cd nestjs-starter && npm install

# 2. Configure
cp .env.example .env
# Fill in DATABASE_URL, REDIS_URL, and the two JWT secrets below

openssl rand -base64 32   # → AUTH_ACCESS_TOKEN_SECRET
openssl rand -base64 32   # → AUTH_REFRESH_TOKEN_SECRET

# 3. Database
npm run db:generate && npm run db:migrate

# 4. Run
npm run dev
# API  → http://localhost:3000
# Docs → http://localhost:3000/docs
```

---

## Project layout

```
src/
├── app/                  root module, health check
├── common/
│   ├── bullmq/           queue module
│   ├── cache/            Redis CacheService
│   ├── config/           typed config factories
│   ├── database/         DatabaseService, repositories
│   ├── doc/              @ApiEndpoint decorator
│   ├── logger/           Pino setup
│   ├── message/          i18n resolution
│   ├── request/          guards, decorators, throttler
│   └── response/         interceptor, filter, serializer
├── modules/
│   ├── auth/             login · signup · refresh
│   └── user/             profile · update · admin delete
├── workers/              cron schedulers
└── scripts/              CLI seed commands
prisma.config.ts          Prisma 7 config (auto-detected)
prisma/schema.prisma
```

**Dependency rules:** feature modules import `DatabaseModule` directly and never each other. `CommonModule` is only imported by `AppModule`.

---

## API

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/health` | public | Health check |
| `POST` | `/v1/auth/signup` | public | Register |
| `POST` | `/v1/auth/login` | public | Login — returns access + refresh tokens |
| `GET` | `/v1/auth/refresh-token` | refresh token | Renew token pair |
| `GET` | `/v1/user/profile` | JWT | Authenticated user's profile |
| `PUT` | `/v1/user` | JWT | Update own profile |
| `DELETE` | `/v1/admin/user/:id` | JWT + ADMIN | Soft-delete a user |

Swagger UI is available at `/docs` in non-production environments.

---

## Environment variables

| Variable | Required | Default | |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `REDIS_URL` | ✅ | — | Redis URL |
| `AUTH_ACCESS_TOKEN_SECRET` | ✅ | — | JWT signing secret |
| `AUTH_REFRESH_TOKEN_SECRET` | ✅ | — | JWT refresh secret |
| `APP_ENV` | | `local` | `local` · `development` · `staging` · `production` |
| `HTTP_PORT` | | `3000` | |
| `HTTP_HOST` | | `localhost` | Use `0.0.0.0` inside Docker |
| `AUTH_ACCESS_TOKEN_EXP` | | `1d` | |
| `AUTH_REFRESH_TOKEN_EXP` | | `7d` | |
| `SENTRY_DSN` | | — | Enables error tracking |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled app |
| `npm test` | Run tests with coverage |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:migrate-prod` | Run migrations (production) |
| `npm run seed:admin` | Create default admin user |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Format all source files |

---

## Docker

```bash
docker compose up                                    # dev — hot reload, source mounted
docker build --target production -t nestjs-starter . # prod — minimal image
```

The entrypoint runs `prisma generate` and `prisma migrate deploy` on startup. Set `HTTP_HOST=0.0.0.0` inside containers.

---

<div align="center">

[MIT License](LICENSE) · Built with [NestJS](https://nestjs.com)

</div>
