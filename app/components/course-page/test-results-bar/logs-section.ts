import Component from '@glimmer/component';
import { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeStep: StepDefinition;
    currentStep: StepDefinition;
    repository: RepositoryModel;
  };
}

export default class LogsSection extends Component<Signature> {
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

  get debuggingArticleLink() {
    return 'https://docs.codecrafters.io/challenges/debug-test-failures';
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
    'CoursePage::TestResultsBar::LogsSection': typeof LogsSection;
  }
}
