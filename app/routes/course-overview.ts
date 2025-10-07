import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import config from 'codecrafters-frontend/config/environment';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export interface ModelType {
  course: CourseModel;
}

export default class CourseOverviewRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare metaData: MetaDataService;
  @service declare router: RouterService;

  previousMetaImageUrl: string | undefined;

  activate(): void {
    scrollToTop();
  }

  afterModel(model: ModelType) {
    if (!model.course) {
      this.router.transitionTo('not-found');

      return;
    }

    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}course-${model.course.slug}.jpg`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  async #findCourse(slug: string) {
    return (
      await this.store.findAll('course', {
        include: 'extensions,stages,language-configurations.language',
      })
    ).findBy('slug', slug);
  }

  async model({ course_slug }: { course_slug: string }): Promise<ModelType> {
    let course: CourseModel = this.#peekCourse(course_slug);

    if (course) {
      // Trigger a refresh anyway, without await
      this.#findCourse(course_slug);
      this.#queryUserRepositories(course);
    } else {
      course = await this.#findCourse(course_slug);
      await this.#queryUserRepositories(course);
    }

    return {
      course,
    };
  }

  #peekCourse(slug: string) {
    return this.store.peekAll('course').findBy('slug', slug);
  }

  #queryUserRepositories(course: CourseModel) {
    if (this.authenticator.isAuthenticated) {
      return this.store.query('repository', {
        include: RepositoryPoller.defaultIncludedResources,
        course_id: course.id,
      });
    }

    return;
  }
}
