import Component from '@glimmer/component';
import type InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type VoiceInterviewService from 'codecrafters-frontend/services/voice-interview';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isStarting: boolean;
    milestone: InterviewMilestone;
    onCaptionsToggle: () => void;
    onStartButtonClick: () => void;
    repository: RepositoryModel;
    shouldShowCaptions: boolean;
  };
}

export default class CourseInterviewPageLobby extends Component<Signature> {
  @service declare voiceInterview: VoiceInterviewService;

  get microphoneIsBlocked(): boolean {
    return this.voiceInterview.microphoneStatus === 'blocked';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::Lobby': typeof CourseInterviewPageLobby;
  }
}
