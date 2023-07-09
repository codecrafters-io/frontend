import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';

export default class PayRoute extends ApplicationRoute {
  @service authenticator;
  @service store;

  activate() {
    scrollToTop();
  }

  async model() {
    await this.authenticator.authenticate();

    if (this.authenticator.currentUser && this.authenticator.currentUser.hasActiveSubscription) {
      this.router.transitionTo('membership');
    }

    return {
      courses: await this.store.findAll('course'), // For testimonials
      customDiscounts: await this.store.findAll('custom-discount', { include: 'user' }),
    };
  }
}
