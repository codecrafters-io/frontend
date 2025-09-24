import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type TeamPaymentFlowModel from 'codecrafters-frontend/models/team-payment-flow';
import type InvoiceModel from 'codecrafters-frontend/models/invoice';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    teamPaymentFlow: TeamPaymentFlowModel;
  };

  Blocks: {
    default: [];
  };
}

export default class PaymentPreview extends Component<Signature> {
  @tracked declare firstInvoicePreview: InvoiceModel;
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
  async loadFirstInvoicePreview() {
    this.firstInvoicePreview = await this.args.teamPaymentFlow.fetchFirstInvoicePreview({});
    this.isLoadingFirstInvoicePreview = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::PaymentPreview': typeof PaymentPreview;
  }
}
