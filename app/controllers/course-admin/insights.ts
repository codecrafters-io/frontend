import Controller from '@ember/controller';
import CourseInsightsDashboardModel from 'codecrafters-frontend/models/course-insights-dashboard';

export default class CourseAdminInsightsController extends Controller {
  declare model: {
    courseInsightsDashboard: CourseInsightsDashboardModel;
  };
}
