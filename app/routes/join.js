import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';

export default class JoinRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service authenticator;
  @service store;

  activate() {
    scrollToTop();
  }

  afterModel(model) {
    if (!model.affiliateLink) {
      this.transitionTo('not-found');
    }
  }

  async model(params) {
    const affiliateLinks = await this.store.query('affiliate-link', {
      slug: params.affiliateLinksSlug,
      include: 'user',
    });

    return { affiliateLink: affiliateLinks.firstObject };
  }
}
