import Controller from '@ember/controller';

export default class CourseIdeasController extends Controller {
  get orderedCourseIdeas() {
    return this.model.courseIdeas.rejectBy('isArchived').sortBy('reverseSortPositionForCourseIdeasPage').reverse();
  }
}
