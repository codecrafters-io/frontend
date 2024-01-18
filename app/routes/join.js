import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';

export default class JoinRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service authenticator;
  @service store;
  @service router;

  activate() {
    scrollToTop();
  }

  afterModel(model) {
    if (!model.affiliateLink) {
      this.router.transitionTo('not-found');
    }
  }

  async model(params) {
    const affiliateLinks = await this.store.query('affiliate-link', {
      slug: params.affiliateLinkSlug,
      include: 'user',
    });

    return { affiliateLink: affiliateLinks[0] };
  }
}
