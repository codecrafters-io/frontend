import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import { service } from '@ember/service';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    activeStep: StepDefinition;
  };
}

export default class CurrentStepCompleteModal extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare featureFlags: FeatureFlagsService;

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get currentStepAsCourseStageStep() {
    return this.coursePageState.currentStepAsCourseStageStep;
  }

  get nextStep() {
    return this.coursePageState.nextStep;
  }

  get stepForNextOrActiveStepButton() {
    return this.nextStep?.type === 'BaseStagesCompletedStep' || this.nextStep?.type === 'CourseCompletedStep'
      ? this.nextStep
      : this.args.activeStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CurrentStepCompleteModal': typeof CurrentStepCompleteModal;
  }
}
