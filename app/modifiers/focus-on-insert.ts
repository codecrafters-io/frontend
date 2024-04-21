import Modifier from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [];

    Named: Record<string, never>;
  };
};

export default class FocusOnInsertModifier extends Modifier<Signature> {
  modify(element: HTMLElement, _positional: [], _named: Signature['Args']['Named']) {
    element.focus();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'focus-on-insert': typeof FocusOnInsertModifier;
  }
}
