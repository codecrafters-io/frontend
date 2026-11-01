import type Store from '@ember-data/store';
import { service } from '@ember/service';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import { hash as RSVPHash } from 'rsvp';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';
import type Transition from '@ember/routing/transition';

export type ModelType = {
  repositories?: RepositoryModel[];
  courses: CourseModel[];
  onboardingSurvey?: OnboardingSurveyModel | null;
};

export default class CatalogRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  async beforeModel(transition: Transition) {
    if (this.authenticator.isAuthenticated) {
      await this.authenticator.authenticate();
    }

    super.beforeModel(transition);
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  model(): Promise<ModelType> {
    const modelPromises: {
      repositories?: Promise<RepositoryModel[]>;
      courses?: Promise<CourseModel[]>;
      _languages?: Promise<LanguageModel[]>;
      onboardingSurvey?: Promise<OnboardingSurveyModel | null | undefined>;
    } = {};

    if (this.authenticator.isAuthenticated) {
      modelPromises.repositories = this.store.findAll('repository', {
        reload: false,
        include: RepositoryPoller.defaultIncludedResources,
      }) as unknown as Promise<RepositoryModel[]>;

      if (this.authenticator.currentUser?.featureSuggestions.some((item) => item.featureIsOnboardingProfile && !item.isDismissed)) {
        modelPromises.onboardingSurvey = (
          this.store.queryRecord('onboarding-survey', {
            user_id: this.authenticator.currentUserId,
          }) as Promise<OnboardingSurveyModel | null>
        ).catch(() => undefined); // Optional profile prompts must not prevent catalog browsing.
      }
    }

    modelPromises.courses = this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language.leaderboard',
    }) as unknown as Promise<CourseModel[]>;

    // Resources required by the track page
    modelPromises._languages = this.store.findAll('language', {
      include: 'leaderboard,primer-concept-group,primer-concept-group.author,primer-concept-group.concepts,primer-concept-group.concepts.author',
    }) as unknown as Promise<LanguageModel[]>;

    return RSVPHash(modelPromises) as Promise<ModelType>;
  }
}
