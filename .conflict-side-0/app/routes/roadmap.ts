import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { hash as RSVPHash } from 'rsvp';
import type Transition from '@ember/routing/transition';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export type ModelType = {
  courseIdeas: CourseIdeaModel[];
  courseExtensionIdeas: CourseExtensionIdeaModel[];
};

export default class RoadmapRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  activate() {
    scrollToTop();
  }

  afterModel(_model: ModelType, transition: Transition) {
    if (transition.to?.name === 'roadmap.index') {
      this.router.transitionTo('roadmap.course-ideas');
    }
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  async model(): Promise<ModelType> {
    await this.authenticator.authenticate();

    const modelPromises = {
      courseIdeas: this.store.findAll('course-idea', {
        include: 'current-user-votes,current-user-votes.user',
      }) as unknown as CourseIdeaModel[],

      courseExtensionIdeas: this.store.findAll('course-extension-idea', {
        include: 'course,current-user-votes,current-user-votes.user',
      }) as unknown as CourseExtensionIdeaModel[],
    };

    return await RSVPHash(modelPromises);
  }
}
