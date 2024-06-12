import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class TrackController extends Controller {
  @service authenticator;

  get courses() {
    if (this.authenticator.currentUser && this.authenticator.currentUser.isStaff) {
      return this.model.courses;
    }

    return this.model.courses.rejectBy('releaseStatusIsAlpha').rejectBy('releaseStatusIsDeprecated');
  }

  get sortedCourses() {
    return this.courses.sortBy('sortPositionForTrack');
  }

  get testimonials() {
    return this.sortedCourses[0] ? this.sortedCourses[0].testimonials : [];
  }
}
