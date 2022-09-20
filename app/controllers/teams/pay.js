import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { tracked } from '@glimmer/tracking';

export default class TeamsPayController extends Controller {
  @tracked currentStep = 1;

  get completedSteps() {
    return [this.isStep1Complete ? 1 : null, this.isStep2Complete ? 2 : null, this.isStep3Complete ? 3 : null].compact();
  }

  get isStep1Complete() {
    return false;
  }

  get isStep2Complete() {
    return false;
  }

  get isStep3Complete() {
    return false;
  }

  @action
  handleContinueButtonClick() {
    if (this.completedSteps.includes(this.currentStep)) {
      this.currentStep += 1;
    }
  }

  @action
  handleNavigationItemClick(step) {
    if (step === 1 || this.completedSteps.includes(step - 1)) {
      this.currentStep = step;
    }
  }
}
