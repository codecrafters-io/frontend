import Component from '@glimmer/component';
import type VoiceInterviewService from 'codecrafters-frontend/services/voice-interview';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isDisabled?: boolean;
    isStarting: boolean;
    onCaptionsToggle: () => void;
    onStartButtonClick: () => void;
    shouldShowCaptions: boolean;
    startButtonLabel: string;
  };
}

export default class CourseInterviewPageLobbyActions extends Component<Signature> {
  @service declare voiceInterview: VoiceInterviewService;

  get isMicrophoneBlocked(): boolean {
    return this.voiceInterview.microphoneStatus === 'blocked';
  }

  get isStartButtonDisabled(): boolean {
    return this.args.isStarting || Boolean(this.args.isDisabled);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::LobbyActions': typeof CourseInterviewPageLobbyActions;
  }
}
