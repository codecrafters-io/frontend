import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import bankTransferImage from '/assets/images/payout-method-logos/bank-transfer.svg';
import paypalImage from '/assets/images/payout-method-logos/paypal.svg';

export default class CreatePayoutModalComponent extends Component {
  bankTransferImage = bankTransferImage;
  paypalImage = paypalImage;

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
