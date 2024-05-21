import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLElement;

  Args: {
    course: CourseModel;
  };
}

export default class CourseLogoComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseLogo: typeof CourseLogoComponent;
  }
}
