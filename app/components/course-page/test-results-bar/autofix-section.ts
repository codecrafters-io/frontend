import type Store from '@ember-data/store';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { Step } from 'codecrafters-frontend/lib/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    currentStep: Step;
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

  get lastAutofixRequest(): AutofixRequestModel | null {
    if (!this.lastSubmission) {
      return null;
    }

    return this.lastSubmission.autofixRequests.rejectBy('isNew').sortBy('createdAt').lastObject || null;
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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixSection': typeof AutofixSectionComponent;
  }
}
