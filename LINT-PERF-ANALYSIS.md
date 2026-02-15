# `bun run lint:fix` Performance Analysis

## How `lint:fix` works

```
lint:fix = concurrently(lint:css:fix, lint:hbs:fix, lint:js:fix, lint:glint:fix) && format
```

The first 4 tasks run in parallel, then `format` (prettier) runs sequentially after all finish.

## Benchmark Results

### Individual Command Timings (wall clock)

| Command | Cold Cache | Warm Cache | What it runs |
|---|---|---|---|
| `lint:css:fix` | 0.7s | 0.7s | `stylelint "**/*.css" --fix` (10 files) |
| `lint:hbs:fix` | 4.1s | 3.8s | `ember-template-lint . --fix` (1902 files) |
| `lint:js:fix` | **18.9s** | **1.4s** | `eslint . --cache --fix` (~1345 files) |
| `lint:glint:fix` | **12.2s** | **4.8s** | `glint --incremental` |
| `format` | **9.4s** | **4.2s** | `prettier . --cache --write` (1948 files) |

### Full `lint:fix` Timings

| Scenario | Wall Clock |
|---|---|
| Cold caches (first run) | **31.3s** |
| Warm caches (subsequent run) | **10.4s** |

### Critical Path Analysis

**Cold cache scenario (31.3s):**
- Concurrent phase bottleneck: `lint:js:fix` at 18.9s (eslint)
- Sequential phase: `format` at 9.4s (prettier)
- Total ≈ 18.9s + 9.4s + overhead ≈ 31.3s

**Warm cache scenario (10.4s):**
- Concurrent phase bottleneck: `lint:glint:fix` at 4.8s
- Sequential phase: `format` at 4.2s
- Total ≈ 4.8s + 4.2s + overhead ≈ 10.4s

## ESLint Deep Dive (the biggest bottleneck)

ESLint's `TIMING=1` output reveals the top rule costs (cold cache):

| Rule | Time (ms) | % of Total |
|---|---|---|
| **`import/namespace`** | **7,402** | **63.6%** |
| `import/order` | 369 | 3.2% |
| `import/no-duplicates` | 304 | 2.6% |
| `import/default` | 256 | 2.2% |
| `import/no-named-as-default-member` | 217 | 1.9% |
| `import/named` | 211 | 1.8% |
| `ember/no-implicit-injections` | 205 | 1.8% |
| `import/no-named-as-default` | 199 | 1.7% |
| `@typescript-eslint/no-unused-vars` | 194 | 1.7% |

**The `import/namespace` rule alone accounts for 7.4 seconds — 63.6% of ESLint's total time.**

The `import/*` module-resolution rules (`namespace`, `named`, `default`, `no-named-as-default`, `no-named-as-default-member`) collectively account for ~8.3 seconds.

### ESLint with import resolution rules disabled

Disabling just `import/namespace`: 18.9s → 12.2s (**-6.7s, -35%**)
Disabling all import resolution rules: 18.9s → 9.4s (**-9.5s, -50%**)

## Recommendations (ordered by impact)

### 1. Disable `import/namespace` in ESLint config — saves ~7s cold, biggest single win

The `import/namespace` rule validates that namespace imports (`import * as X`) only access existing exports. This is already caught by TypeScript/Glint, making it redundant. It comes from `importPlugin.flatConfigs.recommended` and can be turned off:

```js
// In eslint.config.mjs, add to "Override default rules":
'import/namespace': 'off',
```

**Impact: -7.4s on cold ESLint runs (63.6% of ESLint time)**

### 2. Disable other redundant `import/*` resolution rules — saves ~2s more

Rules like `import/named`, `import/default`, `import/no-named-as-default`, `import/no-named-as-default-member` all do module resolution that TypeScript/Glint already handles. Disabling them:

```js
'import/named': 'off',
'import/default': 'off',
'import/no-named-as-default': 'off',
'import/no-named-as-default-member': 'off',
```

**Impact: ~2s additional savings on cold runs**

### 3. Run `format` concurrently with linters — saves ~4-9s

Currently prettier runs *after* all linters complete. Since prettier reformats code independently of lint fixes, and eslint `--fix` + prettier are idempotent when run together, you could run prettier in the concurrent group. The only risk is if an eslint autofix conflicts with prettier formatting, but `eslint-config-prettier` already disables conflicting ESLint style rules.

```json
"lint:fix": "concurrently \"bun run lint:css:fix\" \"bun run lint:hbs:fix\" \"bun run lint:js:fix\" \"bun run lint:glint:fix\" \"bun run format\" --names \"fix:css,fix:hbs,fix:js,fix:glint,format\" --prefixColors auto"
```

**Impact: -4.2s warm / -9.4s cold (prettier no longer on critical path)**

### 4. Not worth optimizing

- **`lint:css:fix`** (0.7s) — already fast, only 10 CSS files
- **`lint:hbs:fix`** (3.8-4.1s) — processes 1902 files but isn't on the critical path in the concurrent group
- **`lint:glint:fix`** warm (4.8s) — already uses `--incremental`, and is the concurrent-phase bottleneck only in warm-cache scenario

## Projected Impact

| Optimization | Cold | Warm |
|---|---|---|
| Current | 31.3s | 10.4s |
| + Disable `import/namespace` | ~24s | ~10s |
| + Disable all import resolution rules | ~22s | ~10s |
| + Move prettier to concurrent | ~13s | ~6s |
| All combined | **~13s** | **~6s** |
