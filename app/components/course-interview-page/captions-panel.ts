import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type InterviewCaptionLine from 'codecrafters-frontend/utils/interview-caption-line';
import type VoiceInterviewService from 'codecrafters-frontend/services/voice-interview';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isVisible: boolean;
  };
}

export default class CourseInterviewPageCaptionsPanel extends Component<Signature> {
  @service declare voiceInterview: VoiceInterviewService;

  fade = fade;

  get latestLine(): InterviewCaptionLine | null {
    return this.shownLines.at(-1) || null;
  }

  get latestLineWords(): string[] {
    return this.latestLine?.visibleText.match(/\S+\s*/g) || [];
  }

  // A one-item list so each new line re-renders its words and replays their fade-in.
  get latestLines(): InterviewCaptionLine[] {
    return this.latestLine ? [this.latestLine] : [];
  }

  get previousLine(): InterviewCaptionLine | null {
    return this.shownLines.at(-2) || null;
  }

  get shouldShowListeningIndicator(): boolean {
    return this.voiceInterview.isLive && this.voiceInterview.mode === 'listening';
  }

  get shownLines(): InterviewCaptionLine[] {
    return this.voiceInterview.captionLines.filter((line) => line.visibleText !== '');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::CaptionsPanel': typeof CourseInterviewPageCaptionsPanel;
  }
}
