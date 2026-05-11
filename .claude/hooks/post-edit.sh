#!/bin/bash
# Runs after every Edit or Write tool call.
# Claude Code pipes the tool call JSON to stdin.
set -euo pipefail

# Write stdin to a temp file — tool_input can be large for Write operations
TMPFILE=$(mktemp /tmp/claude-hook-XXXXXX)
trap "rm -f $TMPFILE" EXIT
cat > "$TMPFILE"

# Extract file_path from tool_input using Node.js (always available in this project)
FILE=$(node -e "
try {
  const d = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'));
  process.stdout.write((d.tool_input && d.tool_input.file_path) || '');
} catch (e) {
  process.stdout.write('');
}
" "$TMPFILE" 2>/dev/null || echo "")

[[ -z "$FILE" ]] && exit 0

# ── TypeScript: auto-lint the modified file ───────────────────────────────────
if [[ "$FILE" == *.ts ]]; then
  npx eslint --fix "$FILE" --quiet 2>/dev/null || true
fi

# ── schema.prisma: auto-regenerate the Prisma client ─────────────────────────
if [[ "$FILE" == *schema.prisma ]]; then
  echo "[hook] schema.prisma changed — running db:generate..."
  npm run db:generate 2>&1 || true
fi
