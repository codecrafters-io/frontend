import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title: string;
    descriptionMarkdown: string;
    stages: CourseStageModel[];
  };
}

export default class CourseOverviewPageStageListCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::StageListCard': typeof CourseOverviewPageStageListCard;
  }
}
