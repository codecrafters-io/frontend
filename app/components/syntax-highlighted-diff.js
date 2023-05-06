import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import getOrCreateCachedHighlighterPromise, { preloadHighlighter } from '../lib/highlighter-cache';
import { zip } from '../lib/lodash-utils';

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
    return this.args.code
      .trim()
      .split('\n')
      .map((line) => {
        if (line.startsWith('+')) {
          return [line.substring(1), 'added-line'];
        } else if (line.startsWith('-')) {
          return [line.substring(1), 'removed-line'];
        } else if (line.startsWith(' ')) {
          return [line.substring(1), 'unchanged-line'];
        } else {
          // shouldn't happen?
          return [line, 'unchanged-line'];
        }
      });
  }

  get codeWithoutDiffMarkers() {
    return this.codeLinesWithDiffClasses.map((array) => array[0]).join('\n');
  }

  get temporaryHTML() {
    const linesHTML = this.codeLinesWithDiffClasses.map(([line, classes]) => `<div class="line ${classes}">${line}</div>`).join('');

    return htmlSafe(`<pre><code>${linesHTML}</code></pre>`);
  }

  get highlightedHtml() {
    return this.asyncHighlightedHTML || this.temporaryHTML;
  }

  get lineGroupsForRender() {
    let groups = [];
    let currentGroup = null;

    this.linesForRender.forEach((line) => {
      if (currentGroup && currentGroup.type === line.type) {
        currentGroup.lines.push(line);
      } else {
        currentGroup = { type: line.type, lines: [line] };
        groups.push(currentGroup);
      }
    });

    return groups;
  }

  get linesForRender() {
    const highlightedLineNodes = Array.from(new DOMParser().parseFromString(this.highlightedHtml, 'text/html').querySelector('pre code').children);
    console.log(this.codeLinesWithDiffClasses.length, highlightedLineNodes.length);

    if (this.codeLinesWithDiffClasses.length !== highlightedLineNodes.length) {
      console.log('mismatch found!');
      console.log(this.codeLinesWithDiffClasses);
      console.log(this.highlightedHtml.string);
    }

    return zip(this.codeLinesWithDiffClasses, highlightedLineNodes).map(([[, classes], node]) => {
      return {
        html: htmlSafe(`${node.outerHTML}`),
        type: {
          'added-line': 'added',
          'removed-line': 'removed',
          'unchanged-line': 'unchanged',
        }[classes],
      };
    });
  }
}
