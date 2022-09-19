import Controller from '@ember/controller';

export default class CourseIdeasController extends Controller {
  get orderedCourseIdeas() {
    return this.model.courseIdeas.sortBy('reverseSortPositionForCourseIdeasPage').reverse();
  }
}
