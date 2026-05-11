Add a new API endpoint to this NestJS project: $input

Describe the endpoint as: `METHOD /path [request body DTO] returns ResponseDto`
Example: `POST /post creates PostCreateDto returns PostCreateResponseDto`
Example: `GET /post/:id returns PostGetResponseDto`

Study these reference files before generating:
- `src/modules/user/controllers/user.public.controller.ts`
- `src/modules/user/controllers/user.admin.controller.ts`
- `src/common/doc/decorators/doc.api-endpoint.decorator.ts`
- `src/common/request/decorators/auth-user.decorator.ts`
- `src/common/request/interfaces/request.interface.ts`
- `src/common/response/dtos/response.generic.dto.ts`

---

## Decision Rules

**Which controller?**
- Path contains `/admin/` → admin controller (`<name>.admin.controller.ts`)
- Otherwise → public controller (`<name>.public.controller.ts`)

**HTTP status:**
- `POST` (creating a resource) → `httpStatus: HttpStatus.CREATED`
- All others → omit `httpStatus` (defaults to `HttpStatus.OK`)

**Auth user:**
- Endpoint is user-scoped (e.g. "get my profile") → add `@AuthUser() user: IAuthUser` param
- Admin or resource-by-id without user context → omit

**Roles:**
- Admin controller already has `@AllowedRoles([UserRole.ADMIN])` at class level — do not add per-method unless a different role is needed

---

## Required Output

### Controller method (add to the appropriate controller)

```typescript
@Get(':id')
@ApiEndpoint({
    summary: 'Get post by id',
    serialization: PostGetResponseDto,
    messageKey: 'post.success.get',
})
getPost(
    @Param('id') id: string,
    @AuthUser() user: IAuthUser,
): Promise<PostGetResponseDto> {
    return this.postService.getPost(id, user.userId);
}
```

### Service method (add to `<name>.service.ts`)

- Use `this.assertExists(id)` if the operation targets an existing resource
- Throw `new HttpException('<name>.error.<key>', HttpStatus.STATUS)` for all error cases
- Return typed DTO

### DTOs (only if not already defined)

**Response DTO** — `@Expose()` on every field, `@ApiProperty({ example: faker.* })`, extend base response DTO if one exists.

**Input DTO** — class-validator decorator + `@ApiProperty` on every field.

### Reminder

Add the `messageKey` value (e.g. `post.success.get`) to `src/languages/en/<domain>.json` under the `success` key.
If a new service error key was introduced, add it under the `error` key too.
