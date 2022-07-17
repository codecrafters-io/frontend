import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import * as shiki from 'shiki';
import { tracked } from '@glimmer/tracking';

/**
 * getHighlighter() is the most expensive step of Shiki. Instead of calling it on every page,
 * cache it here as much as possible. Make sure that your highlighters can be cached, state-free.
 * We make this async, so that multiple calls to parse markdown still share the same highlighter.
 */
const highlighterCacheAsync = new Map();

export default class SyntaxHighlightedCodeComponent extends Component {
  @tracked asyncHighlightedHTML;

  constructor() {
    super(...arguments);

    shiki.setCDN('https://unpkg.com/shiki/');

    const cacheID = 'only-one-entry-for-now';

    let highlighterAsync = highlighterCacheAsync.get(cacheID);

    if (!highlighterAsync) {
      highlighterAsync = shiki.getHighlighter({ theme: 'one-dark-pro', langs: ['c'] });
      highlighterCacheAsync.set(cacheID, highlighterAsync);
    }

    const lineOptions = (this.args.highlightedLines || '')
      .split(',')
      .flatMap((lineOrBlock) => [{ line: parseInt(lineOrBlock), classes: ['highlighted'] }]);

    highlighterAsync.then((highlighter) => {
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
