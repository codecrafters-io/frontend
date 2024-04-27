import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import type TeamPaymentFlowModel from 'codecrafters-frontend/models/team-payment-flow';
import Store from '@ember-data/store';
import type InvoiceModel from 'codecrafters-frontend/models/invoice';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    teamPaymentFlow: TeamPaymentFlowModel;
  };
}

export default class ReviewPaymentStepContainer extends Component<Signature> {
  @tracked declare errorMessage: string | null;
  @tracked declare firstInvoicePreview: InvoiceModel;
  @tracked isAttemptingPayment = false;
  @tracked isLoadingFirstInvoicePreview = true;
  @service declare store: Store;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.loadFirstInvoicePreview();
  }

  get perUnitAmountInDollarsInFirstInvoicePreview() {
    return this.firstInvoicePreview.lineItems[0]!.amount_after_discounts / this.subscriptionQuantityInFirstInvoicePreview / 100;
  }

  get subscriptionQuantityInFirstInvoicePreview() {
    return this.firstInvoicePreview.lineItems[0]!.quantity;
  }

  @action
  async handleContinueButtonClick() {
    this.errorMessage = null;
    this.isAttemptingPayment = true;

    const response = await this.args.teamPaymentFlow.attemptPayment({});
    this.isAttemptingPayment = false;

    if ('error' in response) {
      this.errorMessage = response.error;
    } else {
      this.store.pushPayload(response);
    }
  }

  @action
  async loadFirstInvoicePreview() {
    this.firstInvoicePreview = await this.args.teamPaymentFlow.fetchFirstInvoicePreview({});
    this.isLoadingFirstInvoicePreview = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::ReviewPaymentStepContainer': typeof ReviewPaymentStepContainer;
  }
}
