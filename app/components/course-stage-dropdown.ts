import { action } from '@ember/object';
import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    selectedCourseStage: CourseStageModel | null;
    onAllCourseStagesDropdownLinkClick?: () => void;
    onRequestedStageChange: (stage: CourseStageModel) => void;
  };
}

export default class CourseStageDropdownComponent extends Component<Signature> {
  get isAllCourseStagesOptionSelected() {
    return !this.args.selectedCourseStage;
  }

  @action
  handleAllCourseStagesDropdownLinkClick(closeDropdownFn: () => void) {
    closeDropdownFn();

    if (this.args.onAllCourseStagesDropdownLinkClick) {
      this.args.onAllCourseStagesDropdownLinkClick();
    }
  }

  @action
  handleStageDropdownLinkClick(stage: CourseStageModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onRequestedStageChange(stage);
  }
}
