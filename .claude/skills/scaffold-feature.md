Scaffold a complete, ready-to-run feature end-to-end for: $ARGUMENTS

This is a multi-step workflow. Execute every step in order, pause only if a decision needs user input, and show progress as you go.

---

## Step 1 — Understand the domain

Read these files to understand existing conventions before writing a single line:
- `prisma/schema.prisma` — schema conventions (naming, soft-delete, timestamps)
- `src/common/database/interfaces/user.interface.ts` — interface pattern
- `src/common/database/repositories/user.repository.ts` — repository pattern
- `src/modules/user/services/user.service.ts` — service pattern
- `src/modules/user/controllers/user.public.controller.ts` — controller pattern
- `src/modules/user/user.module.ts` — module wiring pattern

From the feature name/description, infer:
- Prisma model fields (ask if ambiguous)
- Which operations need public endpoints vs admin-only endpoints
- Whether a soft-delete or hard-delete pattern applies

---

## Step 2 — Prisma schema

Add the model to `prisma/schema.prisma`:
- `id String @id @default(uuid())`
- `createdAt`, `updatedAt @updatedAt`, `deletedAt DateTime?`
- camelCase fields mapped to `@map("snake_case")`
- `@@map("plural_snake_case")` table name

Then run:
```bash
npm run db:generate
```

Verify it succeeds before continuing.

---

## Step 3 — Data layer

Create in order:
1. `src/common/database/interfaces/<name>.interface.ts` — entity type + Create/Update input interfaces
2. `src/common/database/repositories/<name>.repository.ts` — repository with findById, findAll, existsById, create, update, softDelete
3. Edit `src/common/database/database.module.ts` — add repository to `providers` and `exports`

---

## Step 4 — Feature module

Create in order:
1. `src/modules/<name>/dtos/<name>.dto.ts` — response DTOs with `@Expose`, `@ApiProperty(faker example)` on every field
2. `src/modules/<name>/dtos/<name>.create.dto.ts` — create input DTO
3. `src/modules/<name>/dtos/<name>.update.dto.ts` — update input DTO (all fields optional)
4. `src/modules/<name>/services/<name>.service.ts` — service with HttpException i18n keys
5. `src/modules/<name>/controllers/<name>.public.controller.ts` — authenticated user-facing endpoints
6. `src/modules/<name>/controllers/<name>.admin.controller.ts` — admin-only endpoints
7. `src/modules/<name>/<name>.module.ts` — imports DatabaseModule, declares controllers + service, exports service

Edit `src/app/app.module.ts` — import the new module.

---

## Step 5 — Tests

Generate a full unit test file at `test/modules/<name>.service.spec.ts`:
- Mock repository with `jest.fn()` for every method
- Happy path + error path for every service method
- No `jest.clearAllMocks()` (global in jest config)

Run tests to confirm they pass:
```bash
npm test
```

---

## Step 6 — Quality gate

Run lint and confirm zero errors:
```bash
npm run lint
```

---

## Step 7 — Summary

Print a summary table:

| File | Status |
|---|---|
| `prisma/schema.prisma` | ✅ added |
| `src/common/database/interfaces/<name>.interface.ts` | ✅ created |
| `src/common/database/repositories/<name>.repository.ts` | ✅ created |
| `src/common/database/database.module.ts` | ✅ updated |
| `src/modules/<name>/...` | ✅ created (N files) |
| `src/app/app.module.ts` | ✅ updated |
| `test/modules/<name>.service.spec.ts` | ✅ created |

Then list any manual follow-up tasks:
- Migration: `npm run db:migrate -- --name add_<name>_table`
- i18n keys to add
- Any business logic decisions left open
