import { service } from '@ember/service';
import Component from '@glimmer/component';
import type Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    activeStep: Step;
  };
}

export default class CurrentStepCompleteModalComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get nextStep() {
    return this.coursePageState.nextStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CurrentStepCompleteModal': typeof CurrentStepCompleteModalComponent;
  }
}
