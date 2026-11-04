import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type CompetitionQuizModel from 'codecrafters-frontend/models/competition-quiz';
import type CourseModel from 'codecrafters-frontend/models/course';
import type Store from '@ember-data/store';
import type Transition from '@ember/routing/transition';
import type { ModelType as CourseAdminModelType } from 'codecrafters-frontend/routes/course-admin';
import { service } from '@ember/service';

export type CourseAdminQuizRouteModel = {
  course: CourseModel;
  quiz: CompetitionQuizModel;
};

export default class CourseAdminQuizRoute extends BaseRoute {
  @service declare store: Store;

  async beforeModel(transition: Transition) {
    await super.beforeModel(transition);
    await this.authenticator.authenticate();

    if (!this.authenticator.currentUser?.isStaff) {
      this.router.transitionTo('course-admin.submissions');
    }
  }

  async model(params: { quiz_id: string }): Promise<CourseAdminQuizRouteModel> {
    const course = (this.modelFor('course-admin') as CourseAdminModelType).course;
    const quiz = await this.store.findRecord('competition-quiz', params.quiz_id, { reload: true });

    return { course, quiz };
  }
}
