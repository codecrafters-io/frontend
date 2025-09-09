import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';

export type ModelType = {
  language: LanguageModel;
};

export default class LeaderboardRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  activate(): void {
    scrollToTop();
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true });
  }

  async model(params: { language_slug: string }): Promise<ModelType> {
    (await this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    })) as unknown as CourseModel[];

    const languages = (await this.store.findAll('language', {
      include: 'leaderboard,primer-concept-group,primer-concept-group.author,primer-concept-group.concepts,primer-concept-group.concepts.author',
      reload: true,
    })) as unknown as LanguageModel[];

    const language = languages.find((language) => language.slug === params.language_slug)!;

    return {
      language: language,
    };
  }
}
