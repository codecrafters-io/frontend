import Component from '@glimmer/component';
import { service } from '@ember/service';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class CurrentStepCompletePill extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  get activeStep() {
    return this.coursePageState.activeStep;
  }

  get nextStep() {
    return this.coursePageState.nextStep;
  }

  get targetStep() {
    if (!this.nextStep) {
      return this.activeStep;
    }

    if (this.nextStep.type === 'BaseStagesCompletedStep' || this.nextStep.type === 'CourseCompletedStep') {
      return this.nextStep;
    }

    return this.activeStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CurrentStepCompletePill': typeof CurrentStepCompletePill;
  }
}
