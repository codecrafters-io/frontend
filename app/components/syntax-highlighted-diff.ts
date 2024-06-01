import * as shiki from 'shiki';
import Component from '@glimmer/component';
import getOrCreateCachedHighlighterPromise, { preloadHighlighter } from 'codecrafters-frontend/utils/highlighter-cache';
import groupDiffLinesIntoChunks from 'codecrafters-frontend/utils/group-diff-lines-into-chunks';
import type CommunityCourseStageSolutionCommentModel from 'codecrafters-frontend/models/community-course-stage-solution-comment';
import { action } from '@ember/object';
import { escapeHtml, groupBy, zip } from 'codecrafters-frontend/utils/lodash-utils';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { transformerNotationDiff } from '@shikijs/transformers';
import { task, timeout } from 'ember-concurrency';

/**
 * Method to use for delaying `highlightCode` task execution:
 * - `restartable` cancels all queued calls before they have a chance to execute, executes only the latest call: causes much less unnecessary task executions
 * - `keepLatest` always executes first & last queued calls, cancelling the ones in-between: might be more reliable but always triggers rendering twice
 */
const HIGHLIGHT_CODE_TASK_TIMEOUT_METHOD: 'keepLatest' | 'restartable' = 'restartable';

/**
 * Timeout used for `restartable` method
 */
const HIGHLIGHT_CODE_TASK_TIMEOUT_PRE: number = 10;

/**
 * Timeout used for `keepLatest` method
 */
const HIGHLIGHT_CODE_TASK_TIMEOUT_POST: number = 100;

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

interface HighlightCodeParams {
  isDarkMode?: boolean;
  language?: string;
  codeWithoutDiffMarkers?: string;
}

class HighlightCodeParamsCache implements HighlightCodeParams {
  isDarkMode?: boolean;
  language?: string;
  codeWithoutDiffMarkers?: string;

  compareWithParams({ isDarkMode, language, codeWithoutDiffMarkers }: HighlightCodeParams): boolean {
    return this.isDarkMode === isDarkMode && this.language === language && this.codeWithoutDiffMarkers === codeWithoutDiffMarkers;
  }

  setParams({ isDarkMode, language, codeWithoutDiffMarkers }: HighlightCodeParams): void {
    this.isDarkMode = isDarkMode;
    this.language = language;
    this.codeWithoutDiffMarkers = codeWithoutDiffMarkers;
  }
}

export default class SyntaxHighlightedDiffComponent extends Component<Signature> {
  @tracked asyncHighlightedHTML: string | null = null;
  @tracked asyncHighlightedCode: string | null = null;
  @tracked lineNumberWithExpandedComments: number | null = null;

  /**
   * Current Dark Mode environment setting, reported by `is-dark-mode` modifier
   * and used by `highlightCode` task to decide which mode to format code with
   * @private
   */
  #isDarkMode: boolean | undefined = undefined;

  /**
   * The last parameters used for formatting & rendering the code
   * @private
   */
  #lastHighlightCodeParams: HighlightCodeParamsCache = new HighlightCodeParamsCache();

  static highlighterIdForDarkMode = 'syntax-highlighted-diff-dark';
  static highlighterIdForLightMode = 'syntax-highlighted-diff-light';
  static highlighterOptionsForDarkMode = { themes: ['github-dark'], langs: [] };
  static highlighterOptionsForLightMode = { themes: ['github-light'], langs: [] };
  static LINES_AROUND_CHANGED_CHUNK = 3;
  static MIN_LINES_BETWEEN_CHUNKS_BEFORE_COLLAPSING = 4;

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
      .filter((line) => !line.startsWith('@@'))
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
    if (!comment.subtargetStartLine || !comment.subtargetEndLine) {
      return false;
    }

    return lineNumber <= comment.subtargetEndLine && lineNumber >= comment.subtargetStartLine;
  }

  @action
  handleDidUpdateCode() {
    this.highlightCode.perform();
  }

  @action
  handleIsDarkModeUpdate(isDarkMode: boolean) {
    this.#isDarkMode = isDarkMode;
    this.highlightCode.perform();
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

  highlightCode = task({ [HIGHLIGHT_CODE_TASK_TIMEOUT_METHOD]: true }, async (): Promise<void> => {
    // For "restartable" to have immediate effect for sequential calls
    if (HIGHLIGHT_CODE_TASK_TIMEOUT_METHOD === 'restartable') {
      await timeout(HIGHLIGHT_CODE_TASK_TIMEOUT_PRE);
    }

    // Read all dependent parameters into local constants
    const {
      #isDarkMode: isDarkMode,
      codeWithoutDiffMarkers,
      args: { code, language },
    } = this;

    // Return if not ready to highlight yet
    if (isDarkMode === undefined) {
      return;
    }

    // Return if nothing changed since last render
    if (
      this.#lastHighlightCodeParams.compareWithParams({
        isDarkMode: isDarkMode,
        language: language,
        codeWithoutDiffMarkers: codeWithoutDiffMarkers,
      })
    ) {
      return;
    }

    // Prepare the highlighter promise
    const highlighterPromise = getOrCreateCachedHighlighterPromise(
      isDarkMode ? SyntaxHighlightedDiffComponent.highlighterIdForDarkMode : SyntaxHighlightedDiffComponent.highlighterIdForLightMode,
      isDarkMode ? SyntaxHighlightedDiffComponent.highlighterOptionsForDarkMode : SyntaxHighlightedDiffComponent.highlighterOptionsForLightMode,
    );

    // Wait for the highlighter promise to load
    const highlighter = await highlighterPromise;

    // Wait for the language to load
    await highlighter.loadLanguage(language as shiki.BundledLanguage | shiki.LanguageInput | shiki.SpecialLanguage);

    // Format the code and use it
    this.asyncHighlightedHTML = highlighter.codeToHtml(codeWithoutDiffMarkers, {
      lang: language,
      theme: isDarkMode
        ? (SyntaxHighlightedDiffComponent.highlighterOptionsForDarkMode.themes[0] as string)
        : (SyntaxHighlightedDiffComponent.highlighterOptionsForLightMode.themes[0] as string),
      transformers: [transformerNotationDiff()],
    });

    // Remember which code we've last formatted
    this.asyncHighlightedCode = code;

    // Remember all paramteters used for this task run
    this.#lastHighlightCodeParams.setParams({
      isDarkMode: isDarkMode,
      language: language,
      codeWithoutDiffMarkers: codeWithoutDiffMarkers,
    });

    // Ensure we don't run this task too often when `keepLatest` is used
    if (HIGHLIGHT_CODE_TASK_TIMEOUT_METHOD === 'keepLatest') {
      await timeout(HIGHLIGHT_CODE_TASK_TIMEOUT_POST);
    }
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
