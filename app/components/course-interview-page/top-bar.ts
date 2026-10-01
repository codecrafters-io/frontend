import Component from '@glimmer/component';
import logomarkDark from '/assets/images/logo/logomark-dark.svg';
import type InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    milestone: InterviewMilestone;
    onEndInterviewButtonClick: () => void;
    remainingSeconds: number;
    repository: RepositoryModel;
    shouldShowCallControls: boolean;
  };
}

export default class CourseInterviewPageTopBar extends Component<Signature> {
  logomarkDark = logomarkDark;

  get formattedRemainingTime(): string {
    const minutes = Math.floor(this.args.remainingSeconds / 60);
    const seconds = this.args.remainingSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  get isRunningOutOfTime(): boolean {
    return this.args.remainingSeconds <= 60;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::TopBar': typeof CourseInterviewPageTopBar;
  }
}
