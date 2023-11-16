import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class AffiliateReferredUsersContainerComponent extends Component {
  @tracked unpaidReferralsAreVisible = false;

  get affiliateLink() {
    return this.args.affiliateLink;
  }

  get paidReferrals() {
    return this.affiliateLink.visibleReferrals.filter((referral) => referral.spentAmountInDollars > 0);
  }

  get unpaidReferrals() {
    return this.affiliateLink.visibleReferrals.filter((referral) => !referral.spentAmountInDollars);
  }
}
