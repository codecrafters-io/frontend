import Component from '@glimmer/component';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import { format } from 'date-fns';

interface Signature {
  Element: HTMLElement;

  Args: {
    freeUsageGrants: FreeUsageGrantModel[];
    referralLink: ReferralLinkModel;
  };
}

export default class AffiliateReferredUsersContainerComponent extends Component<Signature> {
  get userActivationsAndFreeUsageGrants() {
    return this.args.referralLink.activations.map((activation) => {
      const grantForActivation = this.args.freeUsageGrants.find((grant) => grant.referralActivation.id === activation.id);

      return {
        activation,
        grant: {
          fullActivatesAt: format(grantForActivation?.activatesAt as Date, 'dd MMMM yyyy'),
          fullExpiresAt: format(grantForActivation?.expiresAt as Date, 'dd MMMM yyyy'),
          shortActivatesAt: format(grantForActivation?.activatesAt as Date, 'dd MMM'),
          shortExpiresAt: format(grantForActivation?.expiresAt as Date, 'dd MMM'),
        },
      };
    });
  }
}
