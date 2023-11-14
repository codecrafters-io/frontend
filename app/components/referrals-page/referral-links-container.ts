import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ReferralLinksContainerComponent extends Component {
  @service authenticator!: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get referralLink() {
    // @ts-ignore
    return this.currentUser.referralLinks.firstObject;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralLinksContainer': typeof ReferralLinksContainerComponent;
  }
}
