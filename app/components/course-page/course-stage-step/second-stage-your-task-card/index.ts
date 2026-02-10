import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import type { StepDefinition } from 'codecrafters-frontend/components/step-list';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
  };
}

class BaseStep {
  isComplete: boolean;
  repository: RepositoryModel;

  constructor(repository: RepositoryModel, isComplete: boolean) {
    this.isComplete = isComplete;
    this.repository = repository;
  }
}

class ImplementSolutionStep extends BaseStep implements StepDefinition {
  id = 'implement-solution';

  get titleMarkdown() {
    return 'Write code to pass this stage';
  }
}

class RunTestsStep extends BaseStep implements StepDefinition {
  id = 'run-tests';

  get titleMarkdown() {
    return 'Run tests remotely';
  }
}

export default class SecondStageYourTaskCard extends Component<Signature> {
  get implementSolutionStepIsComplete() {
    return (
      this.runTestsStepIsComplete ||
      (this.args.currentStep.repository.lastSubmission?.courseStage === this.args.currentStep.courseStage &&
        !this.args.currentStep.repository.lastSubmission?.clientTypeIsSystem) // Run tests (in progress)
    );
  }

  get instructionsMarkdown() {
    return this.args.currentStep.courseStage.buildInstructionsMarkdownFor(this.args.currentStep.repository);
  }

  get runTestsStepIsComplete() {
    return (
      this.args.currentStep.repository.stageIsComplete(this.args.currentStep.courseStage) ||
      (this.args.currentStep.repository.lastSubmissionHasSuccessStatus &&
        this.args.currentStep.repository.lastSubmission.courseStage === this.args.currentStep.courseStage &&
        !this.args.currentStep.repository.lastSubmission?.clientTypeIsSystem)
    );
  }

  get steps() {
    return [
      new ImplementSolutionStep(this.args.currentStep.repository, this.implementSolutionStepIsComplete),
      new RunTestsStep(this.args.currentStep.repository, this.runTestsStepIsComplete),
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageYourTaskCard': typeof SecondStageYourTaskCard;
  }
}
