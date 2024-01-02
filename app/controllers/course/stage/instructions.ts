import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

export default class CourseStageInstructionsController extends Controller {
  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;

  declare model: {
    courseStage: CourseStageModel;
    activeRepository: RepositoryModel;
  };

  get badgeAwards() {
    return this.model.activeRepository.user.badgeAwards.filter((badgeAward) => {
      // @ts-ignore
      return (
        badgeAward.submission.repository.id === this.model.activeRepository.id && badgeAward.submission.courseStage.id === this.model.courseStage.id
      );
    });
  }

  get currentStep(): CourseStageStep {
    return this.coursePageState.currentStep as CourseStageStep;
  }

  get isCurrentStage() {
    return this.model.activeRepository.currentStage === this.model.courseStage;
  }

  get shouldShowCLIUsageInstructions() {
    return this.model.courseStage.isSecond;
  }

  get shouldShowLanguageGuide() {
    return !this.model.courseStage.isFirst;
  }

  get shouldShowTestFailureExpectedHint() {
    return this.model.courseStage.isFirst && this.currentStep.status !== 'complete';
  }

  get shouldShowTestsPassedNotice() {
    return this.isCurrentStage && this.currentStep.testsStatus === 'passed';
  }

  get shouldShowUpgradePrompt() {
    return (
      this.isCurrentStage && this.currentStep.status !== 'complete' && !this.model.activeRepository.user.canAttemptCourseStage(this.model.courseStage)
    );
  }
}
