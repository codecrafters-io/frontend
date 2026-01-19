import { service } from '@ember/service';
import Controller from '@ember/controller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type { ModelType } from 'codecrafters-frontend/routes/course-overview';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class CourseOverviewController extends Controller {
  declare model: ModelType;

  @service declare authenticator: AuthenticatorService;

  get activeRepository(): RepositoryModel | null {
    return this.userRepositories.toSorted(fieldComparator('lastSubmissionAt')).reverse()[0] || null;
  }

  get completedStages() {
    return this.userRepositories.flatMap((repository) => repository.completedStages);
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get userRepositories() {
    if (this.authenticator.currentUser) {
      let repositories = this.authenticator.currentUser.repositories
        .filter((item) => item.course === this.model.course)
        .filter((item) => item.firstSubmissionCreated);

      // Filter by track/language if specified
      if (this.model.language) {
        repositories = repositories.filter((item) => item.language === this.model.language);
      }

      return repositories;
    } else {
      return [];
    }
  }
}
