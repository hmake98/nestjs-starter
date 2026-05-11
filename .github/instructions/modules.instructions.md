---
applyTo: "src/**/*.module.ts"
---

# Module Wiring Conventions

- Feature modules (`AuthModule`, `UserModule`) import `DatabaseModule` directly — never import another feature module.
- `CommonModule` is only imported by `AppModule` — never by feature modules.
- `imports`: only `DatabaseModule` (and `JwtModule`/`PassportModule` if the module owns auth strategies).
- `providers`: only services and strategies owned by this module.
- `exports`: only what other modules explicitly need — do not export everything.
- New module must be added to `AppModule` imports in `src/app/app.module.ts`.
- New repository must be added to `DatabaseModule` providers and exports in `src/common/database/database.module.ts`.

```typescript
@Module({
    imports: [DatabaseModule],
    controllers: [PostPublicController, PostAdminController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
```
