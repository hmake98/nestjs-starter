---
applyTo: "prisma/schema.prisma"
---

# Prisma Schema Conventions

- PK: `id String @id @default(uuid())`
- Every model includes: `createdAt DateTime @default(now()) @map("created_at")`, `updatedAt DateTime @updatedAt @map("updated_at")`, `deletedAt DateTime? @map("deleted_at")`
- Field names: camelCase in schema, `@map("snake_case")` on every field that differs.
- Table name: `@@map("plural_snake_case")` on every model.
- FK fields: `userId String @map("user_id")` with the `@relation` block on a separate line.
- Enums: define in schema, re-export from `src/common/database/enums/<name>.enum.ts`.
- After any schema change: run `npm run db:generate` then `npm run db:migrate`.
