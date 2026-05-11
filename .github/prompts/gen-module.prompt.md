Generate a complete NestJS feature module for: $input

---

## Step 0 — Feature spec (read this first)

Before anything else, check if `docs/features/$input.md` exists.

- **If it exists:** attach it with `#file:docs/features/$input.md` and treat it as the
  authoritative source for the model, endpoints, business rules, DTO fields, i18n keys,
  and test scenarios. Do not infer anything the spec already answers.
- **If it does not exist:** infer a minimal CRUD structure from the feature name and proceed.
  After generating, remind the developer to create `docs/features/$input.md` using the
  template at `docs/features/_template.md`.

If the spec has an **Open Questions** section with unchecked items — stop and list them.

---

## Step 1 — Reference files

Study these to match existing patterns exactly:

- `src/modules/user/user.module.ts`
- `src/modules/user/services/user.service.ts`
- `src/modules/user/controllers/user.public.controller.ts`
- `src/modules/user/controllers/user.admin.controller.ts`
- `src/modules/user/dtos/user.dto.ts`
- `src/modules/user/dtos/user.update.dto.ts`
- `src/common/database/repositories/user.repository.ts`
- `src/common/database/interfaces/user.interface.ts`

---

## Step 2 — Generate all 8 files

### 1. `src/common/database/interfaces/<name>.interface.ts`
- `export type <Name>Entity = <Name>` from `@prisma/client`
- `Create<Name>Input` and `Update<Name>Input` interfaces

### 2. `src/common/database/repositories/<name>.repository.ts`
- `@Injectable()` injecting `DatabaseService as db`
- Methods: `findById`, `existsById` (`findUnique({ select: { id: true } })`), `create`, `update`, `softDelete`, `hardDeleteById`
- Return types use `<Name>Entity`

### 3. `src/modules/<name>/dtos/<name>.dto.ts`
- `<Name>ResponseDto` with `@Expose()` + `@ApiProperty({ example: faker.* })` on every included field
- `@ApiHideProperty()` + `@Exclude()` on sensitive fields
- Named variants: `<Name>GetResponseDto extends <Name>ResponseDto`, etc.

### 4. `src/modules/<name>/dtos/<name>.create.dto.ts` + `<name>.update.dto.ts`
- class-validator decorators per spec DTO Fields section
- Update DTO: `@IsOptional()` first on every field

### 5. `src/modules/<name>/services/<name>.service.ts`
- Inject repository (not `DatabaseService`)
- `private readonly logger = new Logger(<Name>Service.name)`
- `private async assertExists(id)` using `existsById`
- Business rules from spec implemented here
- Errors: `throw new HttpException('<name>.error.key', HttpStatus.STATUS)`

### 6. `src/modules/<name>/controllers/<name>.public.controller.ts`
- JWT and PUBLIC endpoints from spec endpoints table
- `@ApiTags('public.<name>')`, `@ApiBearerAuth('accessToken')`
- `@Controller({ path: '/<name>', version: '1' })`
- `@ApiEndpoint({ summary, serialization, messageKey })` on every method

### 7. `src/modules/<name>/controllers/<name>.admin.controller.ts`
- ADMIN endpoints from spec endpoints table
- `@AllowedRoles([UserRole.ADMIN])` at class level
- `@Controller({ path: '/admin/<name>', version: '1' })`

### 8. `src/modules/<name>/<name>.module.ts`
- `imports: [DatabaseModule]`, `providers: [<Name>Service]`, `exports: [<Name>Service]`

---

## Step 3 — Post-generation

Tell me:
- Line to add repository to `src/common/database/database.module.ts` providers + exports
- Line to add module to `src/app/app.module.ts` imports
- Complete `src/languages/en/<name>.json` content (all keys from spec)
- Migration command: `npm run db:migrate -- --name add_<plural>_table`
