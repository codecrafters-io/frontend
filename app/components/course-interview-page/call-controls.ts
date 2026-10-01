import Component from '@glimmer/component';
import type VoiceInterviewService from 'codecrafters-frontend/services/voice-interview';
import { action } from '@ember/object';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onCaptionsToggle: () => void;
    shouldShowCaptions: boolean;
  };
}

export default class CourseInterviewPageCallControls extends Component<Signature> {
  @service declare voiceInterview: VoiceInterviewService;

  @action
  handleMuteButtonClick(): void {
    this.voiceInterview.toggleMute();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::CallControls': typeof CourseInterviewPageCallControls;
  }
}
