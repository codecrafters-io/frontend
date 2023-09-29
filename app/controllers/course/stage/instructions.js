import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class CourseStageInstructionsController extends Controller {
  @service coursePageState;

  get badgeAwards() {
    return this.model.activeRepository.user.badgeAwards.filter((badgeAward) => {
      // @ts-ignore
      return (
        badgeAward.submission.repository.id === this.model.activeRepository.id && badgeAward.submission.courseStage.id === this.model.courseStage.id
      );
    });
  }

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get isCurrentStage() {
    return this.model.activeRepository.currentStage === this.model.courseStage;
  }

  get shouldShowCLIUsageInstructions() {
    return this.model.courseStage.isThird;
  }

  get shouldShowTestFailureExpectedHint() {
    return this.model.courseStage.isFirst && this.currentStep.status !== 'complete';
  }

  get shouldShowUpgradePrompt() {
    return (
      this.isCurrentStage && this.currentStep.status !== 'complete' && !this.model.activeRepository.user.canAttemptCourseStage(this.model.courseStage)
    );
  }
}
