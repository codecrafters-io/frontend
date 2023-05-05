import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import getOrCreateCachedHighlighterPromise, { preloadHighlighter } from '../lib/highlighter-cache';

export default class SyntaxHighlightedDiffComponent extends Component {
  @tracked asyncHighlightedHTML;

  static highlighterId = 'syntax-highlighted-diff';
  static highlighterOptions = { theme: 'github-light' };

  static preloadHighlighter() {
    preloadHighlighter(this.highlighterId, this.highlighterOptions);
  }

  constructor() {
    super(...arguments);

    let highlighterPromise = getOrCreateCachedHighlighterPromise(
      SyntaxHighlightedDiffComponent.highlighterId,
      SyntaxHighlightedDiffComponent.highlighterOptions
    );

    const lineOptions = this.codeLinesWithDiffClasses.map(([, classes], lineIndex) => ({ line: lineIndex + 1, classes: [classes] }));

    highlighterPromise.then((highlighter) => {
      highlighter.loadLanguage(this.args.language).then(() => {
        this.asyncHighlightedHTML = htmlSafe(
          highlighter.codeToHtml(this.codeWithoutDiffMarkers, { lang: this.args.language, lineOptions: lineOptions })
        );
      });
    });
  }

  get codeLinesWithDiffClasses() {
    return this.args.code.split('\n').map((line) => {
      if (line.startsWith('+')) {
        return [line.substring(1), 'added-line'];
      } else if (line.startsWith('-')) {
        return [line.substring(1), 'removed-line'];
      } else {
        return [line, 'unchanged-line'];
      }
    });
  }

  get codeWithoutDiffMarkers() {
    return this.codeLinesWithDiffClasses.map((array) => array[0]).join('\n');
  }

  get temporaryHTML() {
    const linesHTML = this.codeLinesWithDiffClasses.map(([line, classes]) => `<div class="line ${classes}">${line}</div>`).join('');

    return htmlSafe(`${linesHTML}`);
  }

  get highlightedHtml() {
    return this.asyncHighlightedHTML || this.temporaryHTML;
  }
}
