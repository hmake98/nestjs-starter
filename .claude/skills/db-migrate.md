Run a safe database migration workflow for: $ARGUMENTS

This is a multi-step workflow for making schema changes safely. Follow every step.

---

## Step 1 — Understand the change

Read `prisma/schema.prisma` and understand the current state. Then apply the requested change:
- New model → follow conventions: uuid PK, timestamps, soft-delete, snake_case mapping
- New field → check if nullable or has a default (required for existing rows)
- Rename/remove → flag as **destructive** and confirm with the user before proceeding
- New enum → add to schema and re-export from `src/common/database/enums/`

---

## Step 2 — Schema change

Edit `prisma/schema.prisma` with the change.

Validate the schema immediately:
```bash
npx prisma validate --config prisma/prisma.config.ts
```

Fix any validation errors before continuing.

---

## Step 3 — Generate client

```bash
npm run db:generate
```

This regenerates `@prisma/client` types. Confirm it succeeds.

---

## Step 4 — Type-check the codebase

```bash
npx tsc --noEmit
```

Schema changes often break existing code:
- New non-nullable field without default → `CreateInput` interfaces need updating
- Renamed field → find all usages with grep and update them
- Removed field → same

Fix all TypeScript errors introduced by the schema change.

---

## Step 5 — Update interfaces and repository

If a model was added or its shape changed, update:
- `src/common/database/interfaces/<name>.interface.ts` — `CreateInput` / `UpdateInput`
- `src/common/database/repositories/<name>.repository.ts` — any method that constructs data objects

---

## Step 6 — Create the migration

For development:
```bash
npm run db:migrate -- --name <descriptive_name>
```

Use snake_case for the name, describing what changed (e.g. `add_posts_table`, `add_published_at_to_posts`).

For production environments, migrations are applied automatically by `docker-entrypoint.sh` via `npm run db:migrate-prod`.

---

## Step 7 — Run tests

```bash
npm test
```

Schema changes can break tests if mocked return types no longer match the entity shape. Fix any broken tests.

---

## Step 8 — Summary

| Step | Result |
|---|---|
| Schema updated | ✅ |
| Prisma client regenerated | ✅ |
| TypeScript types valid | ✅ |
| Interfaces/repositories updated | ✅ |
| Migration created | ✅ `<timestamp>_<name>` |
| Tests passing | ✅ |

List any manual steps remaining (e.g. running the migration against a staging database).
