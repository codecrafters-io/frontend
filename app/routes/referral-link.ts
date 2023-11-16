import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class ReferralLinkRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service authenticator!: AuthenticatorService;
  @service store!: Store;

  activate() {
    scrollToTop();
  }

  afterModel(model: { referralLink: ReferralLinkModel }) {
    console.log(model);

    if (!model.referralLink) {
      this.transitionTo('not-found');
    }
  }

  async model(params: { referral_link_slug: string }) {
    console.log(params);

    const referralLinks = await this.store.query('referral-link', {
      slug: params.referral_link_slug,
      include: 'user',
    });

    return { referralLink: referralLinks.firstObject };
  }
}
