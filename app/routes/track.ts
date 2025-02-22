import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import config from 'codecrafters-frontend/config/environment';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export type ModelType = {
  courses: CourseModel[];
  language: LanguageModel;
};

export default class TrackRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare metaData: MetaDataService;

  previousMetaImageUrl: string | undefined;

  activate(): void {
    scrollToTop();
  }

  afterModel({ language: { slug } = {} }: { language?: { slug?: string } } = {}): void {
    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}language-${slug}.jpg`;
  }

  buildRouteInfoMetadata(): RouteInfoMetadata {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }

  deactivate(): void {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  // TODO: Handle missing language?
  async model(params: { track_slug: string }): Promise<ModelType> {
    const courses = (await this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    })) as unknown as CourseModel[];

    const language = this.store.peekAll('language').findBy('slug', params.track_slug) as LanguageModel;

    if (language.trackPrimerConceptGroupSlug) {
      const conceptGroup = await this.store.queryRecord('concept-group', { slug: language.trackPrimerConceptGroupSlug, include: 'author' });

      if (conceptGroup) {
        await this.store.findAll('concept', { include: 'author,questions' });
      }
    }

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('repository', {
        include: RepositoryPoller.defaultIncludedResources,
      });
    }

    return {
      courses: courses.filter((course) => course.betaOrLiveLanguages.includes(language)),
      language: language,
    };
  }
}
