import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
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

import 'prismjs/components/prism-diff';

import 'prismjs/plugins/diff-highlight/prism-diff-highlight';

export default class SyntaxHighlightedDiffComponent extends Component {
  get highlightedHtml() {
    return htmlSafe(Prism.highlight(this.args.code, Prism.languages.diff, `diff-${this.args.language}`));
  }
}
