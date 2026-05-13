Scaffold a complete, ready-to-run feature end-to-end for: $ARGUMENTS

This is a multi-step workflow. Execute every step in order, pause only if a decision needs user input, and show progress as you go.

---

## Step 1 — Read codebase reference files
- `prisma/schema.prisma`
- `src/common/database/interfaces/user.interface.ts`
- `src/common/database/repositories/user.repository.ts`
- `src/modules/user/services/user.service.ts`
- `src/modules/user/controllers/user.public.controller.ts`
- `src/modules/user/user.module.ts`

---

## Step 2 — Prisma schema

Add the model to `prisma/schema.prisma` using the spec's **Prisma Model** section verbatim (adjust only if it violates schema conventions).

Conventions:
- `id String @id @default(uuid())`
- camelCase fields, `@map("snake_case")` on every field
- `createdAt`, `updatedAt @updatedAt`, `deletedAt?` — all with `@map`
- `@@map("plural_snake_case")`

Then run and verify:
```bash
npm run db:generate
```

---

## Step 3 — Data layer

Create in order:
1. `src/common/database/interfaces/<name>.interface.ts` — entity type alias + Create/Update input interfaces
2. `src/common/database/repositories/<name>.repository.ts` — `findById`, `existsById`, `create`, `update`, `softDelete`, `hardDeleteById`
3. Edit `src/common/database/database.module.ts` — add repository to `providers` and `exports`

---

## Step 4 — Feature module

Use the spec's **Endpoints** table to determine which methods go in the public vs admin controller.
Use the spec's **Business Rules** for service method logic.
Use the spec's **DTO Fields** for class-validator decorators.

Create in order:
1. `src/modules/<name>/dtos/<name>.dto.ts` — response DTOs (`@Expose`, `@ApiProperty(faker)` on every field)
2. `src/modules/<name>/dtos/<name>.create.dto.ts` — create input DTO
3. `src/modules/<name>/dtos/<name>.update.dto.ts` — update input DTO (all fields `@IsOptional()`)
4. `src/modules/<name>/services/<name>.service.ts` — service enforcing business rules from spec
5. `src/modules/<name>/controllers/<name>.public.controller.ts` — JWT endpoints from spec
6. `src/modules/<name>/controllers/<name>.admin.controller.ts` — ADMIN endpoints from spec
7. `src/modules/<name>/<name>.module.ts` — `imports: [DatabaseModule]`, exports service

Edit `src/app/app.module.ts` — import the new module.

---

## Step 5 — i18n

Create `src/languages/en/<name>.json` with all keys from the spec's **i18n Keys** section:
```json
{
  "success": {
    "get": "...",
    "created": "..."
  },
  "error": {
    "<name>NotFound": "..."
  }
}
```

---

## Step 6 — Tests

Generate `test/modules/<name>.service.spec.ts` using the spec's **Test Scenarios** section as the list of `it('should...')` blocks.

Rules:
- Mock every dependency as `{ method: jest.fn() }`
- Never call `jest.clearAllMocks()` (global in jest config)
- `resolves.toEqual(...)` for happy paths, `rejects.toThrow(HttpException)` for errors

Run and confirm passing:
```bash
npm test
```

---

## Step 7 — Quality gate

```bash
npm run lint
```

Fix any reported errors before continuing.

---

## Step 8 — Summary

Print a status table of every file created/updated.

Then list remaining manual steps:
- Migration: `npm run db:migrate -- --name add_<plural>_table`
- Any open business logic decisions
