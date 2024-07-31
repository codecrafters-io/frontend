import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import { type ModelType } from 'codecrafters-frontend/routes/track';

export default class TrackController extends Controller {
  declare model: ModelType;

  @service declare authenticator: AuthenticatorService;

  get courses(): CourseModel[] {
    if (this.authenticator.currentUser && this.authenticator.currentUser.isStaff) {
      return this.model.courses;
    }

    return this.model.courses.rejectBy('releaseStatusIsAlpha').rejectBy('releaseStatusIsDeprecated');
  }

  get sortedCourses(): CourseModel[] {
    return this.courses.sortBy('sortPositionForTrack');
  }

  get testimonials(): CourseModel['testimonials'] {
    return this.sortedCourses[0] ? this.sortedCourses[0].testimonials : [];
  }
}
