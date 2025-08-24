import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';
import InstitutionMembershipGrantModel from 'codecrafters-frontend/models/institution-membership-grant';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
}

export default class MembershipSection extends Component<Signature> {
  get subscriptionSourceIsInstitutionMembershipGrant(): boolean {
    return this.args.user.activeSubscription?.source instanceof InstitutionMembershipGrantModel;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::MembershipSection': typeof MembershipSection;
  }
}
