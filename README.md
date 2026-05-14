# NestJS Starter

<div align="center">

[![CodeQL](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![Statements](https://img.shields.io/badge/statements-43.72%25-red.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-87.8%25-yellow.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-75.51%25-red.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-43.72%25-red.svg?style=flat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Production-ready NestJS boilerplate for building scalable REST APIs.**

</div>

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 20, TypeScript 6 |
| Framework | NestJS 11 |
| Database | PostgreSQL · Prisma 7 · `@prisma/adapter-pg` (no binary engine) |
| Cache / Queues | Redis · ioredis · BullMQ |
| Auth | JWT (access + refresh) · argon2 · RBAC |
| Logging | nestjs-pino (structured JSON) |
| API Docs | Swagger/OpenAPI (non-production only) |
| Testing | Jest · SWC · coverage thresholds |

---

## Quick Start

### Prerequisites

- Node.js ≥ 20, npm ≥ 10
- PostgreSQL and Redis

### 1. Clone & install

```bash
git clone https://github.com/hmake98/nestjs-starter.git
cd nestjs-starter
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

```bash
# Generate JWT secrets
openssl rand -base64 32   # AUTH_ACCESS_TOKEN_SECRET
openssl rand -base64 32   # AUTH_REFRESH_TOKEN_SECRET
```

### 3. Set up the database

```bash
npm run db:generate    # generate Prisma client
npm run db:migrate     # run migrations
npm run seed:admin     # optional: create default admin user
```

### 4. Run

```bash
npm run dev   # http://localhost:3000
              # Swagger: http://localhost:3000/docs
```

---

## Scripts

```bash
npm run dev              # start with hot reload
npm run build            # compile to dist/
npm start                # run compiled app
npm test                 # run tests with coverage

npm run db:generate      # prisma generate
npm run db:migrate       # prisma migrate dev
npm run db:migrate-prod  # prisma migrate deploy
npm run seed:admin       # create admin user
npm run remove:admin     # delete admin user

npm run lint:fix         # eslint --fix
npm run format           # prettier --write
```

---

## Project Structure

```
src/
├── app/              # Root module + health controller
├── common/
│   ├── bullmq/       # BullMQ module
│   ├── cache/        # Redis CacheService
│   ├── config/       # registerAs() config factories
│   ├── database/     # DatabaseService, repositories
│   ├── doc/          # @ApiEndpoint decorator
│   ├── logger/       # Pino logger
│   ├── message/      # i18n resolution
│   ├── request/      # Guards, auth decorators, throttler
│   └── response/     # Interceptor, exception filter, serializer
├── modules/
│   ├── auth/         # Login, signup, refresh token
│   └── user/         # Profile, update, admin delete
├── workers/          # Cron schedulers
└── scripts/          # CLI seed commands
prisma/
├── schema.prisma
└── migrations/
prisma.config.ts      # Prisma 7 config (auto-detected)
```

---

## API Endpoints

All routes versioned under `/v1` unless noted.

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Health check |
| `POST` | `/v1/auth/signup` | Public | Register |
| `POST` | `/v1/auth/login` | Public | Login → access + refresh tokens |
| `GET` | `/v1/auth/refresh-token` | Refresh JWT | Renew token pair |
| `GET` | `/v1/user/profile` | JWT | Get own profile |
| `PUT` | `/v1/user` | JWT | Update own profile |
| `DELETE` | `/v1/admin/user/:id` | JWT + ADMIN | Soft-delete user |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `REDIS_URL` | ✅ | — | Redis connection URL |
| `AUTH_ACCESS_TOKEN_SECRET` | ✅ | — | JWT access token secret |
| `AUTH_REFRESH_TOKEN_SECRET` | ✅ | — | JWT refresh token secret |
| `APP_ENV` | — | `local` | `local` / `development` / `staging` / `production` |
| `HTTP_PORT` | — | `3000` | HTTP port |
| `HTTP_HOST` | — | `localhost` | Bind address (`0.0.0.0` in Docker) |
| `AUTH_ACCESS_TOKEN_EXP` | — | `1d` | Access token expiry |
| `AUTH_REFRESH_TOKEN_EXP` | — | `7d` | Refresh token expiry |
| `SENTRY_DSN` | — | — | Sentry DSN for error tracking |

---

## Docker

```bash
# Development (hot reload)
docker compose up

# Production image
docker build --target production -t nestjs-starter .
```

> Set `HTTP_HOST=0.0.0.0` inside containers. The entrypoint runs `prisma generate` and `prisma migrate deploy` automatically.

---

## License

[MIT](LICENSE)
