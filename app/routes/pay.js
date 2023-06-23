import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class PayRoute extends ApplicationRoute {
  @service authenticator;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
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
