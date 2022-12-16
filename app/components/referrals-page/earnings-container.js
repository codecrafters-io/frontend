import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class EarningsContainerComponent extends Component {
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }

  get lineItems() {
    return [
      {
        title: 'Pending',
        helpText: 'Earnings that are being withheld for upto 14 days to account for refunds / admin.',
        amountInDollars: this.currentUser.referralLinks.mapBy('withheldEarningsAmountInCents').reduce((a, b) => a + b, 0) / 100,
      },
      {
        title: 'Ready to payout',
        helpText: 'Earnings that can be withdrawn.',
        amountInDollars: this.currentUser.referralLinks.mapBy('withdrawableEarningsAmountInCents').reduce((a, b) => a + b, 0) / 100,
      },
      {
        title: 'Paid out',
        helpText: 'Earnings that have been paid out (some payouts might be in progress).',
        amountInDollars: 0,
      },
    ];
  }

  get totalEarningsAmountInCents() {
    return this.currentUser.referralLinks.mapBy('totalEarningsAmountInCents').reduce((a, b) => a + b, 0);
  }

  get totalEarningsAmountInDollars() {
    return this.totalEarningsAmountInCents / 100;
  }
}
