import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class CourseExtensionIdeasRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  setupController(controller, model) {
    super.setupController(controller, model);

    if (controller.orderedCourses[0] && !controller.selectedCourseSlug) {
      controller.selectedCourseSlug = controller.orderedCourses[0].slug;
    }
  }
}
