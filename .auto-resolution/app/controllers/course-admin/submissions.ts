import Controller from '@ember/controller';
import type { CourseAdminSubmissionsRouteModel } from 'codecrafters-frontend/routes/course-admin/submissions';

export default class CourseAdminSubmissionsController extends Controller {
  declare model: CourseAdminSubmissionsRouteModel;

  queryParams = ['languages', 'usernames', 'course_stage_slugs'];
  languages = '';
  usernames = '';
  course_stage_slugs = '';

  get filteredCourseStages() {
    return this.model.course.stages.filter((course_stage) => this.model.filteredCourseStageSlugs.includes(course_stage.slug));
  }

  get filteredLanguages() {
    return this.model.languages.filter((language) => this.model.filteredLanguageSlugs.includes(language.slug));
  }
}
