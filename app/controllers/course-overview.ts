import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type { ModelType } from 'codecrafters-frontend/routes/course-overview';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export default class CourseOverviewController extends Controller {
  declare model: ModelType;

  @service declare authenticator: AuthenticatorService;

  get activeRepository(): RepositoryModel | null {
    if (this.authenticator.currentUser) {
      return (
        this.authenticator.currentUser.repositories
          .filterBy('course', this.model.course)
          .filterBy('firstSubmissionCreated')
          .sortBy('lastSubmissionAt')
          .toArray()
          .reverse()[0] || null
      );
    } else {
      return null;
    }
  }

  get completedStages() {
    return this.userRepositories.flatMap((repository) => repository.completedStages);
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get userRepositories() {
    if (this.authenticator.currentUser) {
      return this.authenticator.currentUser.repositories.filterBy('course', this.model.course).filterBy('firstSubmissionCreated');
    } else {
      return [];
    }
  }
}
