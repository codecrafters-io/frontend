import Component from '@glimmer/component';
import getOrCreateCachedHighlighterPromise, { preloadHighlighter } from '../lib/highlighter-cache';
import groupDiffLinesIntoChunks from 'codecrafters-frontend/lib/group-diff-lines-into-chunks';
import { action } from '@ember/object';
import { escapeHtml, groupBy, zip } from '../lib/lodash-utils';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';

export default class SyntaxHighlightedDiffComponent extends Component {
  @tracked asyncHighlightedHTML;
  @tracked lineNumberWithExpandedComments = null;

  static highlighterId = 'syntax-highlighted-diff';
  static highlighterOptions = { theme: 'github-light', langs: [] };
  static LINES_AROUND_CHANGED_CHUNK = 3;
  static MIN_LINES_BETWEEN_CHUNKS_BEFORE_COLLAPSING = 4;

  constructor() {
    super(...arguments);

    this.highlightCode();
  }

  get chunksForRender() {
    const highlightedLineNodes = Array.from(new DOMParser().parseFromString(this.highlightedHtml, 'text/html').querySelector('pre code').children);

    const lines = zip(this.codeLinesWithTypes, highlightedLineNodes).map(([[, lineType], node], index) => {
      return {
        isFirst: index === 0,
        isLast: index === this.codeLinesWithTypes.length - 1,
        isTargetedByComments: this.targetingCommentsForLine(index + 1).length > 0,
        isTargetedByExpandedComments: this.expandedComments.any((comment) => this.commentTargetsLine(comment, index + 1)),
        html: htmlSafe(`${node.outerHTML}`),
        type: lineType,
        number: index + 1,
        comments: this.topLevelCommentsGroupedByLine[index + 1] || [],
        hasComments: this.topLevelCommentsGroupedByLine[index + 1]?.length > 0,
        commentsAreExpanded: this.lineNumberWithExpandedComments === index + 1,
      };
    });

    return groupDiffLinesIntoChunks(
      lines,
      SyntaxHighlightedDiffComponent.LINES_AROUND_CHANGED_CHUNK,
      SyntaxHighlightedDiffComponent.MIN_LINES_BETWEEN_CHUNKS_BEFORE_COLLAPSING,
      this.args.shouldCollapseUnchangedLines,
    );
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

  get expandedComments() {
    if (this.lineNumberWithExpandedComments === null) {
      return [];
    } else {
      return this.topLevelCommentsGroupedByLine[this.lineNumberWithExpandedComments] || [];
    }
  }

  get highlightedHtml() {
    return this.asyncHighlightedHTML || this.temporaryHTML;
  }

  get temporaryHTML() {
    const linesHTML = this.codeLinesWithTypes.map(([line]) => `<span>${escapeHtml(line)}</span>`).join('');

    return `<pre><code>${linesHTML}</code></pre>`;
  }

  get topLevelComments() {
    return (this.args.comments || []).filter((comment) => comment.isTopLevelComment && !comment.isNew);
  }

  get topLevelCommentsGroupedByLine() {
    return groupBy(this.args.comments || [], (comment) => comment.subtargetEndLine || 0);
  }

  commentTargetsLine(comment, lineNumber) {
    return lineNumber <= comment.subtargetEndLine && lineNumber >= comment.subtargetStartLine;
  }

  @action
  handleDidUpdateCode() {
    this.highlightCode();
  }

  @action
  handleToggleCommentsButtonClick(lineNumber) {
    if (this.lineNumberWithExpandedComments === lineNumber) {
      this.lineNumberWithExpandedComments = null;
    } else {
      this.lineNumberWithExpandedComments = lineNumber;

      (this.topLevelCommentsGroupedByLine[lineNumber] || []).forEach((comment) => {
        this.args.onCommentView && this.args.onCommentView(comment);
      });
    }
  }

  highlightCode() {
    let highlighterPromise = getOrCreateCachedHighlighterPromise(
      SyntaxHighlightedDiffComponent.highlighterId,
      SyntaxHighlightedDiffComponent.highlighterOptions,
    );

    highlighterPromise.then((highlighter) => {
      highlighter.loadLanguage(this.args.language).then(() => {
        this.asyncHighlightedHTML = highlighter.codeToHtml(this.codeWithoutDiffMarkers, { lang: this.args.language });
      });
    });
  }

  static preloadHighlighter() {
    preloadHighlighter(this.highlighterId, this.highlighterOptions);
  }

  targetingCommentsForLine(lineNumber) {
    return (this.args.comments || []).filter((comment) => this.commentTargetsLine(comment, lineNumber));
  }
}
