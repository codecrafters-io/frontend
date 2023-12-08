import Component from '@glimmer/component';
import RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import Store from '@ember-data/store';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    onClose: () => void;

    additionalCheckoutSessionProperties: {
      pricingFrequency: string;
      regionalDiscount?: RegionalDiscountModel;
      earlyBirdDiscountEnabled?: boolean;
      referralDiscountEnabled?: boolean;
    };
  };
}

export default class ConfigureCheckoutSessionModal extends Component<Signature> {
  @service declare store: Store;
  @tracked isExtraInvoiceDetailsRequested = false;
  @tracked isCreatingCheckoutSession = false;

  @action
  async handleProceedToCheckoutButtonClick() {
    this.isCreatingCheckoutSession = true;

    const checkoutSession = this.store.createRecord('individual-checkout-session', {
      autoRenewSubscription: false, // None of our plans are subscriptions at the moment
      regionalDiscount: this.args.additionalCheckoutSessionProperties.regionalDiscount,
      earlyBirdDiscountEnabled: this.args.additionalCheckoutSessionProperties.earlyBirdDiscountEnabled,
      referralDiscountEnabled: this.args.additionalCheckoutSessionProperties.referralDiscountEnabled,
      extraInvoiceDetailsRequested: this.isExtraInvoiceDetailsRequested,
      successUrl: `${window.location.origin}/tracks`,
      cancelUrl: `${window.location.origin}/pay`,
      pricingFrequency: this.args.additionalCheckoutSessionProperties.pricingFrequency,
    });

    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }

  @action
  handleToggleClick() {
    this.isExtraInvoiceDetailsRequested = !this.isExtraInvoiceDetailsRequested;
  }
}
