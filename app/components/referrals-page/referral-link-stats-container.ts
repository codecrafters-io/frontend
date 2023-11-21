import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import { inject as service } from '@ember/service';
import { format } from 'date-fns';

interface Signature {
  Element: HTMLElement;

  Args: {
    freeUsageGrants: FreeUsageGrantModel[];
    referralLink: ReferralLinkModel | undefined;
  };
}

export default class ReferralLinkStatsContainerComponent extends Component<Signature> {
  @service authenticator!: AuthenticatorService;

  get activeFreeUsageGrantsCount() {
    return this.args.freeUsageGrants.filter((grant: FreeUsageGrantModel) => grant.isExpired).length;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get lastFreeUsageGrantExpiresAt() {
    return format(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, 'dd MMM yyyy');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralLinkStatsContainer': typeof ReferralLinkStatsContainerComponent;
  }
}
