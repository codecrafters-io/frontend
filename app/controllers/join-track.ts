import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import { type ModelType } from 'codecrafters-frontend/routes/join-track';

export default class JoinTrackController extends Controller {
  declare model: ModelType;

  queryParams = [{ affiliateLinkSlug: 'via' }];

  @service declare authenticator: AuthenticatorService;

  get courses(): CourseModel[] {
    return this.model.courses
      .rejectBy('releaseStatusIsAlpha')
      .rejectBy('releaseStatusIsDeprecated')
      .rejectBy('visibility', 'private');
  }

  get sortedCourses(): CourseModel[] {
    return this.courses.sortBy('sortPositionForTrack');
  }

  get testimonials(): CourseModel['testimonials'] {
    return this.sortedCourses[0] ? this.sortedCourses[0].testimonials : [];
  }
}
