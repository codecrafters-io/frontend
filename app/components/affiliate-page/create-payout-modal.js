import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import paypalImage from '/assets/images/payout-method-logos/paypal.svg';
import amazonImage from '/assets/images/payout-method-logos/amazon-com.png';

export default class CreatePayoutModalComponent extends Component {
  paypalImage = paypalImage;
  amazonImage = amazonImage;

  @service authenticator;
  @tracked selectedPayoutMethod = null;
  @tracked payoutWasCreated = false;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  handlePayoutCreated() {
    this.payoutWasCreated = true;
  }

  @action
  handlePayoutMethodClick(payoutMethod) {
    if (this.selectedPayoutMethod === payoutMethod) {
      this.selectedPayoutMethod = null;
    } else {
      this.selectedPayoutMethod = payoutMethod;
    }
  }
}
