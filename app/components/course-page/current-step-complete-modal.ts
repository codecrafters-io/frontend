import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type RouterService from '@ember/routing/router-service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    activeStep: Step;
  };
}

export default class CurrentStepCompleteModalComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare router: RouterService;

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get currentStepAsCourseStageStep() {
    return this.currentStep as CourseStageStep;
  }

  get nextStep() {
    return this.coursePageState.nextStep;
  }

  get shouldShowFeedbackPrompt() {
    return this.currentStep.type === 'CourseStageStep' && !this.currentStepAsCourseStageStep.courseStage.isFirst;
  }

  @action
  handleFeedbackPromptSubmit() {
    // @ts-expect-error transitionTo types are wrong?
    this.router.transitionTo(this.args.activeStep.routeParams.route, ...this.args.activeStep.routeParams.models);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CurrentStepCompleteModal': typeof CurrentStepCompleteModalComponent;
  }
}
