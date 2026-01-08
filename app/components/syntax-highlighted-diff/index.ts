import * as shiki from 'shiki';
import Component from '@glimmer/component';
import getOrCreateCachedHighlighterPromise, { preloadHighlighter } from 'codecrafters-frontend/utils/highlighter-cache';
import groupDiffLinesIntoChunks, { type Line } from 'codecrafters-frontend/utils/group-diff-lines-into-chunks';
import type CommunityCourseStageSolutionCommentModel from 'codecrafters-frontend/models/community-course-stage-solution-comment';
import { action } from '@ember/object';
import { escapeHtml, zip } from 'codecrafters-frontend/utils/lodash-utils';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { transformerNotationDiff } from '@shikijs/transformers';
import { task, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import groupByFieldReducer from 'codecrafters-frontend/utils/group-by-field-reducer';

/**
 * Time to wait at the end of `highlightCode` task before allowing a new run to be performed
 */
const DELAY_BETWEEN_HIGHLIGHT_CODE_TASKS_IN_MS: number = 100;

type DiffLineType = 'added' | 'removed' | 'unchanged';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    code: string;
    comments?: CommunityCourseStageSolutionCommentModel[];
    forceDarkTheme?: boolean;
    language: string;
    onCommentView?: (comment: CommunityCourseStageSolutionCommentModel) => void;
    shouldCollapseUnchangedLines: boolean;
  };
}

class HighlightCodeParams {
  theme: 'dark' | 'light';
  language: string;
  codeWithoutDiffMarkers: string;

  constructor(args: { theme: 'dark' | 'light'; language: string; codeWithoutDiffMarkers: string }) {
    this.theme = args.theme;
    this.language = args.language;
    this.codeWithoutDiffMarkers = args.codeWithoutDiffMarkers;
  }

  equals(other: HighlightCodeParams): boolean {
    return this.theme === other.theme && this.language === other.language && this.codeWithoutDiffMarkers === other.codeWithoutDiffMarkers;
  }
}

export default class SyntaxHighlightedDiff extends Component<Signature> {
  @service declare darkMode: DarkModeService;

  @tracked asyncHighlightedHTML: string | null = null;
  @tracked lastHighlightCodeParams: HighlightCodeParams | undefined;
  @tracked lineNumberWithExpandedComments: number | null = null;

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

    const zippedLines = zip(this.codeLinesWithTypes, highlightedLineNodes);

    const lines = zippedLines.map(([codeLineWithType, node], index) => {
      const lineType = codeLineWithType?.[1] ?? 'unchanged';

      return {
        isFirstLineOfFile: index === 0,
        isLastLineOfFile: index === zippedLines.length - 1,
        isTargetedByComments: this.targetingCommentsForLine(index + 1).length > 0,
        isTargetedByExpandedComments: this.expandedComments.some((comment) => this.commentTargetsLine(comment, index + 1)),
        html: htmlSafe(`${node?.outerHTML ?? ''}`),
        type: lineType,
        number: index + 1,
        comments: this.topLevelCommentsGroupedByLine[index + 1] || [],
        hasComments: (this.topLevelCommentsGroupedByLine[index + 1] || []).length > 0,
        commentsAreExpanded: this.lineNumberWithExpandedComments === index + 1,
      };
    }) as unknown as Line[];

    return groupDiffLinesIntoChunks(
      lines,
      SyntaxHighlightedDiff.LINES_AROUND_CHANGED_CHUNK,
      SyntaxHighlightedDiff.MIN_LINES_BETWEEN_CHUNKS_BEFORE_COLLAPSING,
      this.args.shouldCollapseUnchangedLines,
    );
  }

  get codeLinesWithTypes(): Array<[string, DiffLineType]> {
    return this.args.code
      .trim()
      .split('\n')
      .filter((line) => !line.startsWith('@@'))
      .map((line) => {
        if (line.startsWith('+')) {
          return [line.substring(1), 'added'] as [string, DiffLineType];
        } else if (line.startsWith('-')) {
          return [line.substring(1), 'removed'] as [string, DiffLineType];
        } else if (line.startsWith(' ')) {
          return [line.substring(1), 'unchanged'] as [string, DiffLineType];
        } else {
          // shouldn't happen?
          return [line, 'unchanged'] as [string, DiffLineType];
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

  get highlightCodeParams() {
    return new HighlightCodeParams({
      codeWithoutDiffMarkers: this.codeWithoutDiffMarkers,
      language: this.args.language,
      theme: this.darkMode.isEnabled || this.args.forceDarkTheme ? 'dark' : 'light',
    });
  }

  get highlightedHtml() {
    if (this.lastHighlightCodeParams?.equals(this.highlightCodeParams)) {
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
    return (this.args.comments || []).reduce(
      groupByFieldReducer((comment) => comment.subtargetEndLine || 0),
      {},
    );
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
        if (this.args.onCommentView) {
          this.args.onCommentView(comment);
        }
      });
    }
  }

  highlightCode = task({ keepLatest: true }, async (): Promise<void> => {
    // Read all dependent parameters into local constants
    const highlightCodeParams = this.highlightCodeParams;

    // Return if nothing changed since last render
    if (this.lastHighlightCodeParams?.equals(highlightCodeParams)) {
      return;
    }

    // Prepare the highlighter promise
    const highlighterPromise = getOrCreateCachedHighlighterPromise(
      highlightCodeParams.theme === 'dark' ? SyntaxHighlightedDiff.highlighterIdForDarkMode : SyntaxHighlightedDiff.highlighterIdForLightMode,
      highlightCodeParams.theme === 'dark'
        ? SyntaxHighlightedDiff.highlighterOptionsForDarkMode
        : SyntaxHighlightedDiff.highlighterOptionsForLightMode,
    );

    // Wait for the highlighter promise to load
    const highlighter = await highlighterPromise;

    // Wait for the language to load
    await highlighter.loadLanguage(highlightCodeParams.language as shiki.BundledLanguage | shiki.LanguageInput | shiki.SpecialLanguage);

    // Format the code and use it
    this.asyncHighlightedHTML = highlighter.codeToHtml(highlightCodeParams.codeWithoutDiffMarkers, {
      lang: highlightCodeParams.language,
      theme:
        highlightCodeParams.theme === 'dark'
          ? (SyntaxHighlightedDiff.highlighterOptionsForDarkMode.themes[0] as string)
          : (SyntaxHighlightedDiff.highlighterOptionsForLightMode.themes[0] as string),
      transformers: [transformerNotationDiff()],
    });

    // Remember all parameters used for this task run
    this.lastHighlightCodeParams = highlightCodeParams;

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
  export default interface Registry {
    SyntaxHighlightedDiff: typeof SyntaxHighlightedDiff;
  }
}
