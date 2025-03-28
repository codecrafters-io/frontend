import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';

export default class CourseExtensionIdeasRoute extends BaseRoute {
  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true });
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    if (controller.orderedCourses[0] && !controller.selectedCourseSlug) {
      controller.selectedCourseSlug = controller.orderedCourses[0].slug;
    }
  }
}
