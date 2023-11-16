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
    referralLink: ReferralLinkModel;
  };
}

export default class ReferralLinkStatsContainerComponent extends Component<Signature> {
  @service authenticator!: AuthenticatorService;

  get activeFreeUsageGrantsCount() {
    // @ts-ignore
    console.log(this.currentUser?.hasActiveFreeUsageGrants);
    console.log(this.args.freeUsageGrants.objectAt(0));
    console.log(this.args.freeUsageGrants.objectAt(1));

    return this.args.freeUsageGrants.filter((grant: FreeUsageGrantModel) => grant.active).length;
  }

  get activeFreeUsageGrantsExpireAt() {
    return format(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, 'dd MMM yyyy');
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralLinkStatsContainer': typeof ReferralLinkStatsContainerComponent;
  }
}
