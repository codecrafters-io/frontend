import type RenderModifiersRegistry from '@ember/render-modifiers/template-registry';
import { SafeString } from '@ember/template/-private/handlebars';
import type { ModifierLike } from '@glint/template';
import type { HelperLike } from '@glint/template';
import type { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends RenderModifiersRegistry {
    'in-viewport': ModifierLike<{ Args: { Named: { onEnter: () => void } } }>;
    'html-safe': HelperLike<{ Return: string; Args: { Positional: [string | undefined] } }>;
    noop: HelperLike<{ Return: () => void }>;
    AnimatedContainer: ComponentLike<{ Blocks: { default: [string, ...unknown[]] } }>;
    AnimatedOrphans: ComponentLike<{ Blocks: { default: [string, ...unknown[]] } }>;
    'animated-value': ComponentLike<{
      Args: { Positional: [unknown]; Named: { duration: number; rules: any } };
      Blocks: { default: [unknown] };
      Yields: { default: [string] };
      Return: string;
    }>;
    EmberTooltip: ComponentLike<{ Args: { Named: { text: string } } }>;
    'animated-if': ComponentLike<{
      Args: { Positional: [unknown]; Named: { duration: number; transition: unknown } };
      Blocks: { default: [unknown] };
      Yields: { default: [string] };
      Return: string;
    }>;
    'svg-jar': ComponentLike<{ Args: { Named: { class: string }; Positional: [string] } }>;
    or: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    add: HelperLike<{ Args: { Positional: [number, number] }; Return: number }>;
    and: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    eq: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    'moment-format': HelperLike<{ Return: string; Args: { Positional: [Date, string] } }>;
    'moment-from-now': HelperLike<{ Return: string; Args: { Positional: [Date] } }>;
    not: HelperLike<{ Args: { Positional: [unknown] }; Return: boolean }>;
    'not-eq': HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    'page-title': HelperLike<{ Return: string; Args: { Positional: [string] } }>;
    repeat: HelperLike<{ Return: string[]; Args: { Positional: [number] } }>;
    gt: HelperLike<{ Args: { Positional: [unknown, unknown] }; Return: boolean }>;
    FeatureCard: ComponentLike<{ Args: { Content: SafeString, imageUrl: string, title: string  } };
    // ...
  }
}
