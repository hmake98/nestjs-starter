---
applyTo: "src/**/*.dto.ts"
---

# DTO Conventions

## Response DTOs

- Class implements the entity interface (or `Omit<Entity, 'sensitiveField'>`).
- Every included field: `@Expose()` + `@ApiProperty({ example: faker.* })`.
- Sensitive fields (e.g. `passwordHash`, `deletedAt`): `@ApiHideProperty()` + `@Exclude()`.
- Named variants extend the base: `export class PostGetResponseDto extends PostResponseDto {}`.
- `ResponseInterceptor` calls `plainToInstance` with `excludeExtraneousValues: true` — fields without `@Expose()` are stripped.

## Request / Input DTOs

- Every field: class-validator decorator(s) first, then `@ApiProperty({ example: ... })`.
- Update DTOs: all fields `@IsOptional()` before their type validators.
- Enum fields: `@IsEnum(EnumClass)` + `@ApiProperty({ enum: EnumClass })`.
- `ValidationPipe` is global with `whitelist: true, forbidNonWhitelisted: true` — extra body fields cause 400.
- Never use `@Expose()` on input DTOs.
