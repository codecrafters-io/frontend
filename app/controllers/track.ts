import Controller from '@ember/controller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import type CourseModel from 'codecrafters-frontend/models/course';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { type ModelType } from 'codecrafters-frontend/routes/track';

export default class TrackController extends Controller {
  declare model: ModelType;

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

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
