import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
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
    if (!model.referralLink) {
      this.transitionTo('not-found');
    }
  }

  async model(params: { referral_link_slug: string }) {
    const referralLinks = await this.store.query('referral-link', {
      slug: params.referral_link_slug,
      include: 'user',
    });

    const acceptedReferralOfferFreeUsageGrant = await this.store.query('free-usage-grant', {
      sourceType: 'accepted_referral_offer',
      user_id: this.authenticator.currentUser?.id,
    });

    return {
      referralLink: referralLinks.firstObject,
      acceptedReferralOfferFreeUsageGrant: acceptedReferralOfferFreeUsageGrant.firstObject,
    };
  }
}
