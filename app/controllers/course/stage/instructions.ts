import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';

export default class CourseStageInstructionsController extends Controller {
  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;
  @service declare router: RouterService;

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

  get prerequisiteInstructionsMarkdown() {
    return this.model.courseStage.prerequisiteInstructionsMarkdownFor(this.model.activeRepository);
  }

  get shouldShowFeedbackPrompt() {
    return !this.currentStep.courseStage.isFirst && this.currentStep.status === 'complete';
  }

  get shouldShowLanguageGuide() {
    return !this.model.courseStage.isFirst && this.authenticator.currentUser?.isStaff;
  }

  get shouldShowPrerequisites() {
    return !!this.prerequisiteInstructionsMarkdown;
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
    document.getElementById('first-stage-instructions-card')?.scrollIntoView({ behavior: 'smooth' });
  }
}
