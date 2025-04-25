import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    stage: CourseStageModel;
  };
}

export default class StageListItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleInsightsIndexPage::StageListItem': typeof StageListItemComponent;
  }
}
