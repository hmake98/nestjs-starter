Add a new Prisma model and wire the data layer for: $input

Describe the model as: `<ModelName> with <field>:<type>, <field>:<type>, ...`
Example: `Post with title:String, content:String, authorId:String (FK to User), published:Boolean default false`

Study these reference files first:
- `prisma/schema.prisma`
- `src/common/database/database.module.ts`
- `src/common/database/interfaces/user.interface.ts`
- `src/common/database/repositories/user.repository.ts`

---

## Schema Conventions (apply exactly)

```prisma
model Post {
  id        String    @id @default(uuid())
  title     String
  authorId  String    @map("author_id")           // FK fields: camelCase → snake_case
  published Boolean   @default(false)
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  author User @relation(fields: [authorId], references: [id])

  @@map("posts")                                    // plural snake_case
}
```

**Rules:**
- PK: `id String @id @default(uuid())`
- Standard timestamps on every model: `createdAt`, `updatedAt @updatedAt`, `deletedAt?` — all with `@map("snake_case")`
- Every field: camelCase name, `@map("snake_case")` if it would differ
- Table: `@@map("plural_snake_case")`
- Enums: define in schema + create `src/common/database/enums/<name>.enum.ts` re-exporting from `@prisma/client`
- FK fields: `userId String @map("user_id")` with the `@relation` block on a separate line

---

## Ordered Steps — Execute in This Order

**Step 1 — Edit `prisma/schema.prisma`**
Add the model following the conventions above.

**Step 2 — Regenerate Prisma client**
```bash
npm run db:generate
```

**Step 3 — Create `src/common/database/interfaces/<name>.interface.ts`**
```typescript
import type { <Name> } from '@prisma/client';

export type <Name>Entity = <Name>;

export interface Create<Name>Input {
    // all required fields for creation (no id, createdAt, updatedAt, deletedAt)
}

export interface Update<Name>Input {
    // all fields optional
}
```

**Step 4 — Create `src/common/database/repositories/<name>.repository.ts`**
Standard method set:
- `findById(id)` → `<Name>Entity | null`
- `existsById(id)` → `boolean` via `findUnique({ select: { id: true } })`
- `create(data: Create<Name>Input)` → `<Name>Entity`
- `update(id, data: Update<Name>Input)` → `<Name>Entity`
- `softDelete(id)` → `<Name>Entity` (sets `deletedAt: new Date()`)
- `hardDeleteById(id)` → `void` (test cleanup only)

**Step 5 — Update `src/common/database/database.module.ts`**
Add `<Name>Repository` to both `providers` and `exports`.

**Step 6 — Run migration**
```bash
npm run db:migrate -- --name add_<plural_snake>_table
```

---

After completing all steps, confirm:
- The model is in `schema.prisma`
- The interface file has correct types
- The repository covers all standard methods
- `database.module.ts` exports the repository
- The migration command to run
