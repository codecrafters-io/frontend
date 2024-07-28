import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';

export type ModelType = {
  affiliateLink: AffiliateLinkModel;
};

export default class JoinRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare router: RouterService;

  activate() {
    scrollToTop();
  }

  async model(params: { affiliateLinkSlug: string }) {
    const affiliateLinks = (await this.store.query('affiliate-link', {
      slug: params.affiliateLinkSlug,
      include: 'user',
    })) as unknown as AffiliateLinkModel[];

    if (affiliateLinks.length === 0) {
      this.router.transitionTo('not-found');
    }

    return { affiliateLink: affiliateLinks[0]! };
  }
}
