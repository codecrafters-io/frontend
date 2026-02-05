---
name: fix-lint
description: Run the frontend linter, analyze failures, and fix them iteratively. Use when linting fails, lint errors appear, or the user asks to fix lint issues in the frontend repo.
---

# Fix Linter Failures

## Steps

1. Run `bun run lint:fix`.
2. Review the output for failures.
3. Fix one issue at a time.
4. Re-run `bun run lint:fix` to confirm all issues are fixed.
5. If failures remain, repeat steps 3 and 4.
