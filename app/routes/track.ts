import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import config from 'codecrafters-frontend/config/environment';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export type ModelType = {
  courses: CourseModel[];
  language: LanguageModel;
};

export default class TrackRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare metaData: MetaDataService;
  @service declare store: Store;

  previousMetaImageUrl: string | undefined;

  activate(): void {
    scrollToTop();
  }

  afterModel({ language: { slug } = {} }: { language?: { slug?: string } } = {}): void {
    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}language-${slug}.jpg`;
  }

  buildRouteInfoMetadata(): RouteInfoMetadata {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  deactivate(): void {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  // TODO: Handle missing language?
  async model(params: { track_slug: string }): Promise<ModelType> {
    const courses = (await this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    })) as unknown as CourseModel[];

    (await this.store.findAll('language', {
      include: 'primer-concept-group,primer-concept-group.author,primer-concept-group.concepts,primer-concept-group.concepts.author',
    })) as unknown as LanguageModel[];

    const language = this.store.peekAll('language').find((language) => language.slug === params.track_slug)!;

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('repository', { include: RepositoryPoller.defaultIncludedResources });
    }

    return {
      courses: courses.filter((course) => course.betaOrLiveLanguages.includes(language)),
      language: language,
    };
  }
}
