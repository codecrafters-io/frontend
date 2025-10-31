import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    completedStages?: CourseStageModel[];
  };
}

export default class CourseOverviewPageStageCardList extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::StageCardList': typeof CourseOverviewPageStageCardList;
  }
}
