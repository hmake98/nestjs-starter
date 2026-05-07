Generate a complete NestJS feature module for: $ARGUMENTS

Scaffold the entire module following the exact patterns in this codebase. Study these files before generating anything:
- `src/modules/user/user.module.ts` — module structure
- `src/modules/user/services/user.service.ts` — service pattern
- `src/modules/user/controllers/user.public.controller.ts` — public controller pattern
- `src/modules/user/controllers/user.admin.controller.ts` — admin controller pattern
- `src/modules/user/dtos/user.dto.ts` — response DTO pattern
- `src/modules/user/dtos/user.update.dto.ts` — input DTO pattern
- `src/common/database/repositories/user.repository.ts` — repository pattern
- `src/common/database/interfaces/user.interface.ts` — entity interface pattern

Generate all of the following files for the new module:

1. **`src/modules/<name>/dtos/<name>.dto.ts`**
   - `<Name>ResponseDto` implementing the Prisma entity, using `@Expose()` on every field and `@Exclude()` on sensitive fields, `@ApiProperty` with faker examples on each field
   - Specific response DTOs extending the base (e.g. `<Name>GetResponseDto`, `<Name>CreateResponseDto`, `<Name>UpdateResponseDto`)

2. **`src/modules/<name>/dtos/<name>.create.dto.ts`** and **`<name>.update.dto.ts`**
   - Input DTOs with `class-validator` decorators and `@ApiProperty`
   - Update DTO has all fields optional

3. **`src/common/database/interfaces/<name>.interface.ts`**
   - `<Name>Entity` type aliased from the Prisma model (`import type { <Name> } from '@prisma/client'`)
   - `Create<Name>Input` interface
   - `Update<Name>Input` interface

4. **`src/common/database/repositories/<name>.repository.ts`**
   - `@Injectable()` class injecting `DatabaseService`
   - Standard methods: `findById`, `findAll`, `existsById`, `create`, `update`, `softDelete`
   - Use `this.db.<model>.*` Prisma calls
   - Return types use the entity interface

5. **`src/modules/<name>/services/<name>.service.ts`**
   - `@Injectable()` with repository injected
   - Each method throws `HttpException` with an i18n key string (e.g. `'<name>.error.<name>NotFound'`) and the appropriate `HttpStatus`
   - Returns typed response DTOs
   - Uses a private `assertExists(id)` helper for existence checks

6. **`src/modules/<name>/controllers/<name>.public.controller.ts`**
   - `@Controller({ path: '/<name>', version: '1' })`
   - `@ApiTags('public.<name>')` and `@ApiBearerAuth('accessToken')`
   - Each method decorated with `@ApiEndpoint({ summary, serialization, messageKey })`
   - Injects `@AuthUser() user: IAuthUser` for user-scoped endpoints

7. **`src/modules/<name>/controllers/<name>.admin.controller.ts`**
   - `@Controller({ path: '/admin/<name>', version: '1' })`
   - `@ApiTags('admin.<name>')`, `@ApiBearerAuth('accessToken')`, `@AllowedRoles([UserRole.ADMIN])` at class level
   - Admin-only operations (delete, bulk actions, etc.)

8. **`src/modules/<name>/<name>.module.ts`**
   - Imports `DatabaseModule`
   - Declares controllers and service
   - Exports the service

After generating all files, tell me:
- Which line in `src/common/database/database.module.ts` to add the new repository to `providers` and `exports`
- Which line in `src/app/app.module.ts` to import the new module
- Any i18n message keys that need adding
