---
applyTo: "docs/features/*.md"
---

# Feature Spec Writing Guide

Feature specs in `docs/features/` are the single source of truth for AI-assisted code generation.
When a spec exists, all AI tools (`/scaffold-feature`, `/gen-module`, Copilot `/scaffold-feature.prompt.md`)
read it before writing any code — nothing needs to be re-explained in the prompt.

## Template

Copy `docs/features/_template.md` → `docs/features/<name>.md`. Fill in every section.

## Section Rules

### Prisma Model
Write the exact schema block. Follow these conventions:
- `id String @id @default(uuid())`
- camelCase field names with `@map("snake_case")` on every field
- Always include `createdAt`, `updatedAt @updatedAt`, `deletedAt?` — all with `@map`
- Table name: `@@map("plural_snake_case")`

### Endpoints
Each row becomes one controller method. Auth column values:
- `PUBLIC` — no auth, add `@PublicRoute()` decorator
- `JWT` — requires Bearer token (default for protected routes)
- `ADMIN` — requires `@AllowedRoles([UserRole.ADMIN])`

ADMIN endpoints go in `<name>.admin.controller.ts` under `/admin/<name>`.
JWT/PUBLIC endpoints go in `<name>.public.controller.ts` under `/<name>`.

### Business Rules
These become the core logic inside service methods. Be specific:
- "User can only update their own records" → service checks `entity.userId === authUser.id`
- "Cannot publish without title set" → service validates before calling repository
- "Soft-delete only, never hard-delete" → service calls `softDelete` not `hardDeleteById`

### DTO Fields
Each row becomes one class-validator decorator + `@ApiProperty`. Be explicit about:
- `Required` — whether the field is mandatory in the Create DTO
- `Validation` — specific decorators: `MinLength(1)`, `MaxLength(200)`, `IsEmail()`, `IsEnum()`
- Update DTO inherits all Create fields but wraps each in `@IsOptional()`

### i18n Keys
Every `messageKey` used in a controller `@ApiEndpoint` and every string thrown in a service
`HttpException` must be listed here. They map to keys in `src/languages/en/<name>.json`.

Format: `<feature>.success.<action>` and `<feature>.error.<reason>`.

### Test Scenarios
Each unchecked item becomes an `it('should...')` block in `test/modules/<name>.service.spec.ts`.
Cover at minimum: happy path, not-found error, and any business rule enforcement.

### Open Questions
List decisions that are still unresolved. AI tools will stop and ask about these before generating.
Remove the section (or check all items) when resolved.

## Workflow

1. Write `docs/features/<name>.md` from the template
2. Resolve all Open Questions
3. Run `/scaffold-feature <name>` (Claude Code) or `/scaffold-feature.prompt.md` (Copilot Chat)
4. AI reads the spec, generates all files, runs tests and lint
5. Review the diff — the spec is the contract, the generated code is the implementation
