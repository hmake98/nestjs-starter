---
applyTo: "src/**/*.repository.ts"
---

# Repository Conventions

- `@Injectable()` class in `src/common/database/repositories/`.
- Inject `DatabaseService` as `private readonly db: DatabaseService`.
- Access Prisma via `this.db.<model>.*` — never import `PrismaClient` directly.
- Existence checks: `findUnique({ where: { id }, select: { id: true } })` — never `count` or `findFirst`.
- Soft delete: `update({ where: { id }, data: { deletedAt: new Date() } })`.
- Return types use `*Entity` interfaces from the interface file — not raw Prisma types with `as any`.
- `hardDeleteBy*` methods are for test cleanup only.
- Register in `src/common/database/database.module.ts` both `providers` and `exports`.
