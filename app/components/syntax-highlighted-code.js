import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import * as shiki from 'shiki';
import { tracked } from '@glimmer/tracking';

export default class SyntaxHighlightedCodeComponent extends Component {
  @tracked asyncHighlightedHTML;

  constructor() {
    super(...arguments);

    shiki.setCDN('https://unpkg.com/shiki/');

    shiki.getHighlighter({ theme: 'github-light', langs: ['c'] }).then((highlighter) => {
      this.asyncHighlightedHTML = htmlSafe(highlighter.codeToHtml(this.args.code, { lang: 'c' }));
    });
  }

  get highlightedHtml() {
    return this.asyncHighlightedHTML || this.args.code;
  }
}
