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
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';
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

  get badgeAwards() {
    return this.model.activeRepository.courseStageCompletions.filterBy('courseStage', this.model.courseStage).flatMap((courseStageCompletion) => {
      return courseStageCompletion.badgeAwards;
    });
  }

  get currentStep(): CourseStageStep {
    return this.coursePageState.currentStep as CourseStageStep;
  }

  get isCurrentStage() {
    return this.model.activeRepository.currentStage === this.model.courseStage;
  }

  get languageGuide() {
    return this.model.courseStage.languageGuides.findBy('language', this.model.activeRepository.language);
  }

  get prerequisiteInstructionsMarkdown() {
    return this.model.courseStage.prerequisiteInstructionsMarkdownFor(this.model.activeRepository);
  }

  get shouldShowFeedbackPrompt() {
    return !this.currentStep.courseStage.isFirst && this.currentStep.status === 'complete';
  }

  get shouldShowLanguageGuide() {
    return !this.model.courseStage.isFirst && !!this.languageGuide;
  }

  get shouldShowPrerequisites() {
    return !!this.prerequisiteInstructionsMarkdown;
  }

  get shouldShowStage2Solution() {
    return this.featureFlags.canSeeSolutionsForStage2 && !!this.model.activeRepository.secondStageSolution;
  }

  get shouldShowTestRunnerCard() {
    return this.isCurrentStage && this.currentStep.status !== 'complete';
  }

  get shouldShowUpgradePrompt() {
    return this.currentStep.status !== 'complete' && !this.model.activeRepository.user.canAttemptCourseStage(this.model.courseStage);
  }

  get shouldSuppressTestRunnerCardExpands() {
    return this.model.courseStage.isFirst && this.currentStep.testsStatus !== 'passed';
  }

  @action
  handleCommentListFilterToggled() {
    this.commentListIsFilteredByLanguage = !this.commentListIsFilteredByLanguage;
  }

  @action
  handleDidUpdateTestsStatus(_element: HTMLDivElement, [newTestsStatus]: [CourseStageStep['testsStatus']]) {
    if (newTestsStatus === 'evaluating') {
      // Ensure the new test runner card is in DOM (it shifts around when the tests status changes)
      next(() => {
        document.getElementById('test-runner-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }

    // For tests passed, let's scroll all the way to the top
    if (newTestsStatus === 'passed') {
      document.getElementById('course-page-scrollable-area')?.scrollTo({ top: 0, behavior: 'smooth' });
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

  @action
  handleTestRunnerCardExpandedOnFirstStage() {
    document.getElementById('first-stage-tutorial-card')?.scrollIntoView({ behavior: 'smooth' });
  }

  @action
  loadLanguageGuides(): void {
    this.loadLanguageGuidesTask.perform();
  }

  loadLanguageGuidesTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.store.query('course-stage-language-guide', {
      course_stage_id: this.model.courseStage.id,
      include: 'course-stage,language',
    });
  });
}
