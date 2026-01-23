import { action } from '@ember/object';
import type Owner from '@ember/owner';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import window from 'ember-window-mock';
import Component from '@glimmer/component';
import type Store from '@ember-data/store';
import type TeamModel from 'codecrafters-frontend/models/team';
import type InvoiceModel from 'codecrafters-frontend/models/invoice';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    team: TeamModel;
  };
}

export default class TeamPageSetupSubscriptionContainer extends Component<Signature> {
  @service declare store: Store;

  @tracked isCreatingSubscription = false;
  @tracked isCreatingPaymentMethodUpdateRequest = false;
  @tracked isLoadingFirstInvoicePreview = true;
  @tracked firstInvoicePreview: InvoiceModel | null = null;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);
    this.loadFirstInvoicePreview();
  }

  get perUnitAmountInDollarsInFirstInvoicePreview() {
    return this.firstInvoicePreview!.lineItems[0]!.amount_after_discounts / this.subscriptionQuantityInFirstInvoicePreview / 100;
  }

  get subscriptionQuantityInFirstInvoicePreview() {
    return this.firstInvoicePreview!.lineItems[0]!.quantity;
  }

  @action
  async handleAddPaymentMethodButtonClick() {
    this.isCreatingPaymentMethodUpdateRequest = true;
    const paymentMethodUpdateRequest = await this.store.createRecord('team-payment-method-update-request', { team: this.args.team }).save();
    window.location.href = paymentMethodUpdateRequest.url;
  }

  @action
  async handleStartSubscriptionButtonClick() {
    this.isCreatingSubscription = true;
    await this.store.createRecord('team-subscription', { team: this.args.team }).save();
    this.isCreatingSubscription = false;
  }

  @action
  async loadFirstInvoicePreview() {
    this.firstInvoicePreview = await this.args.team.fetchFirstInvoicePreview({});
    this.isLoadingFirstInvoicePreview = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::SetupSubscriptionContainer': typeof TeamPageSetupSubscriptionContainer;
  }
}
