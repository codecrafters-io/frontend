import Component from '@glimmer/component';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    affiliateLink: AffiliateLinkModel;
  };
}

export default class AffiliateReferredUsersContainerComponent extends Component<Signature> {
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::AffiliateReferredUsersContainer': typeof AffiliateReferredUsersContainerComponent;
  }
}
