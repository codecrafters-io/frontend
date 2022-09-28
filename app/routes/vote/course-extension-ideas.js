import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class CourseExtensionIdeasRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.selectedCourseSlug = controller.orderedCourses.firstObject.slug;
  }
}
