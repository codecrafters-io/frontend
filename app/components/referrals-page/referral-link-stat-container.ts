import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ReferralLinkStatContainerComponent extends Component {
  @service authenticator!: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }
}
