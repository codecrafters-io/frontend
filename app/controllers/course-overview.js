import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class CourseOverviewController extends Controller {
  @service authenticator;

  get activeRepository() {
    if (this.authenticator.isAuthenticated) {
      return this.currentUser.record.repositories.filterBy('course', this.model.course).filterBy('firstSubmissionCreated').sortBy('lastSubmissionAt')
        .lastObject;
    } else {
      return null;
    }
  }

  get userRepositories() {
    if (this.authenticator.isAuthenticated) {
      return this.currentUser.record.repositories.filterBy('course', this.model.course).filterBy('firstSubmissionCreated');
    } else {
      return [];
    }
  }
}
