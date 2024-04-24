import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import Store from '@ember-data/store';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type { Step } from 'codecrafters-frontend/components/expandable-step-list';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
  };
}

export default class MarkStageAsCompleteButtonComponent extends Component<Signature> {
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
    'CoursePage::CourseStageStep::MarkStageAsCompleteButton': typeof MarkStageAsCompleteButtonComponent;
  }
}
