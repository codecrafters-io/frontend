// eslint-disable-next-line ember/no-at-ember-render-modifiers
import type RenderModifiersRegistry from '@ember/render-modifiers/template-registry';
import type { ModifierLike } from '@glint/template';
import type { HelperLike } from '@glint/template';
import type { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends RenderModifiersRegistry {
    add: HelperLike<{ Args: { Positional: [number, number] }; Return: number }>;
    and: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    autoresize: ModifierLike<{ Args: { Positional: [string] } }>;
    capitalize: HelperLike<{ Return: string; Args: { Positional: [string] } }>;
    'date-format': HelperLike<{ Return: string; Args: { Positional: [Date]; Named: { format?: string } } }>;
    'date-from-now': HelperLike<{ Return: string; Args: { Positional: [Date]; Named: { currentDate?: Date } } }>;
    'did-resize': ModifierLike<{ Args: { Positional: [(entry: ResizeObserverEntry) => void] } }>;
    EmberTooltip: ComponentLike<{ Args: { Named: { text?: string; side?: 'top' | 'bottom' | 'left' | 'right' } }; Blocks: { default?: [] } }>;
    eq: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    includes: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    gt: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    gte: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    'html-safe': HelperLike<{ Return: string; Args: { Positional: [string | undefined] } }>;
    lt: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    mult: HelperLike<{ Args: { Positional: [number, number] }; Return: number }>;
    'on-click-outside': ModifierLike<{ Args: { Positional: [(event: MouseEvent) => void] } }>;
    'in-viewport': ModifierLike<{ Args: { Named: { onEnter: () => void } } }>;
    noop: HelperLike<{ Return: () => void }>;
    'not-eq': HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    not: HelperLike<{ Args: { Positional: [unknown] }; Return: boolean }>;
    or: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    'page-title': HelperLike<{ Return: string; Args: { Positional: [string] } }>;
    range: HelperLike<{ Return: number[]; Args: { Positional: [number, number] } }>;
    repeat: HelperLike<{ Return: string[]; Args: { Positional: [number] } }>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'sortable-group': ModifierLike<{ Args: { Named: { onChange: (items: any[], movedItem: any) => void } } }>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'sortable-item': ModifierLike<{ Args: { Named: { model: any } } }>;

    'sortable-handle': ModifierLike<{ Args: { Positional: [] } }>;
    sub: HelperLike<{ Args: { Positional: [number, number] }; Return: number }>;
    'svg-jar': ComponentLike<{ Args: { Named: { class: string }; Positional: [string] } }>;
    // ...
  }
}
