import type RenderModifiersRegistry from '@ember/render-modifiers/template-registry';
import type { ModifierLike } from '@glint/template';
import type { HelperLike } from '@glint/template';
import type { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends RenderModifiersRegistry {
    'in-viewport': ModifierLike<{ Args: { Named: { onEnter: () => void } } }>;
    'html-safe': HelperLike<{ Return: string; Args: { Positional: [string | undefined] } }>;
    AnimatedContainer: ComponentLike<{ Blocks: { default: [string, ...unknown[]] } }>;
    AnimatedOrphans: ComponentLike<{ Blocks: { default: [string, ...unknown[]] } }>;
    'animated-value': ComponentLike<{
      Args: { Positional: [unknown]; Named: { duration: number; rules: any } };
      Blocks: { default: [unknown] };
      Yields: { default: [string] };
      Return: string;
    }>;
    // ...
  }
}
