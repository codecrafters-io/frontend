import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import Store from '@ember-data/store';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
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

export default class SecondStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  get implementSolutionStepIsComplete() {
    return (
      this.implementSolutionStepWasMarkedAsComplete ||
      this.runTestsStepIsComplete ||
      this.args.repository.lastSubmission?.courseStage === this.args.courseStage // Run tests (in progress)
    );
  }

  get implementSolutionStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInSecondStageInstructions.includes('implement-solution');
  }

  get readInstructionsStepIsComplete() {
    return this.implementSolutionStepIsComplete || this.readInstructionsStepWasMarkedAsComplete;
  }

  get readInstructionsStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInSecondStageInstructions.includes('read-instructions');
  }

  get runTestsStepIsComplete() {
    return (
      this.args.repository.stageIsComplete(this.args.courseStage) ||
      (this.args.repository.lastSubmissionHasSuccessStatus && this.args.repository.lastSubmission.courseStage === this.args.courseStage)
    );
  }

  get steps() {
    return [
      new ReadInstructionsStep(this.args.repository, this.readInstructionsStepIsComplete),
      new ImplementSolutionStep(this.args.repository, this.implementSolutionStepIsComplete),
      new RunTestsStep(this.args.repository, this.runTestsStepIsComplete),
    ];
  }

  @action
  handleStepCompletedManually(step: Step) {
    if (step.id === 'read-instructions') {
      this.coursePageState.recordManuallyCompletedStepInSecondStageInstructions('read-instructions');
    }

    if (step.id === 'implement-solution') {
      this.coursePageState.recordManuallyCompletedStepInSecondStageInstructions('read-instructions');
      this.coursePageState.recordManuallyCompletedStepInSecondStageInstructions('implement-solution');
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
