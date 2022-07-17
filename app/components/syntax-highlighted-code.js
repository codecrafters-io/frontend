import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import * as shiki from 'shiki';
import { tracked } from '@glimmer/tracking';

export default class SyntaxHighlightedCodeComponent extends Component {
  @tracked asyncHighlightedHTML;

  constructor() {
    super(...arguments);

    shiki.setCDN('https://unpkg.com/shiki/');

    const lineOptions = (this.args.highlightedLines || '')
      .split(',')
      .flatMap((lineOrBlock) => [{ line: parseInt(lineOrBlock), classes: ['highlighted'] }]);

    shiki.getHighlighter({ theme: 'one-dark-pro', langs: ['c'] }).then((highlighter) => {
      this.asyncHighlightedHTML = htmlSafe(highlighter.codeToHtml(this.args.code, { lang: 'c', lineOptions: lineOptions }));
    });
  }

  get temporaryHTML() {
    const linesHTML = this.args.code
      .split('\n')
      .map((line) => `<div class="line">${line}</div>`)
      .join('');

    return htmlSafe(`<pre><code>${linesHTML}</code></pre>`);
  }

  get highlightedHtml() {
    return this.asyncHighlightedHTML || this.temporaryHTML;
  }
}
