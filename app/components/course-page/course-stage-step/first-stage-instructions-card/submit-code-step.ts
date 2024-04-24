import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isComplete: boolean;
  };
}

export default class SubmitCodeStepComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageInstructionsCard::SubmitCodeStep': typeof SubmitCodeStepComponent;
  }
}
