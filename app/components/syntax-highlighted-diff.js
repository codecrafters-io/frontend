import { htmlSafe } from '@ember/template';
import { A } from '@ember/array';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import getOrCreateCachedHighlighterPromise, { preloadHighlighter } from '../lib/highlighter-cache';
import { escapeHtml, groupBy, zip } from '../lib/lodash-utils';
import { action } from '@ember/object';
import { TrackedSet } from 'tracked-built-ins';

export default class SyntaxHighlightedDiffComponent extends Component {
  @tracked asyncHighlightedHTML;
  linesWithExpandedComments = new TrackedSet([]);

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

  get commentsGroupedByEndLine() {
    return groupBy(this.args.comments || [], (comment) => comment.subtargetEndLine || 0);
  }

  get temporaryHTML() {
    const linesHTML = this.codeLinesWithTypes.map(([line]) => `<span>${escapeHtml(line)}</span>`).join('');

    return `<pre><code>${linesHTML}</code></pre>`;
  }

  @action
  handleToggleCommentsButtonClick(lineNumber) {
    if (this.linesWithExpandedComments.has(lineNumber)) {
      this.linesWithExpandedComments.delete(lineNumber);
    } else {
      this.linesWithExpandedComments.add(lineNumber);
    }
  }

  get highlightedHtml() {
    return this.asyncHighlightedHTML || this.temporaryHTML;
  }

  lineHasComments(lineNumber) {
    return (this.args.comments || []).any((comment) => lineNumber <= comment.subtargetEndLine && lineNumber >= comment.subtargetStartLine);
  }

  get linesForRender() {
    const highlightedLineNodes = Array.from(new DOMParser().parseFromString(this.highlightedHtml, 'text/html').querySelector('pre code').children);

    return zip(this.codeLinesWithTypes, highlightedLineNodes).map(([[, lineType], node], index) => {
      return {
        hasComments: this.lineHasComments(index + 1),
        html: htmlSafe(`${node.outerHTML}`),
        type: lineType,
        number: index + 1,
        comments: this.commentsGroupedByEndLine[index + 1] || [],
        commentsAreExpanded: this.linesWithExpandedComments.has(index + 1),
      };
    });
  }
}
