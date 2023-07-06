import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class CourseStageInstructionsController extends Controller {
  @service coursePageState;

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get shouldShowFirstStageHints() {
    return this.coursePageState.currentStep.courseStage.isFirst && this.coursePageState.currentStep.status !== 'complete';
  }
}
