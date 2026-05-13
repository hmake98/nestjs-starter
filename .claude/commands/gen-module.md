Generate a complete NestJS feature module for: $ARGUMENTS

---

## Step 1 — Read codebase patterns

Study these files to match existing conventions exactly:
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

Use the reference files (Step 1) for structure, decorators, and patterns.

### 1. `src/common/database/interfaces/<name>.interface.ts`
- `export type <Name>Entity = <Name>` from `@prisma/client`
- `Create<Name>Input` and `Update<Name>Input` interfaces

### 2. `src/common/database/repositories/<name>.repository.ts`
- `@Injectable()` injecting `DatabaseService as db`
- Standard methods: `findById`, `existsById` (via `findUnique({ select: { id: true } })`), `create`, `update`, `softDelete`, `hardDeleteById`
- Return types use `<Name>Entity`

### 3. `src/modules/<name>/dtos/<name>.dto.ts` (response DTOs)
- `<Name>ResponseDto` with `@Expose()` + `@ApiProperty({ example: faker.* })` on every included field
- `@ApiHideProperty()` + `@Exclude()` on sensitive fields
- Named variants extending base: `<Name>GetResponseDto`, `<Name>CreateResponseDto`, `<Name>UpdateResponseDto`

### 4. `src/modules/<name>/dtos/<name>.create.dto.ts` + `<name>.update.dto.ts`
- class-validator decorators on every field per the spec's DTO Fields section
- Update DTO: all fields `@IsOptional()` first

### 5. `src/modules/<name>/services/<name>.service.ts`
- Inject repository (not `DatabaseService`)
- `private readonly logger = new Logger(<Name>Service.name)`
- `private async assertExists(id)` using `existsById`
- Business rules from spec implemented here
- All errors: `throw new HttpException('<name>.error.key', HttpStatus.STATUS)`

### 6. `src/modules/<name>/controllers/<name>.public.controller.ts`
- `@ApiTags('public.<name>')`, `@ApiBearerAuth('accessToken')`
- `@Controller({ path: '/<name>', version: '1' })`
- Only endpoints marked JWT or PUBLIC in the spec endpoints table
- Every method: `@ApiEndpoint({ summary, serialization, messageKey })`

### 7. `src/modules/<name>/controllers/<name>.admin.controller.ts`
- `@ApiTags('admin.<name>')`, `@ApiBearerAuth('accessToken')`, `@AllowedRoles([UserRole.ADMIN])` at class level
- `@Controller({ path: '/admin/<name>', version: '1' })`
- Only endpoints marked ADMIN in the spec endpoints table

### 8. `src/modules/<name>/<name>.module.ts`
- `imports: [DatabaseModule]`
- `providers: [<Name>Service]`
- `exports: [<Name>Service]`

---

## Step 3 — Post-generation checklist

After generating all files, tell me:
- Which line in `src/common/database/database.module.ts` to add the repository to `providers` and `exports`
- Which line in `src/app/app.module.ts` to add the new module to `imports`
- The complete `src/languages/en/<name>.json` file to create (all keys from the spec)
- Migration command: `npm run db:migrate -- --name add_<plural>_table`
