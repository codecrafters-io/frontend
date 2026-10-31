import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import Store from '@ember-data/store';
import { service } from '@ember/service';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';
import type RouterService from '@ember/routing/router-service';
import RouteInfoMetadata, { HelpscoutBeaconVisibility, RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type CourseModel from 'codecrafters-frontend/models/course';

export type ModelType = {
  onboardingSurvey: OnboardingSurveyModel;
  courses: CourseModel[];
};

export default class WelcomeRoute extends BaseRoute {
  queryParams = {
    next: {},
  };

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare router: RouterService;

  activate() {
    scrollToTop();
  }

  afterModel(model: { onboardingSurvey: OnboardingSurveyModel | null }) {
    // User must've been created before we started onboarding surveys.
    if (!model.onboardingSurvey) {
      this.router.transitionTo('catalog');

      return;
    }

    if (model.onboardingSurvey.status === 'complete') {
      this.router.transitionTo('catalog');
    }
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Light, beaconVisibility: HelpscoutBeaconVisibility.Hidden });
  }

  async model() {
    await this.authenticator.authenticate(); // Force auth

    const onboardingSurvey = (await this.store.queryRecord('onboarding-survey', {
      user_id: this.authenticator.currentUserId,
    })) as OnboardingSurveyModel | null;
    const courses = onboardingSurvey?.status === 'incomplete' ? await this.store.findAll('course', { include: 'stages' }) : [];

    return { onboardingSurvey, courses };
  }
}
