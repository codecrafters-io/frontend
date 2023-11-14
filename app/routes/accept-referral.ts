import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class AcceptReferralRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service authenticator!: AuthenticatorService;
  @service store!: Store;

  activate() {
    scrollToTop();
  }

  afterModel(model: { referralLink: ReferralLinkModel }) {
    if (!model.referralLink) {
      this.transitionTo('not-found');
    }
  }

  async model(params: { referral_link_slug: string }) {
    const referralLinks = await this.store.query('referral-link', {
      slug: params.referral_link_slug,
      include: 'user',
    });

    return { referralLink: referralLinks.firstObject };
  }
}
