Run a full quality gate across the codebase and fix every issue found.

This is a multi-step workflow. Run each step, analyse the output, fix all issues, then move to the next step. Do not proceed to the next step if the current one has errors.

---

## Step 1 — Lint

```bash
npm run lint
```

Fix every ESLint error. Common patterns in this repo:
- Import order violations → reorder imports (external → internal `src/` → relative)
- `@typescript-eslint/no-explicit-any` → replace with proper types from `express` or `@nestjs/common`
- `@typescript-eslint/no-redundant-type-constituents` → run `npm run db:generate` first (Prisma types may be stale)
- Unused imports → remove them

Re-run lint after fixes to confirm zero errors.

---

## Step 2 — Format

```bash
npm run format
```

This writes all formatting changes in-place. No output means everything was already formatted.

---

## Step 3 — Type-check

```bash
npx tsc --noEmit
```

Fix every TypeScript error before continuing. Common issues:
- Missing return type annotations on service methods
- Incorrect DTO field types not matching Prisma entity
- `unknown` used where a specific type is needed

---

## Step 4 — Tests with coverage

```bash
npm test
```

For any failing test:
1. Read the test file and the implementation it tests
2. Determine whether the test is wrong (implementation changed) or the implementation is wrong (regression)
3. Fix at the right layer

After all tests pass, check the coverage table printed to stdout:
- Any file at 0% that should have tests → note it
- Any file below the global thresholds in `test/jest.json` → note it

---

## Step 5 — Build

```bash
npm run build
```

A successful build confirms the compiled output is valid. Fix any compilation errors that were not caught by `tsc --noEmit` (rare but possible with decorators).

---

## Step 6 — Module integrity check

Read `src/app/app.module.ts` and trace every imported module. For each feature module check:
- It imports `DatabaseModule` (not another feature module) if it needs a repository
- It does not export `DatabaseModule` itself
- Its controllers are declared, its service is in providers and exports

Report any violations.

---

## Step 7 — Final report

Print a summary:

```
✅ Lint       — 0 errors
✅ Format     — all files formatted
✅ Types      — 0 errors
✅ Tests      — N passed, coverage: statements X%, branches X%, functions X%, lines X%
✅ Build      — compiled successfully
✅ Modules    — all dependency rules satisfied
```

List any issues that could not be auto-fixed and require manual attention.
