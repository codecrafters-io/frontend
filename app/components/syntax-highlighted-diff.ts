import * as shiki from 'shiki';
import Component from '@glimmer/component';
import getOrCreateCachedHighlighterPromise, { preloadHighlighter } from 'codecrafters-frontend/utils/highlighter-cache';
import groupDiffLinesIntoChunks from 'codecrafters-frontend/utils/group-diff-lines-into-chunks';
import type CommunityCourseStageSolutionCommentModel from 'codecrafters-frontend/models/community-course-stage-solution-comment';
import { action } from '@ember/object';
import { escapeHtml, groupBy, zip } from 'codecrafters-frontend/utils/lodash-utils';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    code: string;
    comments: CommunityCourseStageSolutionCommentModel[];
    language: string;
    shouldCollapseUnchangedLines: boolean;
    onCommentView?: (comment: CommunityCourseStageSolutionCommentModel) => void;
  };
};

export default class SyntaxHighlightedDiffComponent extends Component<Signature> {
  @tracked asyncHighlightedHTML: string | null = null;
  @tracked asyncHighlightedCode: string | null = null;
  @tracked lineNumberWithExpandedComments: number | null = null;
  @tracked isDarkMode: boolean | undefined = undefined;

  static highlighterIdForDarkMode = 'syntax-highlighted-diff-dark';
  static highlighterIdForLightMode = 'syntax-highlighted-diff-light';
  static highlighterOptionsForDarkMode = { theme: 'github-dark', langs: [] };
  static highlighterOptionsForLightMode = { theme: 'github-light', langs: [] };
  static LINES_AROUND_CHANGED_CHUNK = 3;
  static MIN_LINES_BETWEEN_CHUNKS_BEFORE_COLLAPSING = 4;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.highlightCode.perform();
  }

  get chunksForRender() {
    const parsedHtml = new DOMParser().parseFromString(this.highlightedHtml, 'text/html');
    const preCodeElement = parsedHtml.querySelector('pre code');
    const highlightedLineNodes = preCodeElement ? Array.from(preCodeElement.children) : [];

    const lines = zip(this.codeLinesWithTypes, highlightedLineNodes).map(([[, lineType], node], index) => {
      return {
        isFirstLineOfFile: index === 0,
        isLastLineOfFile: index === this.codeLinesWithTypes.length - 1,
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
      .filter((line) => !line.startsWith("@@"))
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

  get expandedComments(): CommunityCourseStageSolutionCommentModel[] {
    if (this.lineNumberWithExpandedComments === null) {
      return [];
    } else {
      return this.topLevelCommentsGroupedByLine[this.lineNumberWithExpandedComments] || [];
    }
  }

  get highlightedHtml() {
    if (this.asyncHighlightedCode === this.args.code) {
      return this.asyncHighlightedHTML!;
    } else {
      return this.temporaryHTML;
    }
  }

  get temporaryHTML() {
    const linesHTML = this.codeLinesWithTypes.map(([line]) => `<span>${escapeHtml(line)}</span>`).join('');

    return `<pre><code>${linesHTML}</code></pre>`;
  }

  get topLevelComments() {
    return (this.args.comments || []).filter((comment) => comment.isTopLevelComment && !comment.isNew);
  }

  get topLevelCommentsGroupedByLine() {
    return groupBy(this.args.comments || [], (comment: CommunityCourseStageSolutionCommentModel) => comment.subtargetEndLine || 0);
  }

  commentTargetsLine(comment: CommunityCourseStageSolutionCommentModel, lineNumber: number) {
    return lineNumber <= comment.subtargetEndLine && lineNumber >= comment.subtargetStartLine;
  }

  @action
  handleDidUpdateCode() {
    this.highlightCode.perform();
  }

  @action
  handleIsDarkModeUpdate(isDarkMode: boolean) {
    if (isDarkMode !== this.isDarkMode) {
      // Avoid re-use in same computation bug
      next(() => {
        this.isDarkMode = isDarkMode;
        this.highlightCode.perform();
      });
    }
  }

  @action
  handleToggleCommentsButtonClick(lineNumber: number) {
    if (this.lineNumberWithExpandedComments === lineNumber) {
      this.lineNumberWithExpandedComments = null;
    } else {
      this.lineNumberWithExpandedComments = lineNumber;

      (this.topLevelCommentsGroupedByLine[lineNumber] || []).forEach((comment: CommunityCourseStageSolutionCommentModel) => {
        this.args.onCommentView && this.args.onCommentView(comment);
      });
    }
  }

  highlightCode = task({ keepLatest: true }, async (): Promise<void> => {
    if (this.isDarkMode === undefined) {
      return; // Not ready to highlight yet
    }

    const highlighterPromise = getOrCreateCachedHighlighterPromise(
      this.isDarkMode ? SyntaxHighlightedDiffComponent.highlighterIdForDarkMode : SyntaxHighlightedDiffComponent.highlighterIdForLightMode,
      this.isDarkMode ? SyntaxHighlightedDiffComponent.highlighterOptionsForDarkMode : SyntaxHighlightedDiffComponent.highlighterOptionsForLightMode,
    );

    highlighterPromise.then((highlighter) => {
      highlighter.loadLanguage(this.args.language as shiki.Lang).then(() => {
        this.asyncHighlightedHTML = highlighter.codeToHtml(this.codeWithoutDiffMarkers, { lang: this.args.language });
        this.asyncHighlightedCode = this.args.code;
      });
    });
  });

  static preloadHighlighter() {
    preloadHighlighter(this.highlighterIdForDarkMode, this.highlighterOptionsForDarkMode);
    preloadHighlighter(this.highlighterIdForLightMode, this.highlighterOptionsForLightMode);
  }

  targetingCommentsForLine(lineNumber: number) {
    return (this.args.comments || []).filter((comment) => this.commentTargetsLine(comment, lineNumber));
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SyntaxHighlightedDiff: typeof SyntaxHighlightedDiffComponent;
  }
}
