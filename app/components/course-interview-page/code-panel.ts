import Component from '@glimmer/component';
import type VoiceInterviewService from 'codecrafters-frontend/services/voice-interview';
import type { ChallengeInterviewCodeFile } from 'codecrafters-frontend/models/challenge-interview';
import type { LineRange } from 'codecrafters-frontend/components/code-mirror';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    codeFiles: ChallengeInterviewCodeFile[];
  };
}

export default class CourseInterviewPageCodePanel extends Component<Signature> {
  @service declare voiceInterview: VoiceInterviewService;

  @tracked selectedPath: string | null = null;

  #scrollContainer: HTMLElement | null = null;

  get activeFile(): ChallengeInterviewCodeFile | null {
    return this.args.codeFiles.find((file) => file.path === this.selectedPath) || this.args.codeFiles[0] || null;
  }

  get highlightedPath(): string | null {
    return this.voiceInterview.codeHighlight?.path || null;
  }

  get highlightedRanges(): LineRange[] {
    const highlight = this.voiceInterview.codeHighlight;

    if (!highlight || highlight.path !== this.activeFile?.path) {
      return [];
    }

    return [{ endLine: highlight.endLine, startLine: highlight.startLine }];
  }

  @action
  handleCodeHighlightDidChange(): void {
    const highlight = this.voiceInterview.codeHighlight;

    if (!highlight) {
      return;
    }

    this.selectedPath = highlight.path;

    // CodeMirror renders the new document asynchronously, so wait two frames before measuring lines.
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => this.#scrollToLine(highlight.startLine)));
  }

  @action
  handleDidInsertScrollContainer(element: HTMLElement): void {
    this.#scrollContainer = element;
  }

  @action
  handleFileTabClick(path: string): void {
    this.selectedPath = path;
  }

  #scrollToLine(lineNumber: number): void {
    const container = this.#scrollContainer;
    const content = container?.querySelector('.cm-content');
    const line = container?.querySelector('.cm-line');

    if (!container || !content || !line) {
      return;
    }

    const lineHeight = line.getBoundingClientRect().height || 20;
    const contentTop = content.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    const targetTop = contentTop + (lineNumber - 1) * lineHeight - container.clientHeight / 3;

    container.scrollTo({ behavior: 'smooth', top: Math.max(0, targetTop) });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::CodePanel': typeof CourseInterviewPageCodePanel;
  }
}
