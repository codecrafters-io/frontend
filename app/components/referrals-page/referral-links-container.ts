import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLElement;
}

export default class ReferralLinksContainerComponent extends Component<Signature> {
  @service authenticator!: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get referralLink() {
    return this.currentUser?.referralLinks[0];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralLinksContainer': typeof ReferralLinksContainerComponent;
  }
}
