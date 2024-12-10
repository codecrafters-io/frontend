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

export interface ModelType {
  course: CourseModel;
}

export default class CourseOverviewRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare metaData: MetaDataService;

  @tracked previousMetaImageUrl: string | undefined;

  afterModel(model: ModelType) {
    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}course-${model.course.slug}.jpg`;
  }

  buildRouteInfoMetadata(): RouteInfoMetadata {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  async model(params: { course_slug: string }): Promise<ModelType> {
    if (this.store.peekAll('course').findBy('slug', params.course_slug)) {
      // Trigger a refresh anyway
      this.store.findAll('course', {
        include: 'extensions,stages,language-configurations.language',
      });

      return {
        course: this.store.peekAll('course').findBy('slug', params.course_slug),
      };
    } else {
      const courses = await this.store.findAll('course', {
        include: 'extensions,stages,language-configurations.language',
      });

      const course = courses.findBy('slug', params.course_slug);

      if (this.authenticator.isAuthenticated) {
        await this.store.query('repository', {
          include: RepositoryPoller.defaultIncludedResources,
          course_id: course.id,
        });
      }

      return { course };
    }
  }
}
