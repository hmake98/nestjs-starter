# Feature: {FeatureName}

<!--
  HOW TO USE THIS TEMPLATE
  ──────────────────────────────────────────────────────────────────────────
  1. Copy this file → docs/features/<name>.md  (e.g. docs/features/post.md)
  2. Fill in every section. The more specific you are, the less the AI guesses.
  3. Run:  /scaffold-feature post        (Claude Code)
           /gen-module post              (Claude Code, faster — no tests/lint)
           /scaffold-feature in Copilot Chat with #file:docs/features/post.md
  ──────────────────────────────────────────────────────────────────────────
-->

## Overview

<!-- One paragraph: what this feature does, why it exists, who uses it. -->

## Prisma Model

<!--
  Write the exact schema block. Conventions enforced:
  - id String @id @default(uuid())
  - camelCase fields with @map("snake_case")
  - createdAt / updatedAt @updatedAt / deletedAt? always included
  - @@map("plural_snake_case")
-->

```prisma
model {FeatureName} {
  id        String    @id @default(uuid())

  # --- your fields here ---

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@map("{feature_names}")
}
```

## Endpoints

<!--
  Define every API endpoint.
  Auth column values: PUBLIC | JWT | ADMIN
  Status column: HTTP status code for success response
-->

| Method | Path | Auth | Status | Request Body | Response DTO | Description |
|--------|------|------|--------|--------------|--------------|-------------|
| GET | /v1/{feature}/:id | JWT | 200 | — | {Feature}GetResponseDto | Get by id |
| GET | /v1/{feature} | JWT | 200 | — | {Feature}GetResponseDto[] | List all (user-scoped) |
| POST | /v1/{feature} | JWT | 201 | Create{Feature}Dto | {Feature}CreateResponseDto | Create |
| PUT | /v1/{feature}/:id | JWT | 200 | Update{Feature}Dto | {Feature}UpdateResponseDto | Update |
| DELETE | /v1/admin/{feature}/:id | ADMIN | 200 | — | ApiGenericResponseDto | Hard/soft delete |

## Business Rules

<!--
  Rules the service layer must enforce. These become the core logic inside
  service methods — guards, ownership checks, state transitions, etc.
-->

- [ ] Rule 1 (e.g. "User can only update their own records")
- [ ] Rule 2 (e.g. "Cannot publish without required fields set")
- [ ] Rule 3

## DTO Fields

<!--
  Define every field in request DTOs. The AI uses this to write class-validator
  decorators and @ApiProperty examples. Omit if the Prisma model is self-evident.
-->

### Create{Feature}Dto

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| title | string | yes | MinLength(1), MaxLength(200) | |
| content | string | no | IsString | Markdown allowed |

### Update{Feature}Dto

<!-- All fields from Create are optional in the update DTO unless noted -->

| Field | Type | Override rule |
|-------|------|--------------|
| title | string | same as create |

## i18n Keys

<!--
  List every key the service throws and every controller messageKey.
  Add to src/languages/en/{feature}.json.
-->

**Success** (controller `messageKey` values):
- `{feature}.success.get`
- `{feature}.success.list`
- `{feature}.success.created`
- `{feature}.success.updated`
- `{feature}.success.deleted`

**Error** (service `HttpException` keys):
- `{feature}.error.{feature}NotFound` → 404
- `{feature}.error.unauthorized` → 403

## Test Scenarios

<!--
  List the test cases for the service spec. Each becomes an `it('should...')` block.
  The AI uses these to write test/modules/{feature}.service.spec.ts.
-->

- [ ] `get{Feature}`: returns entity when found
- [ ] `get{Feature}`: throws NOT_FOUND when missing
- [ ] `create{Feature}`: creates and returns new entity
- [ ] `create{Feature}`: throws CONFLICT when duplicate (if applicable)
- [ ] `update{Feature}`: updates and returns entity
- [ ] `update{Feature}`: throws NOT_FOUND when missing
- [ ] `delete{Feature}`: soft-deletes entity
- [ ] `delete{Feature}`: throws NOT_FOUND when missing

## Open Questions

<!--
  Unresolved decisions. The AI will pause and ask about these before generating.
  Remove this section when all questions are answered.
-->

- [ ] Question 1
