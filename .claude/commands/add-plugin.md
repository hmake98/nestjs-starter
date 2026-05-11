Add the "$ARGUMENTS" support plugin to this NestJS project.

First, check whether `.claude/plugins/$ARGUMENTS.md` exists. If it does not, list the files in `.claude/plugins/` and tell the user which plugins are available, then stop.

If the spec exists, execute every step below in order. Never skip a step.

---

## Step 0 — Study the existing codebase patterns

Before writing a single line of code, read these reference files to understand the exact conventions used in this project:

- `src/app/config/app.config.ts` — config factory pattern
- `src/app/config/index.ts` — how configs are exported
- `src/common/cache/cache.module.ts` — module structure pattern
- `src/common/cache/services/cache.service.ts` — service pattern (Logger, Injectable, ConfigService)
- `src/common/common.module.ts` — how sub-modules are imported and exported
- `src/common/bullmq/bullmq.module.ts` — async module registration pattern

These are the patterns your generated code must match exactly — same import style, same decorator placement, same Logger usage, same file/folder naming.

---

## Step 1 — Read the plugin spec

Read `.claude/plugins/$ARGUMENTS.md` completely.

Extract:
- npm packages to install
- environment variables required (names + example values)
- files to create (paths, key implementation details)
- how to wire into `CommonModule`
- any special notes

---

## Step 2 — Conflict check

Before creating anything:
- Check whether `src/common/$ARGUMENTS/` already exists
- Check whether `src/app/config/$ARGUMENTS.config.ts` already exists
- Grep `.env.example` for any of the plugin's env var names

If anything already exists, tell the user what was found and skip re-creating those files.

---

## Step 3 — Install packages

Run the exact npm install command from the plugin spec. Wait for success before continuing.

---

## Step 4 — Config factory

Create `src/app/config/<plugin>.config.ts` following the pattern in `src/app/config/app.config.ts`:

```typescript
import { registerAs } from '@nestjs/config';

export const <plugin>Config = registerAs('<plugin>', () => ({
  // one key per env var, with a fallback default
  host: process.env.<PLUGIN>_HOST || 'localhost',
}));

export type <Plugin>Config = ReturnType<typeof <plugin>Config>;
```

Then add the export to `src/app/config/index.ts` — add it to the existing array in the same format as the other configs.

---

## Step 5 — Module and service files

Create all files listed in the plugin spec under `src/common/<plugin>/`. Follow these rules:

**Folder structure** (match `src/common/cache/` exactly):
```
src/common/<plugin>/
├── <plugin>.module.ts
├── services/
│   └── <plugin>.service.ts
└── interfaces/       (only if the plugin needs shared types)
    └── <plugin>.interface.ts
```

**Service rules** (match `src/common/cache/services/cache.service.ts`):
- `private readonly logger = new Logger(<ClassName>.name)` — always present
- Inject `ConfigService` and call `this.config.getOrThrow<Type>('plugin.key')` — never `process.env` directly
- Use `onModuleInit` / `onModuleDestroy` lifecycle hooks to open and close connections
- Log connection open/close at `info` level via `this.logger.log()`
- Expose clean, typed public methods that hide SDK internals

**Module rules** (match `src/common/cache/cache.module.ts`):
- Use `@Global()` only if the service is needed everywhere without explicit import
- Register config with `ConfigModule.forFeature(<plugin>Config)` inside the module if it is not global
- Export the service so `CommonModule` can re-export it

---

## Step 6 — Wire into CommonModule

Edit `src/common/common.module.ts`:
- Import the new `<Plugin>Module` at the top (maintain alphabetical order within the import group)
- Add it to the `imports` array
- Add it to the `exports` array

---

## Step 7 — Update .env.example

Append a block to `.env.example`:

```
# <Plugin display name>
<VAR_NAME>=<example_value>
```

One line per env var from the plugin spec.

---

## Step 8 — Typecheck

Run:
```bash
npx tsc --noEmit
```

Fix any type errors before continuing. Do not leave type errors unresolved.

---

## Step 9 — Summary

Print a table:

| File | Action |
|---|---|
| `src/app/config/<plugin>.config.ts` | created |
| `src/app/config/index.ts` | updated |
| `src/common/<plugin>/...` | created (N files) |
| `src/common/common.module.ts` | updated |
| `.env.example` | updated |

Then print two sections:

**Add to your `.env`:**
```
<VAR_NAME>=<real_value>
```

**Next steps:** any manual setup needed (e.g., running the service in Docker, generating proto files, creating cloud accounts).
