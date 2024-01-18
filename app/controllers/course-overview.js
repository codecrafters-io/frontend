import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class CourseOverviewController extends Controller {
  @service authenticator;

  get activeRepository() {
    if (this.authenticator.currentUser) {
      return this.authenticator.currentUser.repositories
        .filterBy('course', this.model.course)
        .filterBy('firstSubmissionCreated')
        .sortBy('lastSubmissionAt')
        .at(-1);
    } else {
      return null;
    }
  }

  get userRepositories() {
    if (this.authenticator.currentUser) {
      return this.authenticator.currentUser.repositories.filterBy('course', this.model.course).filterBy('firstSubmissionCreated');
    } else {
      return [];
    }
  }
}
