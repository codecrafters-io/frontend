import type RenderModifiersRegistry from '@ember/render-modifiers/template-registry';
import type { ModifierLike } from '@glint/template';
import type { HelperLike } from '@glint/template';
import type { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends RenderModifiersRegistry {
    add: HelperLike<{ Args: { Positional: [number, number] }; Return: number }>;
    and: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    AnimatedContainer: ComponentLike<{ Blocks: { default: [string, ...unknown[]] } }>;
    AnimatedOrphans: ComponentLike<{ Blocks: { default: [string, ...unknown[]] } }>;
    'animated-value': ComponentLike<{
      Args: { Positional: [unknown]; Named: { duration: number; rules: unknown } };
      Blocks: { default: [unknown] };
      Yields: { default: [string] };
      Return: string;
    }>;
    'animated-each': ComponentLike<{
      Args: { Positional: [unknown]; Named: { use: unknown } };
      Blocks: { default: [unknown] };
      Yields: { default: [string] };
      Return: string;
    }>;
    'animated-if': ComponentLike<{
      Args: { Positional: [unknown]; Named: { duration?: number; transition?: unknown } };
      Blocks: { default: [unknown] };
      Yields: { default: [string] };
      Return: string;
    }>;
    'date-format': HelperLike<{ Return: string; Args: { Positional: [Date]; Named: { format?: string } } }>;
    'date-from-now': HelperLike<{ Return: string; Args: { Positional: [Date]; Named: { currentDate?: Date } } }>;
    'did-resize': ModifierLike<{ Args: { Positional: [(entry: ResizeObserverEntry) => void] } }>;
    EmberTooltip: ComponentLike<{ Args: { Named: { text: string; side?: 'top' | 'bottom' | 'left' | 'right' } } }>;
    eq: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    gt: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    'html-safe': HelperLike<{ Return: string; Args: { Positional: [string | undefined] } }>;
    'on-click-outside': ModifierLike<{ Args: { Positional: [(event: MouseEvent) => void] } }>;
    'in-viewport': ModifierLike<{ Args: { Named: { onEnter: () => void } } }>;
    noop: HelperLike<{ Return: () => void }>;
    'not-eq': HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    not: HelperLike<{ Args: { Positional: [unknown] }; Return: boolean }>;
    or: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    'page-title': HelperLike<{ Return: string; Args: { Positional: [string] } }>;
    repeat: HelperLike<{ Return: string[]; Args: { Positional: [number] } }>;
    'svg-jar': ComponentLike<{ Args: { Named: { class: string }; Positional: [string] } }>;
    // ...
  }
}
