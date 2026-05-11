---
applyTo: "src/**/interfaces/*.interface.ts"
---

# Interface Conventions

## Database entity interfaces (`src/common/database/interfaces/`)

```typescript
import type { Post } from '@prisma/client';

// Entity is always a direct type alias from Prisma — never re-declared
export type PostEntity = Post;

// CreateInput: all fields required for creation (no id, createdAt, updatedAt, deletedAt)
export interface CreatePostInput {
    title: string;
    authorId: string;
    published?: boolean;
}

// UpdateInput: all fields optional
export interface UpdatePostInput {
    title?: string;
    published?: boolean;
}
```

## Request interfaces (`src/common/request/interfaces/`)

```typescript
// IAuthUser: what JwtAccessGuard puts on request.user
export interface IAuthUser {
    userId: string;
    role: UserRole;
}
```

## Response interfaces (`src/common/response/interfaces/`)

- Mirror the DTO shape for use in interceptors/filters.
- Use generics for data payloads (`IApiSuccessResponse<T>`).

## Rules

- Never use `any` — use `unknown` with type narrowing or a proper interface.
- No business logic in interface files — types and interfaces only.
- Import Prisma types with `import type { X } from '@prisma/client'` — always `type` import.
