import Component from '@glimmer/component';
import PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
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
      regionalDiscount: RegionalDiscountModel | null;
      promotionalDiscount: PromotionalDiscountModel | null;
    };
  };
}

export default class ConfigureCheckoutSessionModal extends Component<Signature> {
  @service declare store: Store;
  @tracked extraInvoiceDetailsRequested = false;
  @tracked isCreatingCheckoutSession = false;

  @action
  async handleProceedToCheckoutButtonClick() {
    this.isCreatingCheckoutSession = true;

    const checkoutSession = this.store.createRecord('individual-checkout-session', {
      cancelUrl: `${window.location.origin}/pay`,
      extraInvoiceDetailsRequested: this.extraInvoiceDetailsRequested,
      pricingFrequency: this.args.additionalCheckoutSessionProperties.pricingFrequency,
      promotionalDiscount: this.args.additionalCheckoutSessionProperties.promotionalDiscount,
      regionalDiscount: this.args.additionalCheckoutSessionProperties.regionalDiscount,
      successUrl: `${window.location.origin}/tracks`,
    });

    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ConfigureCheckoutSessionModal': typeof ConfigureCheckoutSessionModal;
  }
}
