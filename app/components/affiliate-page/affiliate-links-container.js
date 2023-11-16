import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class AffiliateLinksContainerComponent extends Component {
  @service authenticator;

  get affiliateLink() {
    return this.currentUser.affiliateLinks.firstObject;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }
}
