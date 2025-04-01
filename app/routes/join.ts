import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';

export type ModelType = {
  affiliateLink: AffiliateLinkModel;
};

export default class JoinRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare router: RouterService;

  activate() {
    scrollToTop();
  }

  afterModel(model: ModelType) {
    if (!model.affiliateLink) {
      this.router.transitionTo('not-found');
    }
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true });
  }

  async model(params: { affiliateLinkSlug: string }) {
    const affiliateLinks = (await this.store.query('affiliate-link', {
      slug: params.affiliateLinkSlug,
      include: 'user',
    })) as unknown as AffiliateLinkModel[];

    return { affiliateLink: affiliateLinks[0]! }; // afterModel ensures that this is never undefined
  }
}
