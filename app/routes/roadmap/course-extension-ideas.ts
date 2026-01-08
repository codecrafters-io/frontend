import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type Transition from '@ember/routing/transition';
import type CourseExtensionIdeasController from 'codecrafters-frontend/controllers/roadmap/course-extension-ideas';

export default class CourseExtensionIdeasRoute extends BaseRoute {
  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  setupController(controller: CourseExtensionIdeasController, model: unknown, transition: Transition) {
    super.setupController(controller, model, transition);

    if (controller.orderedCourses[0] && !controller.selectedCourseSlug) {
      controller.selectedCourseSlug = controller.orderedCourses[0].slug;
    }
  }
}
