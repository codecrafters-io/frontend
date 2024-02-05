import '@glint/environment-ember-loose';

import type EmberAnimatedRegistry from 'ember-animated/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends EmberAnimatedRegistry /* other addon registries */ {
    // local entries
  }
}
