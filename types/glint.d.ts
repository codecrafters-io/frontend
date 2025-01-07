// eslint-disable-next-line ember/no-at-ember-render-modifiers
import type RenderModifiersRegistry from '@ember/render-modifiers/template-registry';
import type EmberAnimatedRegistry from 'ember-animated/template-registry';
import type EmberBasicDropdownRegistry from 'ember-basic-dropdown/template-registry';
import type EmberConcurrencyRegistry from 'ember-concurrency/template-registry';
import type EmberTruthHelpersRegistry from 'ember-truth-helpers/template-registry';
import type EmberMathHelpersRegistry from 'ember-math-helpers/template-registry';
import type { ModifierLike, HelperLike, ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends RenderModifiersRegistry,
      EmberAnimatedRegistry,
      EmberBasicDropdownRegistry,
      EmberConcurrencyRegistry,
      EmberTruthHelpersRegistry,
      EmberMathHelpersRegistry {
    autoresize: ModifierLike<{ Args: { Positional: [string] } }>;
    capitalize: HelperLike<{ Return: string; Args: { Positional: [string] } }>;
    'did-resize': ModifierLike<{ Args: { Positional: [(entry: ResizeObserverEntry) => void] } }>;
    EmberTooltip: ComponentLike<{
      Args: { Named: { text?: string; side?: 'top' | 'bottom' | 'left' | 'right'; delay?: number; duration?: number; popperContainer?: string } };
      Blocks: { default?: [] };
    }>;
    EmberPopover: ComponentLike<{
      Args: { Named: { side?: 'top' | 'bottom' | 'left' | 'right'; popperContainer?: string } };
      Blocks: { default?: [] };
    }>;
    includes: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    'html-safe': HelperLike<{ Return: string; Args: { Positional: [string | undefined] } }>;
    join: HelperLike<{ Return: string; Args: { Positional: [string, string[]] } }>;
    'on-click-outside': ModifierLike<{ Args: { Positional: [(event: MouseEvent) => void] } }>;
    'on-key': HelperLike<{ Args: { Positional: [key: string, onKey: () => void] }; Return: '' }>;
    'in-viewport': ModifierLike<{ Args: { Named: { onEnter: () => void } } }>;
    noop: HelperLike<{ Return: () => void }>;
    'page-title': HelperLike<{ Return: string; Args: { Positional: [string]; Named: { replace?: boolean } } }>;
    range: HelperLike<{ Return: number[]; Args: { Positional: [number, number] } }>;
    repeat: HelperLike<{ Return: string[]; Args: { Positional: [number] } }>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'sortable-group': ModifierLike<{ Args: { Named: { onChange: (items: any[], movedItem: any) => void } } }>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'sortable-item': ModifierLike<{ Args: { Named: { model: any } } }>;

    'sortable-handle': ModifierLike<{ Args: { Positional: [] } }>;
    'svg-jar': ComponentLike<{ Args: { Named: { class: string }; Positional: [string] } }>;
    // ...
  }
}
