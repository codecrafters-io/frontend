import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class VoteController extends Controller {
  @service('current-user') currentUserService;

  get orderedCourseIdeas() {
    return this.model.courseIdeas.sortBy('reverseSortPositionForCourseIdeasPage').reverse();
  }
}
