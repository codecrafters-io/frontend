import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
}

export default class MembershipSection extends Component<Signature> {
  get institution() {
    return this.args.user.store.peekAll('institution').firstObject;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::MembershipSection': typeof MembershipSection;
  }
}
