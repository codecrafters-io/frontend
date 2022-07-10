import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import Prism from 'prismjs';

import 'prismjs/plugins/diff-highlight/prism-diff-highlight';

export default class SyntaxHighlightedCodeComponent extends Component {
  get highlightedHtml() {
    if (this.args.language.startsWith('diff-')) {
      return htmlSafe(Prism.highlight(this.args.code, Prism.languages.diff, this.args.language));
    } else {
      return htmlSafe(Prism.highlight(this.args.code, Prism.languages[this.args.language], Prism.languages[this.args.language]));
    }
  }
}
