import Modifier from 'ember-modifier';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';

type Signature = {
  Args: {
    Positional: [];
  };
};

export default class ScrollToTopOnInsertModifier extends Modifier<Signature> {
  modify() {
    scrollToTop();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'scroll-to-top-on-insert': typeof ScrollToTopOnInsertModifier;
  }
}
