import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class CourseController extends Controller {
  @service currentUser;

  get courses() {
    if (this.currentUser.isBetaParticipant) {
      return this.model.courses;
    } else {
      return this.model.courses.filterBy('releaseStatusIsLive');
    }
  }
}
