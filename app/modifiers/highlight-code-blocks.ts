import Modifier from 'ember-modifier';

import Prism from 'prismjs';

type Signature = {
  Args: {
    Named: { contents?: string };
  };
};

export default class HighlightCodeBlocksModifier extends Modifier<Signature> {
  contents?: string;

  modify(element: HTMLElement, _: [], _named: Signature['Args']['Named']) {
    Prism.highlightAllUnder(element);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'highlight-code-blocks': typeof HighlightCodeBlocksModifier;
  }
}
