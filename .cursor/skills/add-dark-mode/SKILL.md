---
name: add-dark-mode-support
description: Add dark mode styles to components using Tailwind dark: variant classes. Use when creating new components, adding dark mode support to existing components, or when the user mentions dark mode, theming, or light/dark variants.
---

# Adding Dark Mode Support

This skill guides you through adding dark mode support to components in the CodeCrafters frontend.

## How Dark Mode Works

Dark mode is controlled by the `DarkModeService` (`app/services/dark-mode.ts`). When enabled:
- The root `#application-container` div gets the `dark` class
- Tailwind's `dark:` variant classes become active (configured as `['variant', ['&:is(.dark *)']]`)

## Route Color Scheme Support

Routes declare their dark mode support via `RouteInfoMetadata`:

```typescript
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export default class MyRoute extends BaseRoute {
  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }
}
```

Options:
- `RouteColorScheme.Light` - Light mode only
- `RouteColorScheme.Dark` - Dark mode only
- `RouteColorScheme.Both` - Supports both (user can toggle)

## Common Color Patterns

### Backgrounds

| Light | Dark | Usage |
|-------|------|-------|
| `bg-white` | `dark:bg-gray-925` | Cards, containers |
| `bg-white` | `dark:bg-gray-950` | Main backgrounds |
| `bg-gray-50` | `dark:bg-gray-900` | Subtle backgrounds |

### Borders

| Light | Dark | Usage |
|-------|------|-------|
| `border-gray-200` | `dark:border-white/5` | Subtle borders |
| `border-gray-200` | `dark:border-white/10` | More visible borders |
| `border-gray-300` | `dark:border-gray-700` | Interactive borders |

### Text

| Light | Dark | Usage |
|-------|------|-------|
| `text-gray-900` | `dark:text-gray-100` | Primary headings |
| `text-gray-700` | `dark:text-gray-200` | Secondary headings |
| `text-gray-600` | `dark:text-gray-300` | Body text |
| `text-gray-500` | `dark:text-gray-400` | Muted text |
| `text-gray-400` | `dark:text-gray-600` | Very subtle text |

### Icons

| Light | Dark | Usage |
|-------|------|-------|
| `text-gray-300` | `dark:text-gray-700` | Decorative icons |
| `text-gray-400` | `dark:text-gray-600` | Secondary icons |

### Prose/Typography

For markdown content, use the prose plugin with invert:

```handlebars
<div class="prose dark:prose-invert">
  {{markdown-to-html @content}}
</div>
```

## Implementation Examples

### Basic Card Component

```handlebars
<div class="bg-white dark:bg-gray-925 border border-gray-200 dark:border-white/5 rounded-md shadow-xs">
  <div class="text-gray-900 dark:text-gray-100 font-bold">
    {{@title}}
  </div>
  <div class="text-gray-500 dark:text-gray-400 text-sm">
    {{@description}}
  </div>
</div>
```

### Conditional Styling with Dark Variants

When using conditional classes, include dark variants in both branches:

```handlebars
<div class="{{if @isActive
  'border-teal-500 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/30'
  'border-gray-200 dark:border-white/5 bg-white dark:bg-gray-925'
}}">
```

### Interactive Elements with Hover States

```handlebars
<button class="
  bg-white dark:bg-gray-950
  border border-gray-300 dark:border-gray-700
  hover:bg-gray-50 dark:hover:bg-gray-900
  text-gray-700 dark:text-gray-200
">
```

### Color-Coded Alerts

For colored components, use color-specific dark variants:

```typescript
get containerColorClasses(): string {
  return {
    green: 'bg-green-100/20 dark:bg-green-900/30 border-green-500/60 dark:border-green-500/40',
    blue: 'bg-blue-100/20 dark:bg-blue-900/30 border-blue-500/60 dark:border-blue-500/40',
    red: 'bg-red-100/20 dark:bg-red-900/30 border-red-500/60 dark:border-red-500/40',
  }[this.args.color];
}
```

## Checklist for Adding Dark Mode

When adding dark mode support to a component:

- [ ] Add `dark:bg-*` for all background colors
- [ ] Add `dark:border-*` for all border colors
- [ ] Add `dark:text-*` for all text colors
- [ ] Add dark variants to hover/focus states
- [ ] Handle conditional classes (both branches need dark variants)
- [ ] Use `prose dark:prose-invert` for markdown content
