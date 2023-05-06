import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import getOrCreateCachedHighlighterPromise, { preloadHighlighter } from '../lib/highlighter-cache';
import { escapeHtml, zip } from '../lib/lodash-utils';

export default class SyntaxHighlightedDiffComponent extends Component {
  @tracked asyncHighlightedHTML;

  static highlighterId = 'syntax-highlighted-diff';
  static highlighterOptions = { theme: 'github-light', langs: [] };

  static preloadHighlighter() {
    preloadHighlighter(this.highlighterId, this.highlighterOptions);
  }

  constructor() {
    super(...arguments);

    let highlighterPromise = getOrCreateCachedHighlighterPromise(
      SyntaxHighlightedDiffComponent.highlighterId,
      SyntaxHighlightedDiffComponent.highlighterOptions
    );

    highlighterPromise.then((highlighter) => {
      highlighter.loadLanguage(this.args.language).then(() => {
        this.asyncHighlightedHTML = highlighter.codeToHtml(this.codeWithoutDiffMarkers, { lang: this.args.language });
      });
    });
  }

  get codeLinesWithTypes() {
    return this.args.code
      .trim()
      .split('\n')
      .map((line) => {
        if (line.startsWith('+')) {
          return [line.substring(1), 'added'];
        } else if (line.startsWith('-')) {
          return [line.substring(1), 'removed'];
        } else if (line.startsWith(' ')) {
          return [line.substring(1), 'unchanged'];
        } else {
          // shouldn't happen?
          return [line, 'unchanged'];
        }
      });
  }

  get codeWithoutDiffMarkers() {
    return this.codeLinesWithTypes.map((array) => array[0]).join('\n');
  }

  get temporaryHTML() {
    const linesHTML = this.codeLinesWithTypes.map(([line]) => `<span>${escapeHtml(line)}</span>`).join('');

    return `<pre><code>${linesHTML}</code></pre>`;
  }

  get highlightedHtml() {
    return this.asyncHighlightedHTML || this.temporaryHTML;
  }

  get linesForRender() {
    const highlightedLineNodes = Array.from(new DOMParser().parseFromString(this.highlightedHtml, 'text/html').querySelector('pre code').children);

    return zip(this.codeLinesWithTypes, highlightedLineNodes).map(([[, lineType], node], index) => {
      return {
        html: htmlSafe(`${node.outerHTML}`),
        type: lineType,
        number: index + 1,
      };
    });
  }
}
