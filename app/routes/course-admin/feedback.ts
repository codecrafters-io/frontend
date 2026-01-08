import type Store from '@ember-data/store';
import { service } from '@ember/service';
import type CourseStageFeedbackSubmissionModel from 'codecrafters-frontend/models/course-stage-feedback-submission';
import type { ModelType as CourseAdminModelType } from 'codecrafters-frontend/routes/course-admin';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export interface ModelType {
  course: CourseAdminModelType['course'];
  feedbackSubmissions: CourseStageFeedbackSubmissionModel[];
}

export default class CourseFeedbackRoute extends BaseRoute {
  @service declare store: Store;

  async model(): Promise<ModelType> {
    const { course } = this.modelFor('course-admin') as CourseAdminModelType;

    const feedbackSubmissions = (await this.store.query('course-stage-feedback-submission', {
      course_id: course.id,
      include: ['course-stage', 'course-stage.course', 'language', 'user'].join(','),
    })) as unknown as CourseStageFeedbackSubmissionModel[];

    return {
      course,
      feedbackSubmissions,
    };
  }
}
