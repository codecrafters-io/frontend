import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';

export type ModelType = {
  courses: CourseModel[];
  regionalDiscount: RegionalDiscountModel | null;
};

export default class PayRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  activate() {
    scrollToTop();
  }

  async model() {
    if (this.authenticator.isAuthenticated) {
      return {
        courses: await this.store.findAll('course'), // For testimonials
        regionalDiscount: await this.store.createRecord('regional-discount').fetchCurrent(),
      };
    } else {
      if (this.authenticator.currentUser && this.authenticator.currentUser.hasActiveSubscription) {
        this.router.transitionTo('membership');
      }

      return {
        courses: await this.store.findAll('course'), // For testimonials
        regionalDiscount: null,
      };
    }
  }
}
