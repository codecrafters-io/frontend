import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import Prism from 'prismjs';
import 'prismjs/plugins/diff-highlight/prism-diff-highlight';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-diff';

export default class SyntaxHighlightedCodeComponent extends Component {
  get highlightedHtml() {
    // TODO: For normal languages, don't use Prism.languages.diff!
    return htmlSafe(Prism.highlight(this.args.code, Prism.languages.diff, this.args.language));
  }
}
