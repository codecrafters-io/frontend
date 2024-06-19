import Modifier from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [];

    Named: {
      preventScroll?: boolean;
    }
  };
};

export default class FocusOnInsertModifier extends Modifier<Signature> {
  modify(element: HTMLElement, _positional: [], named: Signature['Args']['Named']) {
    element.focus({ preventScroll: !!named.preventScroll });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'focus-on-insert': typeof FocusOnInsertModifier;
  }
}
