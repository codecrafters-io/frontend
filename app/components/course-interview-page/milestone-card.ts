import Component from '@glimmer/component';
import type InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    milestone: InterviewMilestone;
    repository: RepositoryModel;
  };
}

export default class CourseInterviewPageMilestoneCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::MilestoneCard': typeof CourseInterviewPageMilestoneCard;
  }
}
