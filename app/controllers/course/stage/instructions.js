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

  get isActiveStage() {
    return this.model.activeRepository.activeStage === this.model.courseStage;
  }

  get shouldShowTestFailureExpectedHint() {
    return this.model.courseStage.isFirst && this.currentStep.status !== 'complete';
  }

  get shouldShowUpgradePrompt() {
    return (
      this.isActiveStage && this.currentStep.status !== 'complete' && !this.model.activeRepository.user.canAttemptCourseStage(this.model.courseStage)
    );
  }
}
