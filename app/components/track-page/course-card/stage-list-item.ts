import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    isComplete: boolean;
    stage: CourseStageModel;
  };
}

export default class StageListItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::StageListItem': typeof StageListItem;
  }
}
