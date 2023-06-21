import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ReferralLinksContainerComponent extends Component {
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get referralLink() {
    return this.currentUser.referralLinks.firstObject;
  }
}
