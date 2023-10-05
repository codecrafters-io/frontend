import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SidebarContainerComponent extends Component {
  @service declare authenticator: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }
}
