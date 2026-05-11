---
applyTo: "src/**/config/*.config.ts"
---

# Config Factory Conventions

- Use `registerAs('namespace', () => ({ ... }))` — one namespace per file.
- `process.env` is **only** allowed inside config factories. Everywhere else use `ConfigService`.
- All factories are barrel-exported from `src/app/config/index.ts` and loaded via `ConfigModule.forRoot({ load: configs })`.
- Provide a default for non-critical values; leave secrets as `process.env.SECRET` (undefined if unset is acceptable for optional features).

```typescript
// src/app/config/redis.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
    url: process.env.REDIS_URL,
    ttl: Number(process.env.REDIS_TTL ?? 3600),
}));
```

- Consumers always: `this.configService.getOrThrow<string>('redis.url')` — dot-path mirrors the `registerAs` nesting.
- Add the new factory to the barrel in `src/app/config/index.ts`.
- Document required env vars in `.env.example`.
