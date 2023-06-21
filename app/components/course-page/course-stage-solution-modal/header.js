import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service authenticator;
  @service featureFlags;

  get currentUserIsStaff() {
    return this.authenticator.currentUser && this.authenticator.currentUser.isStaff;
  }
}
