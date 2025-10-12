import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';

export default class ReferralLinkRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare router: RouterService;

  activate() {
    scrollToTop();
  }

  afterModel(model: { referralLink: ReferralLinkModel }) {
    if (!model.referralLink) {
      this.router.transitionTo('not-found');
    }
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true });
  }

  async model(params: { referral_link_slug: string }) {
    const referralLinks = (await this.store.query('referral-link', {
      slug: params.referral_link_slug,
      include: 'user',
    })) as unknown as ReferralLinkModel[];

    let acceptedReferralOfferFreeUsageGrant: FreeUsageGrantModel | null = null;

    if (this.authenticator.isAuthenticated) {
      const acceptedReferralOfferFreeUsageGrants = (await this.store.query('free-usage-grant', {
        sourceType: 'accepted_referral_offer',
        user_id: this.authenticator.currentUser?.id,
      })) as unknown as FreeUsageGrantModel[];

      acceptedReferralOfferFreeUsageGrant = acceptedReferralOfferFreeUsageGrants[0] || null;
    }

    return {
      referralLink: referralLinks[0],
      acceptedReferralOfferFreeUsageGrant: acceptedReferralOfferFreeUsageGrant,
    };
  }
}
