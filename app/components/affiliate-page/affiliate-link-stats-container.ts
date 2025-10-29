import Component from '@glimmer/component';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';
import uniqFieldReductor from 'codecrafters-frontend/utils/uniq-field-reductor';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    affiliateLink: AffiliateLinkModel;
  };
}

export default class AffiliateLinkStatsContainer extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get paidUsersCount() {
    return this.args.affiliateLink.referrals.filter((referral) => referral.spentAmountInDollars > 0).reduce(uniqFieldReductor('customer'), []).length;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::AffiliateLinkStatsContainer': typeof AffiliateLinkStatsContainer;
  }
}
