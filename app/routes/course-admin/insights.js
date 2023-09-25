import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';

export default class CourseInsightsRoute extends BaseRoute {
  @service authenticator;
  @service store;

  async model() {
    const course = this.modelFor('course-admin').course;

    const courseInsightsDashboard = await this.store.queryRecord('course-insights-dashboard', {
      course_id: course.id,
      include: 'course',
    });

    return {
      courseInsightsDashboard: courseInsightsDashboard,
    };
  }
}
