import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageFeedbackSubmissionModel from 'codecrafters-frontend/models/course-stage-feedback-submission';

export type CourseAdminFeedbackRouteModel = {
  course: CourseModel;
  feedbackSubmissions: CourseStageFeedbackSubmissionModel[];
};

export default class CourseAdminFeedbackRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  async model(): Promise<CourseAdminFeedbackRouteModel> {
    // @ts-expect-error modelFor not typed
    const course = this.modelFor('course-admin').course as CourseModel;

    const filters = { course_id: course.id };

    const feedbackSubmissions = (await this.store.query('course-stage-feedback-submission', {
      ...filters,
      ...{
        include: ['course-stage', 'course-stage.course', 'language', 'user'].join(','),
      },
    })) as unknown as CourseStageFeedbackSubmissionModel[];

    return {
      course: course,
      feedbackSubmissions: feedbackSubmissions,
    };
  }
}
