# Claude Code — Developer Guide

This directory contains the Claude Code configuration for the `nestjs-starter` project: commands, skills, and plugin specs that automate common development tasks inside a Claude Code session.

---

## How it works

| Type | Location | Invoked by | Purpose |
|---|---|---|---|
| **Command** | `.claude/commands/*.md` | `/command-name <args>` | Single-task code generation or analysis |
| **Skill** | `.claude/skills/*.md` | `/skill-name <args>` | Multi-step orchestrated workflows |

All generated code follows the exact conventions of the existing codebase — same folder structure, same Logger/ConfigService patterns, same decorator placement. The commands read reference files before generating anything.

---

## Commands

Single-purpose prompts that solve one problem at a time.

### `/gen-module <name>`

Scaffolds a complete feature module from scratch.

```
/gen-module post
/gen-module notification
```

**Generates:**
- `src/common/database/interfaces/<name>.interface.ts` — entity type + Create/Update input interfaces
- `src/common/database/repositories/<name>.repository.ts` — repository with standard CRUD methods
- `src/modules/<name>/dtos/<name>.dto.ts` — response DTO with `@Expose` and `@ApiProperty`
- `src/modules/<name>/dtos/<name>.create.dto.ts` — create input DTO
- `src/modules/<name>/dtos/<name>.update.dto.ts` — update input DTO (all fields optional)
- `src/modules/<name>/services/<name>.service.ts` — service with i18n error keys
- `src/modules/<name>/controllers/<name>.public.controller.ts` — authenticated user-facing endpoints
- `src/modules/<name>/controllers/<name>.admin.controller.ts` — admin-only endpoints
- `src/modules/<name>/<name>.module.ts` — module wiring

**Then tells you:** which lines to edit in `database.module.ts` and `app.module.ts`.

---

### `/gen-prisma-model <ModelName>`

Adds a Prisma model and wires it into the data layer.

```
/gen-prisma-model Post
/gen-prisma-model Comment
```

**Does:**
1. Adds model to `prisma/schema.prisma` (with `id`, `createdAt`, `updatedAt`, `deletedAt`, snake_case mapping)
2. Runs `npm run db:generate`
3. Creates the entity interface
4. Creates the repository
5. Registers it in `DatabaseModule`

---

### `/gen-endpoint <METHOD> <path> returns <Dto>`

Adds a single endpoint to an existing controller.

```
/gen-endpoint GET /post/:id returns PostResponseDto
/gen-endpoint POST /post creates PostResponseDto
/gen-endpoint DELETE /admin/post/:id returns void
```

**Does:** Adds the method with the full decorator stack (`@ApiEndpoint`, `@Get`/`@Post`/etc., `@Param`/`@Body`, `@AuthUser`), updates the service with the corresponding method, creates DTOs if they don't exist.

---

### `/gen-test <file-path>`

Generates a complete Jest unit test file for a service, guard, filter, or repository.

```
/gen-test src/modules/post/services/post.service.ts
/gen-test src/common/request/guards/jwt-access.guard.ts
```

**Follows project conventions:** mock dependencies with `{ methodName: jest.fn() }` objects, no `jest.clearAllMocks()` (set globally), happy path + error path for every public method.

---

### `/debug <error-or-description>`

Diagnoses errors using project-specific knowledge.

```
/debug UnknownExportException PostRepository in PostModule
/debug JWT strategy not picking up user from request
/debug Prisma migration fails with column already exists
```

Covers: NestJS DI errors, Prisma errors, Docker issues, JWT/auth failures, validation errors.

---

### `/explain <topic>`

Explains any part of the codebase with `file:line` references and design rationale.

```
/explain how the response interceptor works
/explain the guard execution order
/explain why CommonModule uses forwardRef
```

---

### `/review <file-path>`

Audits a file against the full project checklist.

```
/review src/modules/post/services/post.service.ts
/review src/common/database/repositories/post.repository.ts
```

Checks: module rules, service patterns, DTO conventions, guard usage, logging correctness, test coverage, security issues.

---

## Skills

Multi-step orchestrated workflows that run end-to-end.

### `scaffold-feature`

Full feature creation in one shot: Prisma schema → generate → repository → module → tests → lint.

```
/scaffold-feature Post with title, content, authorId, published flag
```

Steps: understand domain → add Prisma model → run `db:generate` → create data layer → create feature module → generate tests → run lint → print summary.

---

### `quality-gate`

Runs the full CI pipeline locally and fixes issues at each step.

```
/quality-gate
```

Steps: lint → format → typecheck → tests with coverage → build → module integrity check.

---

### `db-migrate`

Safe schema change workflow.

```
/db-migrate add publishedAt to Post
```

Steps: validate schema → generate → typecheck → update interfaces → create migration → run tests.

---

### `security-audit`

Security review of the codebase.

```
/security-audit
```

Checks: auth bypass risk, input validation gaps, sensitive data exposure, dependency vulnerabilities.

---

## Coding conventions enforced by all generators

- **Config**: `ConfigService.getOrThrow<T>('key')` — never `process.env` directly
- **Logger**: `private readonly logger = new Logger(ClassName.name)` in every service
- **Errors**: throw `HttpException` subclasses with i18n key strings (e.g. `'post.error.postNotFound'`)
- **Guards**: `@PublicRoute()` to bypass JWT, `@AllowedRoles(UserRole.ADMIN)` for role-gating
- **DTOs**: `@Expose()` on every response field, `class-validator` on every input field
- **Modules**: feature modules import `DatabaseModule` directly, never each other
- **Tests**: mock with `{ method: jest.fn() }` plain objects, no `jest.clearAllMocks()`
