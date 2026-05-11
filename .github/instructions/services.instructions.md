---
applyTo: "src/**/*.service.ts"
---

# Service Conventions

- Inject repositories, not `DatabaseService` directly.
- Logger: `private readonly logger = new Logger(ClassName.name)`. Only call `this.logger.error(...)` for unexpected 5xx failures.
- Repeated existence checks: extract `private async assertExists(id: string): Promise<void>` using `existsById`.
- All errors: `throw new HttpException('domain.error.key', HttpStatus.STATUS)` — always an i18n key string, never a raw message.
- Config access: `this.configService.getOrThrow<string>('domain.nested.key')` — never `process.env`.
- Return typed response DTOs, not raw Prisma entities.
