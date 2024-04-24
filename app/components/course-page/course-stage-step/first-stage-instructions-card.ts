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

class UncommentCodeStep implements Step {
  id = 'uncomment-code';
  isComplete: boolean;
  canBeCompletedManually = true;

  constructor(isComplete: boolean) {
    this.isComplete = isComplete;
  }

  get title() {
    return 'Uncomment code';
  }
}

class RunTestsStep implements Step {
  id = 'run-tests';
  isComplete: boolean;
  canBeCompletedManually = false;

  constructor(isComplete: boolean) {
    this.isComplete = isComplete;
  }

  get title() {
    return 'Run tests';
  }
}

class MarkStageAsCompleteStep implements Step {
  id = 'mark-stage-as-complete';
  isComplete: boolean;
  canBeCompletedManually = false;

  constructor(isComplete: boolean) {
    this.isComplete = isComplete;
  }

  get title() {
    return 'Mark stage as complete';
  }
}

export default class FirstStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  @tracked uncommentCodeStepWasMarkedAsComplete = false;

  get markStageAsCompleteStepIsComplete() {
    return this.args.repository.stageIsComplete(this.args.courseStage);
  }

  get runTestsStepIsComplete() {
    return this.markStageAsCompleteStepIsComplete || this.args.repository.lastSubmissionHasSuccessStatus;
  }

  get steps() {
    return [
      new UncommentCodeStep(this.uncommentCodeStepIsComplete),
      new RunTestsStep(this.runTestsStepIsComplete),
      new MarkStageAsCompleteStep(this.markStageAsCompleteStepIsComplete),
    ];
  }

  get uncommentCodeStepIsComplete() {
    return this.uncommentCodeStepWasMarkedAsComplete || this.runTestsStepIsComplete;
  }

  @action
  handleStepCompletedManually(step: Step) {
    if (step.id === 'uncomment-code') {
      this.uncommentCodeStepWasMarkedAsComplete = true;
    }
  }

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageInstructionsCard': typeof FirstStageInstructionsCardComponent;
  }
}
