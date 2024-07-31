import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class TestimonialListComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::TestimonialList': typeof TestimonialListComponent;
  }
}
