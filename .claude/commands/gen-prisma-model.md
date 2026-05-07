Add a new Prisma model to this codebase: $ARGUMENTS

Read these files first:
- `prisma/schema.prisma` — existing schema conventions
- `src/common/database/database.module.ts` — where to register the new repository
- `src/common/database/interfaces/user.interface.ts` — interface pattern
- `src/common/database/repositories/user.repository.ts` — repository pattern

Follow these conventions from the existing schema:
- Field names in camelCase, mapped to snake_case with `@map("snake_case")`
- All models have: `id String @id @default(uuid())`, `createdAt`, `updatedAt @updatedAt`, `deletedAt DateTime?` for soft delete
- Table names use `@@map("plural_snake_case")`
- Enums defined in the schema and re-exported from `src/common/database/enums/`

Do all of the following:

1. **Add the model to `prisma/schema.prisma`** following the conventions above

2. **Create `src/common/database/interfaces/<name>.interface.ts`**
   ```ts
   import type { <Name> } from '@prisma/client';
   export type <Name>Entity = <Name>;
   export interface Create<Name>Input { ... }
   export interface Update<Name>Input { ... }
   ```

3. **Create `src/common/database/repositories/<name>.repository.ts`**
   - Standard methods: `findById`, `findAll` (with optional pagination), `existsById`, `create`, `update`, `softDelete`
   - `hardDeleteById` for test cleanup

4. **Update `src/common/database/database.module.ts`** — add the new repository to both `providers` and `exports`

5. **Run the migration command** after schema changes:
   ```bash
   npm run db:generate
   ```
   Then remind me to run:
   ```bash
   npm run db:migrate -- --name <descriptive_migration_name>
   ```

If any new enum is needed, also create `src/common/database/enums/<name>.enum.ts` re-exporting from `@prisma/client`.
