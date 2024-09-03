import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import type CourseModel from 'codecrafters-frontend/models/course';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import type RouterService from '@ember/routing/router-service';

export interface ModelType {
  course: CourseModel;
  affiliateLink: AffiliateLinkModel;
}

export default class JoinCourseRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare authenticator: AuthenticatorService;
  @service declare metaData: MetaDataService;
  @service declare router: RouterService;
  @service declare store: Store;

  @tracked previousMetaImageUrl: string | undefined;

  async afterModel(model: ModelType) {
    if (!model.affiliateLink || !model.course) {
      this.router.transitionTo('not-found');

      return;
    }

    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}course-${model.course.slug}.jpg`;
  }

  buildRouteInfoMetadata(): RouteInfoMetadata {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  async model(params: { course_slug: string; affiliateLinkSlug: string }): Promise<ModelType> {
    const affiliateLinks = (await this.store.query('affiliate-link', {
      slug: params.affiliateLinkSlug,
      include: 'user',
    })) as unknown as AffiliateLinkModel[];

    const affiliateLink = affiliateLinks[0]!; // afterModel handles the case where this is undefined

    const courses = await this.store.findAll('course', {
      include: 'extensions,stages,stages.solutions.language,language-configurations.language,',
    });

    const course = courses.findBy('slug', params.course_slug);

    if (this.authenticator.isAuthenticated && course) {
      await this.store.query('repository', {
        include: RepositoryPoller.defaultIncludedResources,
        course_id: course.id,
      });
    }

    return {
      course,
      affiliateLink,
    };
  }
}
