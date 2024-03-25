import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
}

export default class UsernameSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::ProfilePage::UsernameSection': typeof UsernameSectionComponent;
  }
}
