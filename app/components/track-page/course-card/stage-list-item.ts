import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isComplete: boolean;
    stage: CourseStageModel;
  };
};

export default class StageListItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::StageListItem': typeof StageListItemComponent;
  }
}
