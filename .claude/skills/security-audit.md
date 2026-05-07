Run a security audit of the codebase and report all findings.

This is a multi-step workflow. Read each relevant file, check against the rules below, and produce a prioritised findings report.

---

## Step 1 — Authentication and authorisation

Read:
- `src/common/request/guards/jwt-access.guard.ts`
- `src/common/request/guards/roles.guard.ts`
- `src/modules/auth/services/auth.service.ts`
- `src/modules/auth/providers/jwt-access.strategy.ts`
- `src/modules/auth/providers/jwt-refresh.strategy.ts`
- All controllers in `src/modules/`

Check:
- Every controller method is either behind `JwtAccessGuard` (default) or explicitly marked `@PublicRoute()`
- No route accidentally bypasses auth via a missing decorator
- `@AllowedRoles` is used on all admin routes — no admin operation accessible to `MEMBER` role
- JWT secrets are read via `ConfigService.getOrThrow` — never hardcoded or read from `process.env` directly
- Refresh token strategy validates `tokenType === 'refresh'` in payload
- Password comparison uses `argon2.verify` — not `bcrypt` or plain equality

---

## Step 2 — Input validation

Read `src/main.ts` and all DTO files in `src/modules/`.

Check:
- `ValidationPipe` has `whitelist: true` and `forbidNonWhitelisted: true`
- Every controller `@Body()` parameter uses a typed DTO (not `any` or plain `object`)
- All DTO fields have appropriate `class-validator` decorators
- No raw `req.body` access bypassing the pipe
- `@Param('id')` on deletion/update routes — no missing param validation

---

## Step 3 — Sensitive data exposure

Read:
- All response DTOs in `src/modules/`
- `src/common/logger/services/logger.service.ts`
- `src/common/response/interceptors/response.interceptor.ts`

Check:
- `passwordHash` and any token fields are `@Exclude()` in all response DTOs
- Logger `redact.paths` covers: `authorization`, `cookie`, `password`, `token`, `refreshToken`, `accessToken`, `secret`, `apiKey`
- No service method returns a raw Prisma entity that includes `passwordHash`
- Error responses in non-debug mode do not leak stack traces

---

## Step 4 — Injection and common vulnerabilities

Grep through `src/` for:
```bash
# Raw SQL
grep -rn "queryRaw\|executeRaw\|\$queryRawUnsafe" src/
# Direct process.env
grep -rn "process\.env\." src/ --include="*.ts" | grep -v "main.ts\|prisma.config.ts\|*.config.ts"
# console.log leakage
grep -rn "console\.(log\|error\|warn\|debug)" src/
# Hardcoded secrets
grep -rn "secret.*=.*['\"].\{8,\}['\"]" src/
```

Investigate every hit.

---

## Step 5 — Dependencies

```bash
npm audit --audit-level=high
```

List all high/critical vulnerabilities with their package name and recommended fix.

---

## Step 6 — Report

Organise findings by severity:

### 🔴 Critical (must fix before shipping)
- Auth bypass, secret exposure, SQL injection, unvalidated input on destructive operations

### 🟠 High (fix soon)
- Missing role checks, sensitive data in logs/responses, outdated deps with known CVEs

### 🟡 Medium (address in next iteration)
- Missing input validation on non-destructive routes, minor data exposure

### 🟢 Informational
- Best-practice suggestions, hardening opportunities

For each finding: file path, line number, description, and recommended fix.
