import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';

interface Signature {
  Args: {
    user: UserModel;
  };
}

export default class SupportSectionComponent extends Component<Signature> {
  get supportEmail() {
    return `support+${this.args.user.username}@codecrafters.io`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::SupportSection': typeof SupportSectionComponent;
  }
}
