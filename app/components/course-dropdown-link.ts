import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    onClick: () => void;
    isSelected: boolean;
    isEnabled: boolean;
    isRequested: boolean;
  };
}

export default class CourseDropdownLink extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseDropdownLink: typeof CourseDropdownLink;
  }
}
