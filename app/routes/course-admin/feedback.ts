import { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

interface Model {
  course: unknown;
  feedbackSubmissions: unknown;
}

type CourseAdminModel = {
  course: { id: string };
};

export default class CourseFeedbackRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  async model(): Promise<Model> {
    // `course-admin`'s model shape isn't typed here yet.
    // We'll tighten this up later once those routes are migrated.
    const { course } = this.modelFor('course-admin') as CourseAdminModel;

    const filters = { course_id: course.id };

    const feedbackSubmissions = await this.store.query('course-stage-feedback-submission', {
      ...filters,
      ...{
        include: ['course-stage', 'course-stage.course', 'language', 'user'].join(','),
      },
    });

    return {
      course,
      feedbackSubmissions,
    };
  }
}
