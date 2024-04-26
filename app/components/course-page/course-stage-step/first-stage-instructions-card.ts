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

class NavigateToFileStep extends BaseStep implements Step {
  id = 'navigate-to-file';
  canBeCompletedManually = true;

  get titleMarkdown() {
    if (!this.repository.firstStageSolution) {
      return 'Navigate to README.md';
    }

    const filename = this.repository.firstStageSolution.changedFiles[0].filename;

    if (filename) {
      return `Navigate to ${filename}`;
    } else {
      return 'Navigate to file';
    }
  }
}

class UncommentCodeStep extends BaseStep implements Step {
  id = 'uncomment-code';
  canBeCompletedManually = true;

  get titleMarkdown() {
    return 'Uncomment code';
  }
}

class SubmitCodeStep extends BaseStep implements Step {
  id = 'submit-code';
  canBeCompletedManually = false;

  get titleMarkdown() {
    return 'Submit changes';
  }
}

export default class FirstStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  get navigateToFileStepIsComplete() {
    return this.navigateToFileStepWasMarkedAsComplete || this.uncommentCodeStepIsComplete;
  }

  get navigateToFileStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInFirstStageInstructions.includes('navigate-to-file');
  }

  get steps() {
    return [
      new NavigateToFileStep(this.args.repository, this.navigateToFileStepIsComplete),
      new UncommentCodeStep(this.args.repository, this.uncommentCodeStepIsComplete),
      new SubmitCodeStep(this.args.repository, this.submitCodeStepIsComplete),
    ];
  }

  get submitCodeStepIsComplete() {
    return this.args.repository.lastSubmissionHasSuccessStatus || this.args.repository.stageIsComplete(this.args.courseStage);
  }

  get uncommentCodeStepIsComplete() {
    return this.uncommentCodeStepWasMarkedAsComplete || this.submitCodeStepIsComplete;
  }

  get uncommentCodeStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInFirstStageInstructions.includes('uncomment-code');
  }

  @action
  handleStepCompletedManually(step: Step) {
    if (step.id === 'navigate-to-file') {
      this.coursePageState.recordManuallyCompletedStepInFirstStageInstructions('navigate-to-file');
    }

    if (step.id === 'uncomment-code') {
      this.coursePageState.recordManuallyCompletedStepInFirstStageInstructions('uncomment-code');
      this.coursePageState.recordManuallyCompletedStepInFirstStageInstructions('navigate-to-file');
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
