import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import getOrCreateCachedHighlighterPromise, { preloadHighlighter } from '../lib/highlighter-cache';
import { escapeHtml, groupBy, zip } from '../lib/lodash-utils';
import { action } from '@ember/object';

export default class SyntaxHighlightedDiffComponent extends Component {
  @tracked asyncHighlightedHTML;
  @tracked lineNumberWithExpandedComments = null;

  static highlighterId = 'syntax-highlighted-diff';
  static highlighterOptions = { theme: 'github-light', langs: [] };

  constructor() {
    super(...arguments);

    this.highlightCode();
  }

  get chunksForRender() {
    const highlightedLineNodes = Array.from(new DOMParser().parseFromString(this.highlightedHtml, 'text/html').querySelector('pre code').children);

    const lines = zip(this.codeLinesWithTypes, highlightedLineNodes).map(([[, lineType], node], index) => {
      return {
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

    return this.groupIntoChunks(lines);
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

  getActualTargetCount(start, end, lines) {
    let actualTargetCount = 0;

    for (let i = start; i < end; i++) {
      if (lines[i].type === 'added' || lines[i].type === 'removed') {
        actualTargetCount += 1;
      }
    }

    return actualTargetCount;
  }

  getNextTargetInfo(start, lines) {
    let nextTargetInfo = { isPresent: false, index: null };

    for (let i = start; i < lines.length; i++) {
      if (lines[i].type === 'added' || lines[i].type === 'removed') {
        nextTargetInfo.isPresent = true;
        nextTargetInfo.index = i;
        break;
      }
    }

    return nextTargetInfo;
  }

  groupIntoChunks(lines) {
    let start = 0;
    let end;
    let nextTargetInfo = this.getNextTargetInfo(start, lines);
    let chunks = [];
    let currentChunkLines = [];

    while (nextTargetInfo.isPresent) {
      // First, check if there are no changes three lines before the next target.
      // A target is the line with 'added' or 'removed' type.
      // If there are no changes, then get the collapsed chunk.
      if (nextTargetInfo.index - 3 > start) {
        end = nextTargetInfo.index - 3;

        for (let i = start; i <= end; i++) {
          currentChunkLines.push(lines[i]);
        }

        let isAtTopOfFile = false;

        for (const chunkLine of currentChunkLines) {
          if (chunkLine.number === 1) {
            isAtTopOfFile = true;
          }
        }

        chunks.push({ isAtTopOfFile, isCollapsed: true, lines: currentChunkLines });
        currentChunkLines = [];
        start = end;
      }

      // Next, get the expanded chunk.
      if (nextTargetInfo.index - 3 <= start) {
        end = Math.min(nextTargetInfo.index + 3 + 1, lines.length);
        let actualTargetCount = this.getActualTargetCount(start, end, lines);
        let expectedTargetCount = 1;

        // Update the end index while the actual target count is not equal to the expected target count.
        while (actualTargetCount !== expectedTargetCount) {
          expectedTargetCount = actualTargetCount;
          nextTargetInfo = this.getNextTargetInfo(nextTargetInfo.index + 1, lines);
          actualTargetCount = this.getActualTargetCount(start, end, lines);
        }

        for (let i = start; i < end; i++) {
          currentChunkLines.push(lines[i]);
        }

        chunks.push({ lines: currentChunkLines, isCollapsed: false });
        currentChunkLines = [];
        start = end;
      }

      nextTargetInfo = this.getNextTargetInfo(start, lines);
    }

    // Lastly, if there are still lines left three lines after the last target, get the collapsed chunk.
    if (start !== lines.length) {
      for (let i = start; i < lines.length; i++) {
        currentChunkLines.push(lines[i]);
      }

      chunks.push({ isAtBottomOfFile: true, isCollapsed: true, lines: currentChunkLines });
    }

    return chunks;
  }

  @action
  handleDidUpdateCode() {
    this.highlightCode();
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
