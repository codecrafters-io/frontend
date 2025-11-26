import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';

export default class CourseStageInstructionsController extends Controller {
  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare router: RouterService;
  @service declare store: Store;

  @tracked commentListIsFilteredByLanguage = true;

  declare model: {
    courseStage: CourseStageModel;
    activeRepository: RepositoryModel;
  };

  get currentCourse() {
    return this.model.courseStage.course;
  }

  get currentStep(): CourseStageStep {
    return this.coursePageState.currentStep as CourseStageStep;
  }

  get isCurrentStage() {
    return this.model.activeRepository.currentStage === this.model.courseStage;
  }

  get prerequisiteInstructionsMarkdown() {
    return this.model.courseStage.prerequisiteInstructionsMarkdownFor(this.model.activeRepository);
  }

  get shouldShowFeedbackPrompt() {
    return !this.currentStep.courseStage.isFirst && this.currentStep.status === 'complete';
  }

  get shouldShowPrerequisites() {
    return !!this.prerequisiteInstructionsMarkdown;
  }

  get shouldShowTestRunnerCard() {
    return this.isCurrentStage && this.currentStep.status !== 'complete' && this.currentStep.testsStatus !== 'passed';
  }

  get shouldShowUpgradePrompt() {
    return this.currentStep.status !== 'complete' && !this.model.activeRepository.user.canAttemptCourseStage(this.model.courseStage);
  }

  @action
  handleCommentListFilterToggled() {
    this.commentListIsFilteredByLanguage = !this.commentListIsFilteredByLanguage;
  }

  @action
  handleDidUpdateTestsStatus(_element: HTMLDivElement, [newTestsStatus]: [CourseStageStep['testsStatus']]) {
    if (this.featureFlags.canViewAutofixFlow) {
      // For tests passed, let's collapse the test results bar and scroll all the way to the top
      if (newTestsStatus === 'passed') {
        this.coursePageState.testResultsBarIsExpanded = false;
        document.getElementById('course-page-scrollable-area')?.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // When tests are run, let's expand the test results bar. It'll automatically collapse when tests pass.
      if (
        newTestsStatus === 'evaluating' &&
        this.model.activeRepository.lastSubmission &&
        !this.model.activeRepository.lastSubmission.clientTypeIsSystem
      ) {
        this.coursePageState.testResultsBarIsExpanded = true;
      }
    } else {
      // For tests passed, let's scroll all the way to the top
      if (newTestsStatus === 'passed') {
        document.getElementById('course-page-scrollable-area')?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  @action
  handleStageFeedbackSubmitted() {
    const nextStep = this.coursePageState.nextStep;
    const stepAfterNextStep = this.coursePageState.stepAfterNextStep;
    const activeStep = this.coursePageState.activeStep;

    if (nextStep === activeStep) {
      this.router.transitionTo(activeStep.routeParams.route, activeStep.routeParams.models);

      return;
    }

    // If the "active step" is after a "BaseStagesCompletedStep", navigate to "BaseStagesCompletedStep" instead.
    if (nextStep?.type === 'BaseStagesCompletedStep' && stepAfterNextStep === activeStep) {
      // @ts-expect-error Ember dosn't support types for variadic arguments
      this.router.transitionTo(nextStep.routeParams.route, ...nextStep.routeParams.models);
    }
  }
}
