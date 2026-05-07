Add a new API endpoint to an existing controller: $ARGUMENTS

Read these files first:
- `src/modules/user/controllers/user.public.controller.ts` — public endpoint pattern
- `src/modules/user/controllers/user.admin.controller.ts` — admin endpoint pattern
- `src/common/doc/decorators/doc.api-endpoint.decorator.ts` — @ApiEndpoint options
- `src/common/request/decorators/auth-user.decorator.ts` — @AuthUser usage
- `src/common/request/decorators/roles.decorator.ts` — @AllowedRoles usage
- `src/common/response/dtos/response.generic.dto.ts` — generic response shape

Determine from the arguments:
- Which controller file to modify
- HTTP method (GET / POST / PUT / PATCH / DELETE)
- Route path and params
- Whether it needs auth (`@ApiBearerAuth`), role restriction (`@AllowedRoles`), or is public (`@PublicRoute`)
- Request body DTO (create if it doesn't exist)
- Response DTO (create if it doesn't exist, extend the base response DTO)

For every new endpoint:

1. **Controller method** — add to the correct controller with:
   - `@ApiEndpoint({ summary: '...', serialization: ResponseDto, messageKey: '<domain>.success.<action>' })`
   - Correct HTTP decorator (`@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`)
   - `@Param`, `@Body`, `@Query` decorators as needed
   - `@AuthUser() user: IAuthUser` if it needs the authenticated user

2. **Service method** — add to the corresponding service:
   - Throws `HttpException` with i18n key and `HttpStatus` for all error cases
   - Returns the response DTO type
   - Uses `assertExists` private helper for existence pre-checks

3. **DTOs** — if new ones are needed:
   - Input DTOs: `class-validator` decorators + `@ApiProperty`
   - Response DTOs: extend base response DTO, `@Expose()` on each field

4. **i18n message key** — remind me to add the `messageKey` value to the translations file

After adding the endpoint also tell me: does the corresponding service method need a new repository method? If so, describe what it should look like following `src/common/database/repositories/user.repository.ts`.
