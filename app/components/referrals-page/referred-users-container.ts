import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import { format } from 'date-fns';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLElement;

  Args: {
    referralLink: ReferralLinkModel;
  };
}

export default class ReferredUsersContainerComponent extends Component<Signature> {
  @service authenticator!: AuthenticatorService;

  get activationsWithReferrerFreeUsageGrantDateInfo() {
    // @ts-ignore
    return this.args.referralLink.activations.map((activation) => {
      const grantForActivation = this.currentUserFreeUsageGrants.find((grant: FreeUsageGrantModel) => {
        return grant.referralActivation.id === activation.id;
      });

      return {
        activation,
        grant: {
          shortActivatesAt: format(grantForActivation.activatesAt, 'dd MMM'),
          shortExpiresAt: format(grantForActivation.expiresAt, 'dd MMM'),
          fullActivatesAt: format(grantForActivation.activatesAt, 'dd MMMM yyyy'),
          fullExpiresAt: format(grantForActivation.expiresAt, 'dd MMMM yyyy'),
        },
      };
    });
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserFreeUsageGrants() {
    // @ts-ignore
    return this.currentUser.freeUsageGrants;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferredUsersContainer': typeof ReferredUsersContainerComponent;
  }
}
