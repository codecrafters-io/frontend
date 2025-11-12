import Component from '@glimmer/component';
import type Store from '@ember-data/store';
import type SubmissionModel from 'codecrafters-frontend/models/submission';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel;
  };
}

export default class AutofixContainer extends Component<Signature> {
  @service declare store: Store;

  @tracked autofixCreationError: string | null = null;

  createAutofixRequestTask = task({ drop: true }, async (): Promise<void> => {
    this.autofixCreationError = null;

    const autofixRequest = this.store.createRecord('autofix-request', {
      submission: this.args.submission,
    });

    try {
      await autofixRequest.save();
    } catch {
      this.autofixCreationError = 'Failed to create autofix request! Try again? Post on #engineering if this persists.';
    }
  });

  @action
  handleCreateAutofixButtonClick() {
    this.createAutofixRequestTask.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::SubmissionDetails::AutofixContainer': typeof AutofixContainer;
  }
}
