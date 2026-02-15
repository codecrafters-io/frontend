# `bun run lint:fix` Benchmark Results

**Date:** 2026-02-15
**Environment:** Cloud VM (linux 6.1.147)

## How `lint:fix` works

```
lint:fix = concurrently(lint:css:fix, lint:hbs:fix, lint:js:fix, lint:glint:fix) && format
```

The first four run in parallel via `concurrently`, then `format` (prettier) runs sequentially after all four complete.

## Individual Timings

| Command | Tool | Time (cold) | Time (warm/cached) | % of wall clock |
|---------|------|------------|-------------------|-----------------|
| `lint:css:fix` | stylelint | **0.6s** | — | ~2% |
| `lint:hbs:fix` | ember-template-lint | **3.9s** | — | ~13% |
| `lint:js:fix` | eslint (no cache) | **18.7s** | **1.4s** (with `--cache`) | ~61% |
| `lint:glint:fix` | glint | **11.0s** | **4.5s** (with `--incremental`) | ~36% |
| `format` | prettier (with `--cache`) | **8.6s** | — | ~28% |

**Full `lint:fix` wall clock: ~30.5s**

Since the first four run in parallel, wall clock is dominated by the slowest (eslint at 18.7s), then prettier adds 8.6s sequentially.

## Analysis

### 1. ESLint — THE #1 bottleneck (18.7s → 1.4s possible)

ESLint is by far the slowest step. The `TIMING=1` breakdown reveals:

| ESLint Rule | Time | % of ESLint |
|-------------|------|-------------|
| `import/namespace` | **7,426ms** | **63.7%** |
| `import/order` | 383ms | 3.3% |
| `import/no-duplicates` | 319ms | 2.7% |
| `import/default` | 286ms | 2.5% |
| `import/no-named-as-default` | 227ms | 1.9% |
| `import/no-named-as-default-member` | 206ms | 1.8% |
| `import/named` | 201ms | 1.7% |

**The `import/namespace` rule alone takes 7.4 seconds (40% of the entire lint:fix parallel phase).**

The `eslint-plugin-import` rules collectively account for ~78% of ESLint's runtime.

**Quick wins:**
- **Add `--cache` to `lint:js:fix`**: Drops repeat runs from 18.7s → 1.4s. The `lint:js` script already uses `--cache` but `lint:js:fix` does not.
- **Disable `import/namespace`**: This single rule takes 7.4s and provides limited value (it checks that imported names exist as exports — already caught by TypeScript/Glint). Removing it cuts ESLint from 18.7s → ~11s.
- **Consider replacing `eslint-plugin-import` with `eslint-plugin-import-x`**: The `import-x` fork is significantly faster due to better caching and resolver architecture.

### 2. Glint — Second bottleneck (11.0s → 4.5s possible)

Glint runs a full TypeScript type-check through Ember's template layer. It has no caching by default.

**Quick win:**
- **Add `--incremental` flag**: Second runs drop from 11.0s → 4.5s. This saves a `.tsbuildinfo` file for incremental compilation.

### 3. Prettier — Sequential tail (8.6s)

Prettier runs *after* all linters complete (sequentially), so it always adds to wall clock time. The `--cache` flag is already set but provides negligible benefit (8.6s cached vs 8.4s uncached) — the cache seems to not be effective.

**Possible optimizations:**
- Investigate why `--cache` isn't helping (possibly invalidated by prior lint:fix steps modifying files)
- Narrow file scope with explicit `--ignore-path` or file patterns instead of `.`

### 4. ember-template-lint (3.9s) and stylelint (0.6s)

These are already fast and not worth optimizing.

## Recommended Changes (by impact)

### High Impact

1. **Add `--cache` to `lint:js:fix`** — Near-zero effort, saves ~17s on repeat runs
   ```diff
   - "lint:js:fix": "eslint . --fix",
   + "lint:js:fix": "eslint . --fix --cache",
   ```

2. **Disable `import/namespace` rule** — Saves 7.4s on every run (already checked by TypeScript/Glint)
   ```js
   // in eslint.config.mjs
   'import/namespace': 'off',
   ```

3. **Add `--incremental` to glint** — Saves ~6.5s on repeat runs
   ```diff
   - "lint:glint": "glint",
   - "lint:glint:fix": "glint",
   + "lint:glint": "glint --incremental",
   + "lint:glint:fix": "glint --incremental",
   ```

### Medium Impact

4. **Move prettier into concurrently block** — Currently prettier waits for ALL linters. If it ran in parallel, it would eliminate ~8.6s from wall clock. The risk is that linters and prettier could conflict on the same files, but in practice lint:fix changes are structural (not formatting) so conflicts are rare.

5. **Replace `eslint-plugin-import` with `eslint-plugin-import-x`** — Drop-in replacement that's significantly faster. All import/* rules would benefit.

### Projected Improvement

| Scenario | Wall clock |
|----------|-----------|
| Current | **~30.5s** |
| +ESLint `--cache` (repeat runs) | **~20.4s** (−33%) |
| +Disable `import/namespace` | **~23.1s** (−24%) |
| +Glint `--incremental` (repeat runs) | **~26.0s** (−15%) |
| All three combined (repeat runs) | **~13.1s** (−57%) |
| All + prettier in parallel (repeat runs) | **~4.5s** (−85%) |
