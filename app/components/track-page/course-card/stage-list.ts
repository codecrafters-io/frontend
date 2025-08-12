import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    completedStages: CourseStageModel[];
    course: CourseModel;
  };
}

export default class StageList extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::StageList': typeof StageList;
  }
}
