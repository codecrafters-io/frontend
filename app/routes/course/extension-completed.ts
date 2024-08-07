import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { inject as service } from '@ember/service';
import type { ModelType as CourseRouteModelType, ModelType as CourseModelType } from 'codecrafters-frontend/routes/course';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import type RouterService from '@ember/routing/router-service';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

export type ModelType = CourseModelType & {
  extension: CourseExtensionModel;
};

export default class ExtensionCompletedRoute extends BaseRoute {
  @service declare router: RouterService;
  @service declare coursePageState: CoursePageStateService;

  afterModel(model: ModelType) {
    if (!model.extension) {
      this.router.transitionTo('course', model.course.slug);
    }
  }

  async model(params: { extension_slug: string }) {
    const courseRouteModel = this.modelFor('course') as CourseRouteModelType;

    const extension = courseRouteModel.course.extensions.find((extension) => extension.slug === params.extension_slug);

    return {
      extension: extension,
      ...courseRouteModel,
    };
  }
}
