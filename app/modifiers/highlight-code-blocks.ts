import { modifier } from 'ember-modifier';

import Prism from 'prismjs';

import 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-nim';
// import 'prismjs/components/prism-php'; Doesn't work for some reason?
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-crystal';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-zig';
import 'prismjs/components/prism-diff';

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
