import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    stage: CourseStageModel;
    isComplete?: boolean;
    isCurrent?: boolean;
    isLast?: boolean;
  };
}

export default class StageListCardListItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::StageListCard::ListItem': typeof StageListCardListItem;
  }
}
