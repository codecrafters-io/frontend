import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    stage: CourseStageModel;
  };
}

export default class Header extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::Header': typeof Header;
  }
}
