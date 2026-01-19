import Controller from '@ember/controller';
import { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import { type ModelType } from 'codecrafters-frontend/routes/track';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class TrackController extends Controller {
  declare model: ModelType;

  @service declare authenticator: AuthenticatorService;

  get courses(): CourseModel[] {
    return this.model.courses
      .filter((item) => !item.releaseStatusIsAlpha)
      .filter((item) => !item.releaseStatusIsDeprecated)
      .filter((item) => !item.visibilityIsPrivate);
  }

  get sortedCourses(): CourseModel[] {
    return this.courses.toSorted(fieldComparator('sortPositionForTrack'));
  }

  get testimonials(): CourseModel['testimonials'] {
    return this.sortedCourses[0] ? this.sortedCourses[0].testimonials : [];
  }
}
