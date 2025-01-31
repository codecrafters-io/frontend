import Component from '@glimmer/component';
import bankTransferImage from '/assets/images/payout-method-logos/bank-transfer.svg';
import paypalImage from '/assets/images/payout-method-logos/paypal.svg';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    withdrawableEarningsAmountInCents: number;
  };
}

export default class CreatePayoutModalComponent extends Component<Signature> {
  bankTransferImage = bankTransferImage;
  paypalImage = paypalImage;

  @service declare authenticator: AuthenticatorService;
  @tracked selectedPayoutMethod: 'paypal' | null = null;
  @tracked payoutWasCreated = false;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  handlePayoutCreated() {
    this.payoutWasCreated = true;
  }

  @action
  handlePayoutMethodClick(payoutMethod: 'paypal') {
    if (this.selectedPayoutMethod === payoutMethod) {
      this.selectedPayoutMethod = null;
    } else {
      this.selectedPayoutMethod = payoutMethod;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::CreatePayoutModal': typeof CreatePayoutModalComponent;
  }
}
