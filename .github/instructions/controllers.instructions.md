---
applyTo: "src/**/*.controller.ts"
---

# Controller Conventions

- Class decorators: `@ApiTags('public.<name>')` or `@ApiTags('admin.<name>')`, `@ApiBearerAuth('accessToken')`, `@Controller({ path: '/<name>', version: '1' })`.
- Admin controllers add `@AllowedRoles([UserRole.ADMIN])` at class level (always an array).
- Every method must have `@ApiEndpoint({ summary, serialization, messageKey })`. No bare HTTP decorators without it.
- `httpStatus: HttpStatus.CREATED` for POST; omit for GET/PATCH/DELETE (defaults to 200).
- Controllers return the service result directly — no manual response shaping or wrapping.
- Add `@AuthUser() user: IAuthUser` only when the endpoint needs the requesting user's identity.
- Public routes that bypass JWT require `@PublicRoute()`.
