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
    return this.repositoriesForTrack.toSorted(fieldComparator('lastSubmissionAt')).reverse()[0] || null;
  }

  get completedStages() {
    return this.repositoriesForTrack.flatMap((repository) => repository.completedStages);
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get repositoriesForTrack() {
    if (this.model.language) {
      return this.userRepositories.filter((repository) => repository.language === this.model.language);
    }

    return this.userRepositories;
  }

  get userRepositories() {
    if (this.authenticator.currentUser) {
      return this.authenticator.currentUser.repositories
        .filter((item) => item.course === this.model.course)
        .filter((item) => item.firstSubmissionCreated);
    } else {
      return [];
    }
  }
}
