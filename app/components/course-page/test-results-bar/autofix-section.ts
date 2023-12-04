import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { Step } from 'codecrafters-frontend/lib/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    currentStep: Step;
    lastAutofixRequest: AutofixRequestModel | null;
    onAutofixRequestCreated: (autofixRequest: AutofixRequestModel) => void;
    repository: RepositoryModel;
  };
};

export default class AutofixSectionComponent extends Component<Signature> {
  @service declare store: Store;
  @tracked autofixCreationError: string | null = null;

  get activeCourseStage() {
    if (this.args.activeStep.type === 'CourseStageStep') {
      return this.activeStepAsCourseStageStep.courseStage;
    } else {
      return null;
    }
  }

  get activeStepAsCourseStageStep() {
    return this.args.activeStep as CourseStageStep;
  }

  get lastAutofixRequestForSubmission() {
    if (this.args.lastAutofixRequest && this.args.lastAutofixRequest.submission === this.lastSubmission) {
      return this.args.lastAutofixRequest;
    } else {
      return null;
    }
  }

  get lastSubmission() {
    if (!this.activeCourseStage) {
      return null;
    }

    if (this.args.repository.lastSubmission.courseStage === this.activeCourseStage) {
      return this.args.repository.lastSubmission;
    } else {
      return null;
    }
  }

  createAutofixRequestTask = task({ drop: true }, async (): Promise<void> => {
    this.autofixCreationError = null;

    if (!this.lastSubmission) {
      return;
    }

    const autofixRequest = this.store.createRecord('autofix-request', {
      submission: this.lastSubmission,
    });

    try {
      await autofixRequest.save();
    } catch (error) {
      this.autofixCreationError = 'Something went wrong. Please try again later.'; // We aren't actually using this yet.
      throw error;
    }

    this.args.onAutofixRequestCreated(autofixRequest);
  });

  @action
  handleAutofixButtonClick() {
    this.createAutofixRequestTask.perform();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixSection': typeof AutofixSectionComponent;
  }
}
