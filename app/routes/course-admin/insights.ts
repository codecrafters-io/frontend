import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseInsightsDashboardModel from 'codecrafters-frontend/models/course-insights-dashboard';
import type { ModelType as CourseAdminModelType } from 'codecrafters-frontend/routes/course-admin';

export type CourseAdminInsightsRouteModel = {
  courseInsightsDashboard: CourseInsightsDashboardModel;
};

export default class CourseInsightsRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  async model(): Promise<CourseAdminInsightsRouteModel> {
    const course = (this.modelFor('course-admin') as CourseAdminModelType).course;

    const courseInsightsDashboard = (await this.store.queryRecord('course-insights-dashboard', {
      course_id: course.id,
      include: 'course',
    })) as CourseInsightsDashboardModel;

    return {
      courseInsightsDashboard: courseInsightsDashboard,
    };
  }
}
