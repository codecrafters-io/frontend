import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class CourseIdeasController extends Controller {
  @service authenticator;
  get orderedCourseIdeas() {
    return this.model.courseIdeas.rejectBy('isArchived').sortBy('reverseSortPositionForCourseIdeasPage').reverse();
  }
}
