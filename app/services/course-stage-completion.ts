import Service, { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';
import { task } from 'ember-concurrency';

export default class CourseStageCompletionService extends Service {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  // Clicking on "mark stage as complete" destroys the modal containing the button,
  // so we need to house this task in a service.
  createTask = task(async (repository: RepositoryModel) => {
    await this.store
      .createRecord('course-stage-completion', {
        courseStage: repository.lastSubmission.courseStage,
        repository: repository,
        submission: repository.lastSubmission,
      })
      .save();

    await repository.refreshStateFromServer();
    await this.authenticator.syncCurrentUser();
  });
}

declare module '@ember/service' {
  interface Registry {
    'course-stage-completion': CourseStageCompletionService;
  }
}
