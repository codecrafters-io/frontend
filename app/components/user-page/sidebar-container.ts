import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type UserModel from 'codecrafters-frontend/models/user';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
};

export default class SidebarContainerComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get isCurrentUser() {
    return this.args.user === this.currentUser;
  }
}
