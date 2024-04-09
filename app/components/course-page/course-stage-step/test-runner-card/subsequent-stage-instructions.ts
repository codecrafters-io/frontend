import Component from '@glimmer/component';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
    onViewLogsButtonClick: () => void;
  };
}

export default class SubsequentStageInstructionsComponent extends Component<Signature> {
  get lastSubmissionWasForCurrentStage() {
    return this.args.currentStep.repository.lastSubmission?.courseStage === this.args.currentStep.courseStage;
  }

  get lastSubmissionWasSubmittedViaCli() {
    return this.args.currentStep.repository.lastSubmission?.wasSubmittedViaCli;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestRunnerCard::SubsequentStageInstructions': typeof SubsequentStageInstructionsComponent;
  }
}
