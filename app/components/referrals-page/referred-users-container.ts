import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import Component from '@glimmer/component';
import { format } from 'date-fns';
import { inject as service } from '@ember/service';

export default class ReferredUsersContainerComponent extends Component {
  @service authenticator!: AuthenticatorService;

  get activationsWithReferrerFreeUsageGrantDateInfo() {
    // @ts-ignore
    return this.args.referralLink.activations.map((activation) => {
      const grantForActivation = this.currentUserFreeUsageGrants.find((grant: FreeUsageGrantModel) => {
        console.log('grant', grant);
        console.log('activation', activation);

        return grant.referralActivation.id === activation.id;
      });

      return {
        activation,
        grant: {
          activatesAt: format(grantForActivation.activatesAt, 'dd MMM'),
          expiresAt: format(grantForActivation.expiresAt, 'dd MMM'),
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
