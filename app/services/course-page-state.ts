import Service, { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { StepDefinition, StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import { tracked } from '@glimmer/tracking';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

export default class CoursePageStateService extends Service {
  @service declare router: RouterService;
  @tracked stepList?: StepListDefinition;
  @tracked testResultsBarIsExpanded = false;

  @tracked manuallyCompletedStepIdsInFirstStageInstructions: string[] = [];
  @tracked manuallyCompletedStepIdsInSecondStageInstructions: string[] = [];

  // The active step is the step that the user is currently working on.
  // It might not be the same as the "current" step, which is the step that the user is currently viewing.
  get activeStep(): StepDefinition {
    if (!this.stepList) {
      // This triggers as a global failure in tests for some reason
      // @ts-expect-error returning null instead of StepDefinition
      return null;
    }

    return this.stepList!.activeStep as StepDefinition;
  }

  get activeStepAsCourseStageStep(): CourseStageStep {
    return this.activeStep as CourseStageStep;
  }

  // Since the currentStep might be empty during a route transition, we return `activeStep` as a fallback to prevent errors.
  // All operations that might require a route change are expected to call `navigateToActiveStepIfCurrentStepIsInvalid` if needed.
  get currentStep(): StepDefinition {
    return this.currentStepSansFallback || this.activeStep;
  }

  get currentStepAsCourseStageStep(): CourseStageStep {
    return this.currentStep as CourseStageStep;
  }

  // The "true" current step, without any fallbacks.
  get currentStepSansFallback(): StepDefinition | null {
    if (this.router.currentRouteName === 'course.introduction') {
      return this.stepList!.visibleStepByType('IntroductionStep') || null;
    } else if (this.router.currentRouteName === 'course.setup') {
      return this.stepList!.visibleStepByType('SetupStep') || null;
    } else if (this.router.currentRouteName === 'course.completed') {
      return this.stepList!.visibleStepByType('CourseCompletedStep') || null;
    } else if (this.router.currentRouteName === 'course.base-stages-completed') {
      return this.stepList!.visibleStepByType('BaseStagesCompletedStep') || null;
    } else if (this.router.currentRouteName && this.router.currentRouteName.startsWith('course.stage')) {
      const courseStageRoute = this.router.currentRoute.find((route: { name: string }) => route.name === 'course.stage');

      const routeParams = courseStageRoute!.params as { stage_slug: string };

      return (
        this.stepList!.steps.find(
          (step) => step.type === 'CourseStageStep' && (step as CourseStageStep).courseStage.slug === routeParams.stage_slug,
        ) || null
      );
    } else {
      return null;
    }
  }

  get nextStep(): StepDefinition | null {
    if (!this.stepList) {
      return null;
    }

    return this.stepList.nextVisibleStepFor(this.currentStep);
  }

  get stepAfterNextStep(): StepDefinition | null {
    if (!this.nextStep || !this.stepList) {
      return null;
    }

    return this.stepList.nextVisibleStepFor(this.nextStep);
  }

  get stepListAsStepListDefinition(): StepListDefinition {
    return this.stepList!;
  }

  navigateToActiveStepIfCurrentStepIsInvalid(): void {
    if (!this.currentStepSansFallback) {
      // @ts-expect-error router transitionTo not properly typed with spread arguments
      this.router.transitionTo(this.activeStep.routeParams.route, ...this.activeStep.routeParams.models);
    }
  }

  recordManuallyCompletedStepInFirstStageInstructions(stepId: string): void {
    this.manuallyCompletedStepIdsInFirstStageInstructions = [...this.manuallyCompletedStepIdsInFirstStageInstructions, stepId].uniq();
  }

  recordManuallyCompletedStepInSecondStageInstructions(stepId: string): void {
    this.manuallyCompletedStepIdsInSecondStageInstructions = [...this.manuallyCompletedStepIdsInSecondStageInstructions, stepId].uniq();
  }

  resetManuallyCompletedSteps(): void {
    this.manuallyCompletedStepIdsInFirstStageInstructions = [];
    this.manuallyCompletedStepIdsInSecondStageInstructions = [];
  }

  setStepList(newStepList: StepListDefinition): void {
    if (newStepList.repository !== this.stepList?.repository) {
      this.resetManuallyCompletedSteps();
    }

    this.stepList = newStepList;
  }
}
