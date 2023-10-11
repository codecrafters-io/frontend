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

  getEndIndex(initialStart, lines) {
    let isTargetInSlice;
    let start = initialStart;
    let end = Math.min(start + 3, lines.length);

    do {
      isTargetInSlice = false;

      for (let i = start; i < end; i++) {
        if (lines[i].type === 'added' || lines[i].type === 'removed') {
          isTargetInSlice = true;
          start = end;
          end = Math.min(i + 3 + 1, lines.length);
        }
      }
    } while (isTargetInSlice);

    return end;
  }

  getExpandedChunks(lines) {
    let nextTargetInfo = this.getNextTargetInfo(0, lines);
    let start = Math.max(nextTargetInfo.index - 3, 0);
    let end = this.getEndIndex(Math.min(nextTargetInfo.index + 1, lines.length - 1), lines);
    let expandedChunks = [];

    while (nextTargetInfo.isPresent) {
      expandedChunks.push({
        isCollapsed: false,
        lines: lines.slice(start, end),
      });

      nextTargetInfo = this.getNextTargetInfo(Math.min(end, lines.length), lines);
      start = Math.max(nextTargetInfo.index - 3, 0);
      end = this.getEndIndex(Math.min(nextTargetInfo.index + 1, lines.length - 1), lines);
    }

    return expandedChunks;
  }

  getNextTargetInfo(start, lines) {
    let nextTargetInfo = { isPresent: false, index: null };

    for (let i = start; i < lines.length; i++) {
      if (lines[i].type === 'added' || lines[i].type === 'removed') {
        nextTargetInfo = { isPresent: true, index: i };
        break;
      }
    }

    return nextTargetInfo;
  }

  groupIntoChunks(lines) {
    let chunks = [];
    let expandedChunks = this.getExpandedChunks(lines);
    let start = 0;
    let end;

    console.log(expandedChunks);

    for (const expandedChunk of expandedChunks) {
      if (expandedChunk.lines[0].number - 1 > start) {
        end = expandedChunk.lines[0].number - 1;
        chunks.push({
          isCollapsed: true,
          lines: lines.slice(start, end),
        });

        chunks.push(expandedChunk);
        start = expandedChunk.lines[expandedChunk.lines.length - 1].number;
      } else {
        chunks.push(expandedChunk);
        start = expandedChunk.lines[expandedChunk.lines.length - 1].number;
      }
    }

    if (start !== lines.length) {
      chunks.push({
        isCollapsed: true,
        lines: lines.slice(start, lines.length),
      });
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
