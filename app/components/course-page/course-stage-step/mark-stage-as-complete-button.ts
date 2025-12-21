import Component from '@glimmer/component';
import { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Store from '@ember-data/store';
import { waitFor } from '@ember/test-waiters';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
  };
}

export default class MarkStageAsCompleteButton extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked isCreatingStageCompletion = false;

  get isDisabled() {
    return !this.isEnabled;
  }

  get isEnabled() {
    return this.args.repository.lastSubmissionCanBeUsedForStageCompletion;
  }

  @action
  @waitFor
  async handleCreateStageCompletionButtonClick() {
    this.isCreatingStageCompletion = true;

    await this.store
      .createRecord('course-stage-completion', {
        courseStage: this.args.courseStage,
        repository: this.args.repository,
        submission: this.args.repository.lastSubmission,
      })
      .save();

    await this.args.repository.refreshStateFromServer();
    await this.authenticator.syncCurrentUser();

    this.isCreatingStageCompletion = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::MarkStageAsCompleteButton': typeof MarkStageAsCompleteButton;
  }
}
