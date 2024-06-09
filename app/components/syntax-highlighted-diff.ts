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
import type EmberConcurrencyRegistry from 'ember-concurrency/template-registry';
import { service } from '@ember/service';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';

/**
 * Time to wait at the end of `highlightCode` task before allowing a new run to be performed
 */
const DELAY_BETWEEN_HIGHLIGHT_CODE_TASKS_IN_MS: number = 100;

type Signature = {
  Element: HTMLDivElement;

  Args: {
    code: string;
    comments: CommunityCourseStageSolutionCommentModel[];
    language: string;
    shouldCollapseUnchangedLines: boolean;
    forceDarkTheme?: boolean;
    onCommentView?: (comment: CommunityCourseStageSolutionCommentModel) => void;
  };
};

interface HighlightCodeParams {
  isDarkMode?: boolean;
  forceDarkTheme?: boolean;
  language?: string;
  codeWithoutDiffMarkers?: string;
}

class HighlightCodeParamsCache implements HighlightCodeParams {
  isDarkMode?: boolean;
  forceDarkTheme?: boolean;
  language?: string;
  codeWithoutDiffMarkers?: string;

  compareWithParams({ isDarkMode, forceDarkTheme, language, codeWithoutDiffMarkers }: HighlightCodeParams): boolean {
    return (
      this.isDarkMode === isDarkMode &&
      this.forceDarkTheme === forceDarkTheme &&
      this.language === language &&
      this.codeWithoutDiffMarkers === codeWithoutDiffMarkers
    );
  }

  setParams({ isDarkMode, forceDarkTheme, language, codeWithoutDiffMarkers }: HighlightCodeParams): void {
    this.isDarkMode = isDarkMode;
    this.forceDarkTheme = forceDarkTheme;
    this.language = language;
    this.codeWithoutDiffMarkers = codeWithoutDiffMarkers;
  }
}

export default class SyntaxHighlightedDiffComponent extends Component<Signature> {
  @service declare darkMode: DarkModeService;

  @tracked asyncHighlightedHTML: string | null = null;
  @tracked asyncHighlightedCode: string | null = null;
  @tracked lineNumberWithExpandedComments: number | null = null;

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
    // Read all dependent parameters into local constants
    const {
      codeWithoutDiffMarkers,
      args: { code, language, forceDarkTheme },
      darkMode: { isEnabled: isDarkMode },
    } = this;

    // Return if nothing changed since last render
    if (
      this.#lastHighlightCodeParams.compareWithParams({
        isDarkMode,
        forceDarkTheme,
        language,
        codeWithoutDiffMarkers,
      })
    ) {
      return;
    }

    // Decide whether to actually use the dark theme
    const useDarkTheme = !!(isDarkMode || forceDarkTheme);

    // Prepare the highlighter promise
    const highlighterPromise = getOrCreateCachedHighlighterPromise(
      useDarkTheme ? SyntaxHighlightedDiffComponent.highlighterIdForDarkMode : SyntaxHighlightedDiffComponent.highlighterIdForLightMode,
      useDarkTheme ? SyntaxHighlightedDiffComponent.highlighterOptionsForDarkMode : SyntaxHighlightedDiffComponent.highlighterOptionsForLightMode,
    );

    // Wait for the highlighter promise to load
    const highlighter = await highlighterPromise;

    // Wait for the language to load
    await highlighter.loadLanguage(language as shiki.BundledLanguage | shiki.LanguageInput | shiki.SpecialLanguage);

    // Format the code and use it
    this.asyncHighlightedHTML = highlighter.codeToHtml(codeWithoutDiffMarkers, {
      lang: language,
      theme: useDarkTheme
        ? (SyntaxHighlightedDiffComponent.highlighterOptionsForDarkMode.themes[0] as string)
        : (SyntaxHighlightedDiffComponent.highlighterOptionsForLightMode.themes[0] as string),
      transformers: [transformerNotationDiff()],
    });

    // Remember which code we've last formatted
    this.asyncHighlightedCode = code;

    // Remember all parameters used for this task run
    this.#lastHighlightCodeParams.setParams({
      isDarkMode,
      forceDarkTheme,
      language,
      codeWithoutDiffMarkers,
    });

    // Ensure we don't run this task too often
    await timeout(DELAY_BETWEEN_HIGHLIGHT_CODE_TASKS_IN_MS);
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
  export default interface Registry extends EmberConcurrencyRegistry {
    SyntaxHighlightedDiff: typeof SyntaxHighlightedDiffComponent;
  }
}
