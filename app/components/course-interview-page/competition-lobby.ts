import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type PartnerCompetitionModel from 'codecrafters-frontend/models/partner-competition';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type VoiceInterviewService from 'codecrafters-frontend/services/voice-interview';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    competition: PartnerCompetitionModel;
    isResuming: boolean;
    isStarting: boolean;
    onCaptionsToggle: () => void;
    onStartButtonClick: () => void;
    repository: RepositoryModel;
    shouldShowCaptions: boolean;
  };
}

export default class CourseInterviewPageCompetitionLobby extends Component<Signature> {
  @service declare voiceInterview: VoiceInterviewService;

  get microphoneIsBlocked(): boolean {
    return this.voiceInterview.microphoneStatus === 'blocked';
  }

  get shouldDisableStartButton(): boolean {
    return this.args.isStarting || this.stagesCompleted.length === 0;
  }

  get stagesCompleted(): CourseStageModel[] {
    return this.args.competition.stagesCompletedDuringCompetition(this.args.repository);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::CompetitionLobby': typeof CourseInterviewPageCompetitionLobby;
  }
}
