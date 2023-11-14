import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import { format } from 'date-fns';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLElement;

  Args: {
    freeUsageGrants: FreeUsageGrantModel[];
    referralLink: ReferralLinkModel;
  };
}

export default class ReferralLinkStatsContainerComponent extends Component<Signature> {
  @service authenticator!: AuthenticatorService;

  get activeFreeUsageGrantsCount() {
    return this.args.freeUsageGrants.filter((grant) => !grant.isActive && !grant.isExpired).length;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get freeUsageGrantsCount() {
    return this.args.freeUsageGrants.length;
  }

  get freeUsageGrantsExpireAt() {
    // @ts-ignore
    const expiresAt = this.args.freeUsageGrants.sortBy('expiresAt').lastObject.expiresAt;

    return format(expiresAt, 'dd MMM yyyy');
  }

  get userHasActiveFreeUsageGrants() {
    return this.activeFreeUsageGrantsCount > 0;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralLinkStatsContainer': typeof ReferralLinkStatsContainerComponent;
  }
}
