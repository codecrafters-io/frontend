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
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

export interface ModelType {
  course: CourseModel;
  completedStages?: CourseStageModel[];
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

  #getCompletedStages(course: CourseModel) {
    if (!course || !this.authenticator.currentUser) {
      return [];
    }

    return this.authenticator.currentUser.repositories
      .filter((repository) => repository.course === course)
      .flatMap((repository) => repository.completedStages);
  }

  async model({ course_slug }: { course_slug: string }): Promise<ModelType> {
    let course: CourseModel = this.#peekCourse(course_slug);

    if (course) {
      // Trigger a refresh anyway, without await
      this.#findCourse(course_slug);
    } else {
      course = await this.#findCourse(course_slug);

      if (course && this.authenticator.isAuthenticated) {
        await this.store.query('repository', {
          include: RepositoryPoller.defaultIncludedResources,
          course_id: course.id,
        });
      }
    }

    return {
      course,
      completedStages: this.#getCompletedStages(course),
    };
  }

  #peekCourse(slug: string) {
    return this.store.peekAll('course').findBy('slug', slug);
  }
}
