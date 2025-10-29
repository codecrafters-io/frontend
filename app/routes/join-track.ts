import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import config from 'codecrafters-frontend/config/environment';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export interface ModelType {
  courses: CourseModel[];
  language: LanguageModel;
  affiliateLink: AffiliateLinkModel;
}

export default class JoinTrackRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare metaData: MetaDataService;
  @service declare router: RouterService;
  @service declare store: Store;

  previousMetaImageUrl: string | undefined;

  afterModel(model: ModelType) {
    if (!model.affiliateLink || !model.language) {
      this.router.transitionTo('not-found');

      return;
    }

    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}language-${model.language.slug}.jpg`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  async model(params: { track_slug: string; affiliateLinkSlug: string }): Promise<ModelType> {
    const affiliateLinks = (await this.store.query('affiliate-link', {
      slug: params.affiliateLinkSlug,
      include: 'user',
    })) as unknown as AffiliateLinkModel[];

    const affiliateLink = affiliateLinks[0]!; // afterModel handles the case where this is undefined

    // Make sure we have all courses loaded to display
    const courses = (await this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    })) as unknown as CourseModel[];

    const language = this.store.peekAll('language').find((item) => item.slug === params.track_slug) as LanguageModel;

    return {
      courses: courses.filter((course) => course.betaOrLiveLanguages.includes(language)),
      language,
      affiliateLink,
    };
  }
}
