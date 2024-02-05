import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';
import type RouterService from '@ember/routing/router-service';

export type ModelType = {
  onboardingSurvey: OnboardingSurveyModel;
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

  async afterModel(model: { onboardingSurvey: OnboardingSurveyModel | null }) {
    // User must've been created before we started onboarding surveys.
    if (!model.onboardingSurvey) {
      this.router.transitionTo('catalog');

      return;
    }

    if (model.onboardingSurvey.status === 'complete') {
      this.router.transitionTo('catalog');
    }
  }

  async model() {
    await this.authenticator.authenticate(); // Force auth

    return {
      onboardingSurvey: (await this.store.queryRecord('onboarding-survey', {
        user_id: this.authenticator.currentUserId,
      })) as OnboardingSurveyModel | null,
    };
  }
}
