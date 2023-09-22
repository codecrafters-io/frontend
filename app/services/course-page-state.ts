import Service, { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { StepList, Step } from 'codecrafters-frontend/lib/course-page-step-list';
import { tracked } from '@glimmer/tracking';
import CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';

export default class CoursePageStateService extends Service {
  @service declare router: RouterService;
  @tracked stepList?: StepList;

  get activeStep(): Step {
    return this.stepList!.activeStep as Step;
  }

  // Since the currentStep might be empty during a route transition, we return `activeStep` as a fallback to prevent errors.
  // All operations that might require a route change are expected to call `navigateToActiveStepIfCurrentStepIsInvalid` if needed.
  get currentStep(): Step {
    return this.currentStepSansFallback || this.activeStep;
  }

  // The "true" current step, without any fallbacks.
  get currentStepSansFallback(): Step | null {
    if (this.router.currentRouteName === 'course.introduction') {
      return this.stepList!.steps[0] || null;
    } else if (this.router.currentRouteName === 'course.setup') {
      return this.stepList!.steps[1] || null;
    } else if (this.router.currentRouteName === 'course.completed') {
      return this.stepList!.steps[this.stepList!.steps.length - 1] || null;
    } else if (this.router.currentRouteName && this.router.currentRouteName.startsWith('course.stage')) {
      const courseStageRoute = this.router.currentRoute.find((route: any) => route.name === 'course.stage');

      const routeParams = courseStageRoute!.params as { stage_identifier: string };
      const stageIdentifier = routeParams.stage_identifier;

      return (
        this.stepList!.steps.find(
          (step) => step.type === 'CourseStageStep' && (step as CourseStageStep).courseStage.identifierForURL === stageIdentifier,
        ) || null
      );
    } else {
      return null;
    }
  }

  get nextStep(): Step | null {
    if (!this.stepList) {
      // @ts-ignore
      return null;
    }

    return this.stepList.nextVisibleStepFor(this.currentStep);
  }

  navigateToActiveStepIfCurrentStepIsInvalid(): void {
    if (!this.currentStepSansFallback) {
      // @ts-ignore
      this.router.transitionTo(this.activeStep.routeParams.route, ...this.activeStep.routeParams.models);
    }
  }

  setStepList(stepList: StepList): void {
    this.stepList = stepList;
  }
}
