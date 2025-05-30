import { action } from '@ember/object';
import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    selectedCourseStage: CourseStageModel | null;
    shouldHideAllCourseStagesOption?: boolean;
    onAllCourseStagesDropdownLinkClick?: () => void;
    onSelectedCourseStageChange: (courseStage: CourseStageModel) => void;
  };
}

export default class CourseStageDropdownComponent extends Component<Signature> {
  get isAllCourseStagesOptionSelected() {
    return !this.args.selectedCourseStage;
  }

  get shouldHideAllCourseStagesOption() {
    return this.args.shouldHideAllCourseStagesOption ?? false;
  }

  @action
  handleAllCourseStagesDropdownLinkClick(closeDropdownFn: () => void) {
    closeDropdownFn();

    if (this.args.onAllCourseStagesDropdownLinkClick) {
      this.args.onAllCourseStagesDropdownLinkClick();
    }
  }

  @action
  handleStageDropdownLinkClick(courseStage: CourseStageModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onSelectedCourseStageChange(courseStage);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseStageDropdown: typeof CourseStageDropdownComponent;
  }
}
