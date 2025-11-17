# NestJS Starter - AI Coding Agent Instructions

## Architecture Overview

This is a production-ready NestJS API with a modular architecture following clean separation of concerns:

- **Core Infrastructure** (`src/common/`): Shared services for database, auth, file storage, caching, logging, messaging
- **Feature Modules** (`src/modules/`): Business logic (User, Post) - each with controllers, services, DTOs
- **Background Workers** (`src/workers/`): Bull queue processors and schedulers for async tasks
- **MCP Integration** (`src/common/mcp/`): Model Context Protocol tools, resources, and prompts for AI capabilities

**Module Dependency Pattern**: Feature modules import `CommonModule` and specific helpers (e.g., `HelperModule`, `DatabaseModule`) but never import other feature modules directly. Cross-feature communication happens through services injected via module imports.

## Development Workflow

### Essential Commands
```bash
yarn dev                  # Start with hot reload (http://localhost:3001)
yarn build               # Production build
yarn test                # Run Jest tests with SWC
yarn migrate             # Apply Prisma migrations
yarn generate            # Generate Prisma client after schema changes
yarn seed:email          # Seed email templates via nestjs-command
docker-compose up        # Start full stack (app, postgres, redis)
```

### Docker Setup
Use `.env.docker` for containerized development. Services: `postgres` (5432), `redis` (6379), `server` (3001). The app waits for database health checks before starting.

## Project-Specific Conventions

### 1. Authentication & Authorization
- **Global Guards** (via `APP_GUARD` in `RequestModule`): `JwtAccessGuard`, `RolesGuard`, `ThrottlerGuard` apply to ALL routes
- **Public Routes**: Use `@PublicRoute()` decorator to bypass JWT authentication (e.g., login, health checks)
- **Role-Based Access**: Use `@Roles(Role.ADMIN, Role.DEVELOPER)` decorator from Prisma enums
- **Token Strategy**: Access tokens (15m) + refresh tokens (7d) via Passport strategies in `src/common/auth/providers/`

### 2. API Response Pattern
All controller methods use `@DocResponse()` decorator with:
- `serialization`: Response DTO class (auto-generates Swagger schema)
- `httpStatus`: HTTP status code
- `messageKey`: i18n key from `src/languages/en/` JSON files

**Example**:
```typescript
@DocResponse({
    serialization: UserGetProfileResponseDto,
    httpStatus: HttpStatus.OK,
    messageKey: 'user.success.profile',
})
```

Responses automatically wrap via `ResponseInterceptor` into:
```json
{
    "statusCode": 200,
    "message": "User profile fetched successfully",
    "timestamp": "2025-11-17T...",
    "data": { ... }
}
```

### 3. Database Patterns (Prisma)
- **Service**: Inject `DatabaseService` (wrapper around `PrismaClient`) from `src/common/database/`
- **Query Building**: Use `HelperPrismaQueryBuilderService` for complex pagination/filtering/sorting
  - Configure allowed fields: `allowedSortFields`, `allowedFilterFields`, `allowedSearchFields`
  - Returns `{ data, meta }` with pagination metadata
- **Soft Deletes**: Models have `deletedAt` field; always filter `where: { deletedAt: null }`
- **Migrations**: After schema changes, run `yarn generate && yarn migrate`

### 4. API Versioning & Structure
- **Versioning**: URI-based (`/v1/`, `/v2/`) via `VersioningType.URI` in `main.ts`
- **Controller Naming**:
  - `*.public.controller.ts` → Public API routes (requires auth unless `@PublicRoute()`)
  - `*.admin.controller.ts` → Admin-only routes (auto-applies role guards)
- **Swagger Tags**: Use format `public.resource` or `admin.resource` (e.g., `@ApiTags('public.user')`)

### 5. Background Jobs
- **Queue**: Bull with Redis (`APP_BULL_QUEUES` enum in `src/app/enums/app.enum.ts`)
- **Processors**: In `src/workers/processors/`, decorated with `@Process(APP_BULL_QUEUES.EMAIL)`
- **Scheduling**: Use `@nestjs/schedule` in `src/workers/schedulers/` with `@Cron()` decorators
- **Registration**: Import `BullModule.registerQueue()` in feature modules that enqueue jobs

### 6. File Upload (AWS S3)
- **Service**: `AwsS3Service` from `src/common/aws/` provides pre-signed URLs
- **Pattern**: Frontend uploads directly to S3, backend stores only the S3 key
- **Example**: `PostImage` model stores `key` field, related to Post via Prisma relation

### 7. Testing
- **Location**: Mirror `src/` structure in `test/` (e.g., `test/modules/post.service.spec.ts`)
- **Mocking**: Use `test/mocks/faker.mock.ts` for fake data generation
- **Config**: `test/jest.json` with SWC for fast compilation
- **Run**: `yarn test` (runs with `--runInBand --passWithNoTests --forceExit`)

### 8. Internationalization
- **Service**: `MessageService` translates via `nestjs-i18n`
- **Files**: JSON in `src/languages/en/` (e.g., `user.json`, `auth.json`)
- **Usage**: Return message keys in services, interceptor translates automatically
- **Headers**: Accept `accept-language` header for language selection

### 9. Model Context Protocol (MCP)
- **Location**: `src/common/mcp/` with separate services for tools, resources, prompts
- **Decorators**: Use `@MCPTool()`, `@MCPResource()`, `@MCPPrompt()` from `@hmake98/nestjs-mcp`
- **Config**: Auto-discovery enabled in `MCPCommonModule`
- **Playground**: `/mcp/playground` endpoint for testing AI integrations

## Critical File Locations

- **Config**: `src/common/config/*.config.ts` (app, auth, AWS, Redis, etc.)
- **Guards**: `src/common/request/guards/` (JWT, roles)
- **Decorators**: `src/common/doc/decorators/`, `src/common/request/decorators/`
- **Response DTOs**: Always in `dtos/response/` within feature modules
- **Request DTOs**: Always in `dtos/request/` within feature modules
- **Prisma Schema**: `prisma/schema.prisma` (PostgreSQL with snake_case DB columns)

## Common Pitfalls

1. **Missing @PublicRoute()**: All routes require auth by default due to global `JwtAccessGuard`
2. **Forgot Prisma Generate**: After schema changes, always run `yarn generate` before `yarn migrate`
3. **Response Serialization**: Controller methods must return DTOs matching `@DocResponse()` serialization class
4. **Module Imports**: Feature modules must import `DatabaseModule` or `HelperModule` explicitly
5. **Environment Variables**: Use `ConfigService.get()`, never `process.env` directly
6. **Enum Usage**: Import Prisma-generated enums (`Role`, `PostStatus`) from `@prisma/client`

## Key Dependencies

- **Framework**: NestJS 11.x (decorators, DI, modules)
- **ORM**: Prisma 6.x (PostgreSQL)
- **Queue**: Bull 4.x + Redis (background jobs)
- **Auth**: Passport JWT strategies (access/refresh)
- **Validation**: class-validator, class-transformer (auto-applied via global pipe)
- **Logging**: Pino (structured JSON logs)
- **API Docs**: Swagger/OpenAPI (auto-generated at `/docs`)
