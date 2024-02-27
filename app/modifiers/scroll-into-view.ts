import Modifier from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [];

    Named: {
      behavior?: ScrollBehavior;
      block?: ScrollLogicalPosition;
    };
  };
};

export default class ScrollIntoViewModifier extends Modifier<Signature> {
  modify(element: Element, _positional: [], named: Signature['Args']['Named']) {
    const { behavior = 'smooth', block = 'nearest' } = named;
    element.scrollIntoView({ behavior, block });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'scroll-into-view': typeof ScrollIntoViewModifier;
  }
}
