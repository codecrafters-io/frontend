import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isComplete: boolean;
    courseStage: CourseStageModel;
    repository: RepositoryModel;
  };
}

export default class MarkStageAsCompleteStepComponent extends Component<Signature> {
  @service declare store: Store;

  @tracked isCreatingStageCompletion = false;

  @action
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

    this.isCreatingStageCompletion = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageInstructionsCard::MarkStageAsCompleteStep': typeof MarkStageAsCompleteStepComponent;
  }
}
