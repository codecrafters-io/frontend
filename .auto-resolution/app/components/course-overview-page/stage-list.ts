import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Args: {
    course: CourseModel;
    completedStages?: CourseStageModel[];
  };
}

export default class StageList extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::StageList': typeof StageList;
  }
}
