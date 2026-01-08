import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type { ModelType as CourseAdminModelType } from 'codecrafters-frontend/routes/course-admin';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageFeedbackSubmissionModel from 'codecrafters-frontend/models/course-stage-feedback-submission';

export interface ModelType {
  course: CourseModel;
  feedbackSubmissions: CourseStageFeedbackSubmissionModel[];
}

export default class CourseFeedbackRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  async model(): Promise<ModelType> {
    const course = (this.modelFor('course-admin') as CourseAdminModelType).course;

    const filters = { course_id: course.id };

    const feedbackSubmissions = await this.store.query('course-stage-feedback-submission', {
      ...filters,
      ...{
        include: ['course-stage', 'course-stage.course', 'language', 'user'].join(','),
      },
    });

    return {
      course: course,
      feedbackSubmissions: feedbackSubmissions as unknown as CourseStageFeedbackSubmissionModel[],
    };
  }
}
