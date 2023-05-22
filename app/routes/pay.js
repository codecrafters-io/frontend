import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class PayRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }

  async model() {
    return {
      courses: await this.store.findAll('course'), // For testimonials
      customDiscounts: await this.store.findAll('custom-discount', { include: 'user' }),
    };
  }
}
