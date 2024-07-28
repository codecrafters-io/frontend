import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';
import { inject as service } from '@ember/service';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';

interface Signature {
  Element: HTMLDivElement;
}

export default class AffiliateLinksContainerComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get affiliateLink() {
    return this.currentUser.affiliateLinks[0] as AffiliateLinkModel; // We know that the user has an affiliate link at this point
  }

  get currentUser() {
    return this.authenticator.currentUser as UserModel; // We know the user is authed at this point
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::AffiliateLinksContainer': typeof AffiliateLinksContainerComponent;
  }
}
