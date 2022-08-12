import Controller from '@ember/controller';

export default class CourseAdminSubmissionsController extends Controller {
  queryParams = ['languages', 'usernames'];
  languages = '';
  usernames = '';

  get filteredLanguages() {
    return this.model.languages.filter((language) => this.model.filteredLanguageSlugs.includes(language.slug));
  }
}
