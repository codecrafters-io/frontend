import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;
}

export default class ReferralLinksContainer extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get referralLink() {
    return this.currentUser?.referralLinks[0];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralLinksContainer': typeof ReferralLinksContainer;
  }
}
