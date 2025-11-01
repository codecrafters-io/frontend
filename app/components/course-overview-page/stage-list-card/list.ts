import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    stages: CourseStageModel[];
    completedStages?: CourseStageModel[];
    currentStage?: CourseStageModel;
  };
}

export default class StageListCardList extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::StageListCard::List': typeof StageListCardList;
  }
}
