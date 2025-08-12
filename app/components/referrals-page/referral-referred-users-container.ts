import Component from '@glimmer/component';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    freeUsageGrants: FreeUsageGrantModel[];
    referralLink: ReferralLinkModel | undefined;
  };
}

export default class ReferralReferredUsersContainer extends Component<Signature> {
  get activationsAndFreeUsageGrants() {
    return this.args.referralLink?.activations.map((activation) => {
      const grantForActivation = this.args.freeUsageGrants.find((grant) => grant.referralActivation.id === activation.id);

      return {
        activation,
        grant: grantForActivation,
      };
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralReferredUsersContainer': typeof ReferralReferredUsersContainer;
  }
}
