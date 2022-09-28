import Controller from '@ember/controller';

export default class CourseExtensionIdeasController extends Controller {
  get orderedCourseExtensionIdeas() {
    return this.model.courseExtensionIdeas.sortBy('createdAt').reverse();
  }
}
