import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type Transition from '@ember/routing/transition';

export default class CourseExtensionIdeasRoute extends BaseRoute {
  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setupController(controller: any, model: unknown, transition: Transition) {
    super.setupController(controller, model, transition);

    if (controller.orderedCourses[0] && !controller.selectedCourseSlug) {
      controller.selectedCourseSlug = controller.orderedCourses[0].slug;
    }
  }
}
