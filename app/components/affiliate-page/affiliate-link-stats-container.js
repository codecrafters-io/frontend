import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class AffiliateLinkStatsContainerComponent extends Component {
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get paidUsersCount() {
    return this.args.affiliateLink.referrals.filter((referral) => referral.spentAmountInDollars > 0).uniqBy('customer').length;
  }
}
