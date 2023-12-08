import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel;
  };
};

export default class CreateAutofixPromptComponent extends Component<Signature> {
  @service declare store: Store;
  @tracked autofixCreationError: string | null = null;

  createAutofixRequestTask = task({ drop: true }, async (): Promise<void> => {
    this.autofixCreationError = null;

    const autofixRequest = this.store.createRecord('autofix-request', {
      submission: this.args.submission,
    });

    try {
      await autofixRequest.save();
    } catch (error) {
      this.autofixCreationError = 'Something went wrong. Please try again later.'; // We aren't actually using this yet.
      throw error;
    }
  });

  @action
  handleAutofixButtonClick() {
    this.createAutofixRequestTask.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixSection::CreateAutofixPrompt': typeof CreateAutofixPromptComponent;
  }
}
