import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class JoinRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;

  @service currentUser;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }

  async model(params) {
    const referralLinks = await this.store.query('referral-link', {
      slug: params.referralLinkSlug,
      include: 'user',
    });

    return { referralLink: referralLinks.firstObject };
  }
}
