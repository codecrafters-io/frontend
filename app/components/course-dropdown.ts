import { action } from '@ember/object';
import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type { Dropdown } from 'ember-basic-dropdown/components/basic-dropdown';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    courses: CourseModel[];
    requestedCourse: CourseModel | null; // This is highlighted with an exclamation mark if it's not the selected one
    selectedCourse: CourseModel | null;
    onDidInsertDropdown?: (dropdown: Dropdown | null) => void;
    onRequestedCourseChange: (course: CourseModel) => void;
  };
}

export default class CourseDropdownComponent extends Component<Signature> {
  @action
  handleCourseDropdownLinkClick(course: CourseModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onRequestedCourseChange(course);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseDropdown: typeof CourseDropdownComponent;
  }
}
