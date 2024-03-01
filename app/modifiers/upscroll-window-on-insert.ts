import Modifier from 'ember-modifier';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';

type Signature = {
  Args: {
    Positional: [];
  };
};

export default class UpscrollWindowOnInsertModifier extends Modifier<Signature> {
  modify() {
    scrollToTop();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'upscroll-window-on-insert': typeof UpscrollWindowOnInsertModifier;
  }
}
