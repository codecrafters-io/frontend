import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ReferralLinksContainerComponent extends Component {
  @service authenticator!: AuthenticatorService;

  get affiliateLink() {
    return this.currentUser?.referralLinks.firstObject;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralLinksContainer': typeof ReferralLinksContainerComponent;
  }
}
