import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    stage: CourseStageModel;
  };
};

export default class HeaderComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::Header': typeof HeaderComponent;
  }
}
