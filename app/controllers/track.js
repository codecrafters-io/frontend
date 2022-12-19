import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class TrackController extends Controller {
  @service currentUser;

  get courses() {
    if (this.currentUser.isAuthenticated && this.currentUser.record.isStaff) {
      return this.model.courses;
    }

    return this.model.courses.rejectBy('releaseStatusIsAlpha');
  }

  get sortedCourses() {
    return this.courses.sortBy('sortPositionForTrack');
  }

  get testimonials() {
    return this.sortedCourses[0].testimonials;
  }
}
