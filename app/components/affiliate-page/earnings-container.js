import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EarningsContainerComponent extends Component {
  @service authenticator;
  @service store;
  @tracked isCreatingPayout = false;
  @tracked isLoadingPayouts = true;

  constructor() {
    super(...arguments);
    this.loadPayouts();
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get lineItems() {
    return [
      {
        title: 'Pending',
        helpText: 'Earnings that are being withheld for upto 14 days to account for refunds / admin.',
        amountInDollars: this.currentUser.affiliateLinks.mapBy('withheldEarningsAmountInCents').reduce((a, b) => a + b, 0) / 100,
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
    return this.currentUser.referralEarningsPayouts
      .rejectBy('statusIsFailed')
      .mapBy('amountInCents')
      .reduce((a, b) => a + b, 0);
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
    await this.store.findAll('referral-earnings-payout', { include: 'user' });
    this.isLoadingPayouts = false;
  }
}
