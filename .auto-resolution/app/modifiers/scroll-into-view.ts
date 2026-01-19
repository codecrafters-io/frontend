import { later } from '@ember/runloop';
import Modifier from 'ember-modifier';

interface Signature {
  Args: {
    Positional: [];

    Named: {
      behavior?: ScrollBehavior;
      block?: ScrollLogicalPosition;
      delay?: number;
    };
  };
}

export default class ScrollIntoViewModifier extends Modifier<Signature> {
  modify(element: Element, _positional: [], named: Signature['Args']['Named']) {
    const { behavior = 'smooth', block = 'nearest', delay = 0 } = named;
    later(() => {
      element.scrollIntoView({ behavior, block });
    }, delay);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'scroll-into-view': typeof ScrollIntoViewModifier;
  }
}
