import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type UserModel from 'codecrafters-frontend/models/user';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;
}

export default class EarningsContainerComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @tracked isCreatingPayout = false;
  @tracked isLoadingPayouts = true;

  constructor(owner: unknown, args: object) {
    super(owner, args);
    this.loadPayouts();
  }

  get currentUser() {
    return this.authenticator.currentUser as UserModel; // We know the user is logged in at this point
  }

  get lineItems() {
    return [
      {
        title: 'Pending',
        helpText: 'Earnings that are being withheld for upto 14 days to account for refunds / admin.',
        amountInDollars: this.pendingEarningsAmountInCents / 100,
      },
      {
        title: 'Ready to payout',
        helpText: 'Earnings that can be withdrawn.',
        amountInDollars: this.readyToPayoutEarningsAmountInCents / 100,
      },
      {
        title: 'Paid out',
        helpText: 'Earnings that have been paid out (some payouts might be in progress).',
        amountInDollars: this.paidOutEarningsAmountInCents / 100,
      },
    ];
  }

  get paidOutEarningsAmountInCents() {
    return this.currentUser.affiliateEarningsPayouts
      .rejectBy('statusIsFailed')
      .mapBy('amountInCents')
      .reduce((a, b) => a + b, 0);
  }

  get pendingEarningsAmountInCents() {
    const withheldEarningsAmountInCents = this.currentUser.affiliateLinks.mapBy('withheldEarningsAmountInCents').reduce((a, b) => a + b, 0);
    const totalUnpaidEarningsAmountInCents = Math.max(0, this.totalEarningsAmountInCents - this.paidOutEarningsAmountInCents);

    // We only render "pending" earnings if we haven't paid out more than the user's total earnings.
    return Math.min(withheldEarningsAmountInCents, totalUnpaidEarningsAmountInCents);
  }

  get readyToPayoutEarningsAmountInCents() {
    return Math.max(this.withdrawableEarningsAmountInCents - this.paidOutEarningsAmountInCents, 0);
  }

  get totalEarningsAmountInCents() {
    return this.currentUser.affiliateLinks.mapBy('totalEarningsAmountInCents').reduce((a, b) => a + b, 0);
  }

  get totalEarningsAmountInDollars() {
    return this.totalEarningsAmountInCents / 100;
  }

  get withdrawableEarningsAmountInCents() {
    return this.currentUser.affiliateLinks.mapBy('withdrawableEarningsAmountInCents').reduce((a, b) => a + b, 0);
  }

  get withdrawableEarningsAmountInDollars() {
    return this.withdrawableEarningsAmountInCents / 100;
  }

  @action
  handleCreatePayoutModalClose() {
    this.isCreatingPayout = false;
  }

  async loadPayouts() {
    await this.store.findAll('affiliate-earnings-payout', { include: 'user' });
    this.isLoadingPayouts = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::EarningsContainer': typeof EarningsContainerComponent;
  }
}
