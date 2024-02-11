import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import getOrCreateCachedHighlighterPromise from 'codecrafters-frontend/utils/highlighter-cache';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';

export default class SyntaxHighlightedCodeComponent extends Component {
  @tracked asyncHighlightedHTML;

  constructor() {
    super(...arguments);

    let highlighterPromise = getOrCreateCachedHighlighterPromise(`${this.args.theme}-${this.args.language}`, {
      theme: this.args.theme,
      langs: [this.args.language],
    });

    const lineOptions = (this.args.highlightedLines || '')
      .split(',')
      .flatMap((lineOrBlock) => [{ line: parseInt(lineOrBlock), classes: ['highlighted'] }]);

    highlighterPromise
      .then((highlighter) => {
        this.asyncHighlightedHTML = htmlSafe(highlighter.codeToHtml(this.args.code, { lang: this.args.language, lineOptions: lineOptions }));
      })
      .catch((error) => {
        if (config.environment === 'test' && error.message.match(/WebAssembly.instantiate/)) {
          console.log('ignoring WebAssembly error only present in tests');
        } else {
          throw error;
        }
      });
  }

  get highlightedHtml() {
    return this.asyncHighlightedHTML || this.temporaryHTML;
  }

  get temporaryHTML() {
    const linesHTML = this.args.code
      .split('\n')
      .map((line) => `<div class="line">${line}</div>`)
      .join('');

    return htmlSafe(`<pre><code>${linesHTML}</code></pre>`);
  }
}