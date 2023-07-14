import Controller from '@ember/controller';

export default class CourseSetupController extends Controller {
  get currentStep() {
    return this.model.stepList.steps[this.model.stepList.steps.length - 1];
  }
}
