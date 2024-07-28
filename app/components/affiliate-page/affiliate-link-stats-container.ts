import Component from '@glimmer/component';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    affiliateLink: AffiliateLinkModel;
  };
}

export default class AffiliateLinkStatsContainerComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get paidUsersCount() {
    return this.args.affiliateLink.referrals.filter((referral) => referral.spentAmountInDollars > 0).uniqBy('customer').length;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::AffiliateLinkStatsContainer': typeof AffiliateLinkStatsContainerComponent;
  }
}
