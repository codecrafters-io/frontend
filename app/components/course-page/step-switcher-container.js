import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class StepSwitcherComponent extends Component {
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get nextStep() {
    return this.args.stepList.nextVisibleStepFor(this.args.currentStep);
  }

  get previousStep() {
    return this.args.stepList.previousVisibleStepFor(this.args.currentStep);
  }
}
