import Component from '@glimmer/component';
import type InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

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

export default class CourseInterviewPageLobby extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::Lobby': typeof CourseInterviewPageLobby;
  }
}
