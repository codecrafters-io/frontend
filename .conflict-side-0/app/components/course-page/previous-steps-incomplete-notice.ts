import Component from '@glimmer/component';
import { service } from '@ember/service';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    step: StepDefinition;
  };
}

export default class PreviousStepsIncompleteNotice extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  get activeStep() {
    return this.coursePageState.activeStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::PreviousStepsIncompleteNotice': typeof PreviousStepsIncompleteNotice;
  }
}
