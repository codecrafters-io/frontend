import type RenderModifiersRegistry from '@ember/render-modifiers/template-registry';
import type { ModifierLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends RenderModifiersRegistry {
    'in-viewport': ModifierLike<{ Args: { Named: { onEnter: () => void } } }>;
    // ...
  }
}
