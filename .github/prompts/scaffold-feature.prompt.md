Scaffold a complete end-to-end feature for: $input

Describe the feature as: `<ModelName> with <field>:<type>, <field>:<type>, ... [and FK to <OtherModel>]`
Example: `Post with title:String, content:String, authorId:String (FK to User), published:Boolean default false`

Read these files before starting — they are the canonical patterns for every step:
- `prisma/schema.prisma`
- `src/common/database/database.module.ts`
- `src/common/database/repositories/user.repository.ts`
- `src/common/database/interfaces/user.interface.ts`
- `src/modules/user/user.module.ts`
- `src/modules/user/services/user.service.ts`
- `src/modules/user/controllers/user.public.controller.ts`
- `src/modules/user/dtos/user.dto.ts`
- `test/modules/user.service.spec.ts`

---

## Step 1 — Prisma Schema

Add the model to `prisma/schema.prisma` following these conventions exactly:

```prisma
model Post {
  id        String    @id @default(uuid())
  title     String
  authorId  String    @map("author_id")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  author User @relation(fields: [authorId], references: [id])

  @@map("posts")
}
```

Rules: camelCase fields with `@map("snake_case")`; table `@@map("plural_snake_case")`; always include standard timestamps and `deletedAt?`.

Then run: `npm run db:generate`

---

## Step 2 — Data Layer (3 files)

**`src/common/database/interfaces/<name>.interface.ts`**
- `export type <Name>Entity = <Name>` from `@prisma/client`
- `Create<Name>Input` and `Update<Name>Input` interfaces

**`src/common/database/repositories/<name>.repository.ts`**
- `@Injectable()` injecting `DatabaseService as db`
- `findById`, `existsById` (via `findUnique({ select: { id: true } })`), `create`, `update`, `softDelete`, `hardDeleteById`

**Update `src/common/database/database.module.ts`**
- Add `<Name>Repository` to both `providers` and `exports`

---

## Step 3 — Feature Module (8 files)

**`src/modules/<name>/dtos/<name>.dto.ts`** (response DTOs)
- `<Name>ResponseDto` with `@Expose()` + `@ApiProperty({ example: faker.* })` on every field
- Sensitive fields: `@ApiHideProperty()` + `@Exclude()`
- Named variants: `<Name>GetResponseDto extends <Name>ResponseDto`, `<Name>CreateResponseDto`, `<Name>UpdateResponseDto`

**`src/modules/<name>/dtos/<name>.update.dto.ts`** (input DTOs)
- `Create<Name>Dto` with class-validator decorators
- `Update<Name>Dto` with all fields `@IsOptional()`

**`src/modules/<name>/services/<name>.service.ts`**
- Inject `<Name>Repository` (not `DatabaseService`)
- `private readonly logger = new Logger(<Name>Service.name)`
- `private async assertExists(id: string)` throws `new HttpException('<name>.error.<name>NotFound', HttpStatus.NOT_FOUND)`
- All errors: i18n key string + `HttpStatus` constant — never raw messages

**`src/modules/<name>/controllers/<name>.public.controller.ts`**
- `@ApiTags('public.<name>')`, `@ApiBearerAuth('accessToken')`
- `@Controller({ path: '/<name>', version: '1' })`
- Every method: `@ApiEndpoint({ summary, serialization, messageKey: '<name>.success.<action>' })`

**`src/modules/<name>/controllers/<name>.admin.controller.ts`**
- `@ApiTags('admin.<name>')`, `@ApiBearerAuth('accessToken')`, `@AllowedRoles([UserRole.ADMIN])` at class level
- `@Controller({ path: '/admin/<name>', version: '1' })`

**`src/modules/<name>/<name>.module.ts`**
- `imports: [DatabaseModule]`
- `providers: [<Name>Service]`
- `exports: [<Name>Service]`

**Update `src/app/app.module.ts`**
- Add `<Name>Module` to `imports`

---

## Step 4 — Tests

Generate `test/modules/<name>.service.spec.ts`:

- Mock every dependency as a plain object: `const mock<Name>Repository = { findById: jest.fn(), ... }`
- Provide via `{ provide: <Name>Repository, useValue: mock<Name>Repository }`
- Never call `jest.clearAllMocks()` — handled globally by `clearMocks: true` in `test/jest.json`
- Test structure: `describe('<Name>Service') > describe('<method>') > it('should...')`
- For every public method: happy path (`resolves.toEqual`), guard throw (`rejects.toThrow(HttpException)`), propagation
- Use `src/` path alias, not relative paths

---

## Step 5 — Lint

```bash
npm run lint:fix
npm run format
```

Note any remaining issues.

---

## Step 6 — Summary

Print a table of all files created/updated with their status.

Then list remaining manual steps:
- Migration command: `npm run db:migrate -- --name add_<plural_snake>_table`
- i18n keys to add to `src/languages/en/<name>.json`:
  - `success.*` keys used in controller `messageKey` values
  - `error.*` keys used in service throws
- Any business logic decisions left open (e.g. pagination, filtering, relations)
