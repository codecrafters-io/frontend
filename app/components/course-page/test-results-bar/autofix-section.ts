import Component from '@glimmer/component';
import { Step } from 'codecrafters-frontend/lib/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

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
