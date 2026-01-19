import type Store from '@ember-data/store';
import { service } from '@ember/service';
import type CourseModel from 'codecrafters-frontend/models/course';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';

export type ModelType = {
  courses: CourseModel[];
};

export default class PayRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  activate() {
    scrollToTop();
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  async model() {
    await this.authenticator.authenticate();

    if (this.authenticator.currentUser && this.authenticator.currentUser.hasActiveSubscription) {
      this.router.transitionTo('settings.billing');

      return;
    }

    return {
      courses: await this.store.findAll('course'), // For testimonials
    };
  }
}
