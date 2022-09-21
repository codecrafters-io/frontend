import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { loadStripe } from '@stripe/stripe-js';
import { inject as service } from '@ember/service';

export default class ReviewPaymentStepContainer extends Component {
  @tracked errorMessage;
  @tracked isAttemptingPayment = false;
  @service store;

  @action
  async handleContinueButtonClick() {
    this.errorMessage = null;
    this.isAttemptingPayment = true;
    let response = await this.args.teamPaymentFlow.attemptPayment();
    this.isAttemptingPayment = false;

    if (response.error) {
      this.errorMessage = response.error;
    } else {
      console.log('handle success');
    }
  }
}
