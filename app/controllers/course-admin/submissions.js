import Controller from '@ember/controller';

export default class CourseAdminSubmissionsController extends Controller {
  queryParams = ['languages', 'usernames', 'course_stage_slugs'];
  languages = '';
  usernames = '';
  course_stage_slugs = '';

  get filteredCourseStages() {
    return this.model.course_stages.filter((course_stage) => this.model.filteredCourseStageSlugs.includes(course_stage.slug));
  }

  get filteredLanguages() {
    return this.model.languages.filter((language) => this.model.filteredLanguageSlugs.includes(language.slug));
  }
}
