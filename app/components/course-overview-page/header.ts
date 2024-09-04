import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };

  Blocks: {
    cta?: [];
  };
}

export default class CourseOverviewPageHeaderComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::Header': typeof CourseOverviewPageHeaderComponent;
  }
}
