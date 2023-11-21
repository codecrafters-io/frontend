import { modifier } from 'ember-modifier';

import Prism from 'prismjs';

type Signature = {
  Args: {
    Positional: [contents: string];
  };
};

const highlightCodeBlocks = modifier<Signature>((element, [_contents]) => {
  Prism.highlightAllUnder(element);
});

export default highlightCodeBlocks;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'highlight-code-blocks': typeof highlightCodeBlocks;
  }
}
