Generate a complete NestJS feature module for: $input

Study these reference files before generating anything:
- `src/modules/user/user.module.ts`
- `src/modules/user/services/user.service.ts`
- `src/modules/user/controllers/user.public.controller.ts`
- `src/modules/user/controllers/user.admin.controller.ts`
- `src/modules/user/dtos/user.dto.ts`
- `src/modules/user/dtos/user.update.dto.ts`
- `src/common/database/repositories/user.repository.ts`
- `src/common/database/interfaces/user.interface.ts`

---

Generate all 8 files below. Follow every constraint exactly — do not simplify or omit.

## 1. `src/common/database/interfaces/<name>.interface.ts`

- `export type <Name>Entity = <Name>` imported from `@prisma/client`
- `Create<Name>Input` interface with all required fields for creation
- `Update<Name>Input` interface with all fields optional

## 2. `src/common/database/repositories/<name>.repository.ts`

- `@Injectable()` class
- Inject `DatabaseService` as `private readonly db: DatabaseService`
- Access Prisma via `this.db.<model>.*`
- Standard methods: `findById`, `existsById`, `create`, `update`, `softDelete`, `hardDeleteById` (test cleanup)
- Existence checks: `findUnique({ where: { id }, select: { id: true } })` — never `count` or `findFirst`
- Soft delete: `update({ where: { id }, data: { deletedAt: new Date() } })`
- Return types use `<Name>Entity` from the interface file

## 3. `src/modules/<name>/dtos/<name>.dto.ts` (response DTOs)

- `<Name>ResponseDto` class implementing `Omit<<Name>Entity, 'deletedAt'>` (or full entity)
- Every included field: `@Expose()` + `@ApiProperty({ example: faker.* })`
- Sensitive fields (e.g. `passwordHash`): `@ApiHideProperty()` + `@Exclude()`
- Named variants extend the base: `<Name>GetResponseDto`, `<Name>CreateResponseDto`, `<Name>UpdateResponseDto`
- Import `@faker-js/faker` for examples

## 4. `src/modules/<name>/dtos/<name>.update.dto.ts` (input DTOs)

- `Create<Name>Dto` with class-validator decorators + `@ApiProperty` on every field
- `Update<Name>Dto` with all fields `@IsOptional()` then their type validators

## 5. `src/modules/<name>/services/<name>.service.ts`

- `@Injectable()` with `private readonly logger = new Logger(<Name>Service.name)`
- Inject the repository (not `DatabaseService` directly)
- `private async assertExists(id: string): Promise<void>` helper using `existsById`
- Every error: `throw new HttpException('<name>.error.<key>', HttpStatus.STATUS)`
- Never raw string messages — always i18n keys
- Return typed response DTOs

## 6. `src/modules/<name>/controllers/<name>.public.controller.ts`

- `@ApiTags('public.<name>')`, `@ApiBearerAuth('accessToken')`
- `@Controller({ path: '/<name>', version: '1' })`
- Every method: `@ApiEndpoint({ summary, serialization: <Name>XxxResponseDto, messageKey: '<name>.success.<action>' })`
- Add `@AuthUser() user: IAuthUser` to any method that needs the requesting user

## 7. `src/modules/<name>/controllers/<name>.admin.controller.ts`

- `@ApiTags('admin.<name>')`, `@ApiBearerAuth('accessToken')`, `@AllowedRoles([UserRole.ADMIN])` at **class** level
- `@Controller({ path: '/admin/<name>', version: '1' })`
- Admin operations (list all, delete, etc.)
- Same `@ApiEndpoint` requirement per method

## 8. `src/modules/<name>/<name>.module.ts`

- `imports: [DatabaseModule]`
- `controllers: [<Name>PublicController, <Name>AdminController]`
- `providers: [<Name>Service]`
- `exports: [<Name>Service]`

---

After generating all files, tell me:
- Which line in `src/common/database/database.module.ts` to add the new repository to `providers` and `exports`
- Which line in `src/app/app.module.ts` to add the new module to `imports`
- Which i18n keys to add to `src/languages/en/<name>.json` (list every key used in service throws and controller messageKeys)
