import { service } from '@ember/service';
import Component from '@glimmer/component';
import type SetupStep from 'codecrafters-frontend/utils/course-page-step-list/setup-step';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type RouterService from '@ember/routing/router-service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    step: SetupStep;
  };
}

export default class StepPreviouslyCompletedScreenComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare router: RouterService;

  get activeStep() {
    return this.coursePageState.activeStep;
  }

  get nextStep() {
    return this.coursePageState.nextStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStepCompleteModal::StepPreviouslyCompletedScreen': typeof StepPreviouslyCompletedScreenComponent;
  }
}
