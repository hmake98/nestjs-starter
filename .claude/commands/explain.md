Explain how the following works in this NestJS codebase: $ARGUMENTS

Before answering, read the relevant source files so your explanation is grounded in actual code, not general NestJS knowledge.

Use this map to find the right files quickly:

| Topic | Files to read |
|---|---|
| Request lifecycle | `src/common/request/request.module.ts`, `src/common/request/guards/jwt-access.guard.ts`, `src/common/request/guards/roles.guard.ts`, `src/common/response/interceptors/response.interceptor.ts`, `src/common/response/filters/response.exception.filter.ts` |
| Auth flow | `src/modules/auth/services/auth.service.ts`, `src/modules/auth/providers/jwt-access.strategy.ts`, `src/modules/auth/providers/jwt-refresh.strategy.ts` |
| Module wiring | `src/app/app.module.ts`, `src/common/common.module.ts`, `src/common/database/database.module.ts` |
| Database / Prisma | `src/common/database/services/database.service.ts`, `prisma/schema.prisma`, `prisma/prisma.config.ts` |
| Response shaping | `src/common/response/interceptors/response.interceptor.ts`, `src/common/response/services/response.serializer.service.ts`, `src/common/response/dtos/response.success.dto.ts` |
| Error handling | `src/common/response/filters/response.exception.filter.ts`, `src/common/message/services/message.service.ts` |
| Caching | `src/common/cache/services/cache.service.ts`, `src/common/cache/cache.module.ts` |
| Logging | `src/common/logger/services/logger.service.ts`, `src/main.ts` |
| API docs | `src/common/doc/decorators/doc.api-endpoint.decorator.ts`, `src/swagger.ts` |
| Docker setup | `Dockerfile`, `docker-compose.yml`, `docker-entrypoint.sh` |
| Testing patterns | `test/modules/user.service.spec.ts`, `test/modules/auth.service.spec.ts`, `test/jest.json` |

Structure your explanation as:
1. **What it does** — one sentence summary
2. **How it works** — step-by-step with file:line references for each step
3. **Key design decisions** — why it's built this way (patterns, trade-offs)
4. **How to extend it** — what to change if someone wants to add to or modify this behaviour
