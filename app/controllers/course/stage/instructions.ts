import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import { action } from '@ember/object';

export default class CourseStageInstructionsController extends Controller {
  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;

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

  get shouldShowLanguageGuide() {
    return !this.model.courseStage.isFirst && this.authenticator.currentUser?.isStaff;
  }

  get shouldShowPrerequisites() {
    return !!this.prerequisiteInstructionsMarkdown;
  }

  get shouldShowTestFailureExpectedHint() {
    return this.model.courseStage.isFirst && this.currentStep.status !== 'complete';
  }

  get shouldShowTestRunnerCard() {
    return this.isCurrentStage && this.currentStep.status !== 'complete';
  }

  get shouldShowUpgradePrompt() {
    return this.currentStep.status !== 'complete' && !this.model.activeRepository.user.canAttemptCourseStage(this.model.courseStage);
  }

  get testRunnerCardIsCollapsible() {
    return this.currentStep.testsStatus !== 'passed' || this.currentStep.courseStage.isFirst;
  }

  @action
  handleCommentListFilterToggled() {
    this.commentListIsFilteredByLanguage = !this.commentListIsFilteredByLanguage;
  }

  @action
  handleTestRunnerCardExpandedOnFirstStage() {
    document.getElementById('first-stage-instructions-card')?.scrollIntoView({ behavior: 'smooth' });
  }
}
