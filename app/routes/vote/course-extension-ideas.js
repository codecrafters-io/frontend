import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class CourseExtensionIdeasRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  setupController(controller, model) {
    super.setupController(controller, model);

    if (controller.orderedCourses.firstObject && !controller.selectedCourseSlug) {
      controller.selectedCourseSlug = controller.orderedCourses.firstObject.slug;
    }
  }
}
