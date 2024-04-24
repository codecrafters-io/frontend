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

class BaseStep {
  isComplete: boolean;
  repository: RepositoryModel;

  constructor(repository: RepositoryModel, isComplete: boolean) {
    this.isComplete = isComplete;
    this.repository = repository;
  }
}

class ReadInstructionsStep extends BaseStep implements Step {
  id = 'read-instructions';
  canBeCompletedManually = true;

  get titleMarkdown() {
    return 'Read instructions';
  }
}

class ImplementSolutionStep extends BaseStep implements Step {
  id = 'implement-solution';
  canBeCompletedManually = true;

  get titleMarkdown() {
    return 'Implement solution';
  }
}

class RunTestsStep extends BaseStep implements Step {
  id = 'run-tests';
  canBeCompletedManually = false;

  get titleMarkdown() {
    return 'Run tests';
  }
}

class MarkStageAsCompleteStep extends BaseStep implements Step {
  id = 'mark-stage-as-complete';
  canBeCompletedManually = false;

  get titleMarkdown() {
    return 'Mark stage as complete';
  }
}

export default class SecondStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  @tracked readInstructionsStepWasMarkedAsComplete = false;
  @tracked implementSolutionStepWasMarkedAsComplete = false;

  get implementSolutionStepIsComplete() {
    return this.implementSolutionStepWasMarkedAsComplete || this.runTestsStepIsComplete;
  }

  get markStageAsCompleteStepIsComplete() {
    return this.args.repository.stageIsComplete(this.args.courseStage);
  }

  get readInstructionsStepIsComplete() {
    return this.implementSolutionStepIsComplete || this.readInstructionsStepWasMarkedAsComplete;
  }

  get runTestsStepIsComplete() {
    return (
      this.markStageAsCompleteStepIsComplete ||
      (this.args.repository.lastSubmissionHasSuccessStatus && this.args.repository.lastSubmission.courseStage === this.args.courseStage)
    );
  }

  get steps() {
    return [
      new ReadInstructionsStep(this.args.repository, this.readInstructionsStepIsComplete),
      new ImplementSolutionStep(this.args.repository, this.implementSolutionStepIsComplete),
      new RunTestsStep(this.args.repository, this.runTestsStepIsComplete),
      new MarkStageAsCompleteStep(this.args.repository, this.markStageAsCompleteStepIsComplete),
    ];
  }

  @action
  handleStepCompletedManually(step: Step) {
    if (step.id === 'read-instructions') {
      this.readInstructionsStepWasMarkedAsComplete = true;
    }

    if (step.id === 'implement-solution') {
      this.implementSolutionStepWasMarkedAsComplete = true;
    }
  }

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageInstructionsCard': typeof SecondStageInstructionsCardComponent;
  }
}
