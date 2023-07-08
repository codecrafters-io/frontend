import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';

export default class JoinRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;

  @service authenticator;
  @service store;

  activate() {
    scrollToTop();
  }

  async model(params) {
    const referralLinks = await this.store.query('referral-link', {
      slug: params.referralLinkSlug,
      include: 'user',
    });

    return { referralLink: referralLinks.firstObject };
  }

  afterModel(model) {
    if (!model.referralLink) {
      this.transitionTo('not-found');
    }
  }
}
