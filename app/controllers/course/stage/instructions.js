import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class CourseStageInstructionsController extends Controller {
  @service coursePageState;

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
    return this.isActiveStage && !this.statusIsComplete && !this.args.repository.user.canAttemptCourseStage(this.args.courseStage);
  }
}
