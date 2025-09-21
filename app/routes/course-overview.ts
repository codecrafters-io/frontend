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

  async model(params: { course_slug: string }): Promise<ModelType> {
    if (this.store.peekAll('course').findBy('slug', params.course_slug)) {
      // Trigger a refresh anyway
      this.store.findAll('course', {
        include: 'extensions,stages,language-configurations.language',
      });

      const course = this.store.peekAll('course').findBy('slug', params.course_slug);

      return {
        course,
        completedStages: this.#peekCompletedStages(course),
      };
    } else {
      const courses = await this.store.findAll('course', {
        include: 'extensions,stages,language-configurations.language',
      });

      const course = courses.findBy('slug', params.course_slug);

      if (!course) {
        return { course: undefined as unknown as CourseModel };
      }

      if (this.authenticator.isAuthenticated) {
        await this.store.query('repository', {
          include: RepositoryPoller.defaultIncludedResources,
          course_id: course.id,
        });
      }

      return {
        course,
        completedStages: this.#peekCompletedStages(course),
      };
    }
  }

  #peekCompletedStages(course: CourseModel) {
    const completedStageIds = this.store.peekAll('course-stage-completion').map((completion) => completion.courseStage.id);

    return course.stages.filter((stage: CourseStageModel) => completedStageIds.includes(stage.id));
  }
}
