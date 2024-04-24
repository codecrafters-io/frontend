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

  constructor(isComplete: boolean) {
    this.isComplete = isComplete;
  }
}

class NavigateToFileStep extends BaseStep implements Step {
  id = 'navigate-to-file';
  canBeCompletedManually = true;

  get title() {
    return 'Navigate to file';
  }
}

class UncommentCodeStep extends BaseStep implements Step {
  id = 'uncomment-code';
  canBeCompletedManually = true;

  get title() {
    return 'Uncomment code';
  }
}

class SubmitCodeStep extends BaseStep implements Step {
  id = 'submit-code';
  canBeCompletedManually = false;

  get title() {
    return 'Submit changes';
  }
}

export default class FirstStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  @tracked uncommentCodeStepWasMarkedAsComplete = false;
  @tracked navigateToFileStepWasMarkedAsComplete = false;

  get allStepsAreComplete() {
    return this.args.repository.stageIsComplete(this.args.courseStage);
  }

  get navigateToFileStepIsComplete() {
    return this.navigateToFileStepWasMarkedAsComplete || this.uncommentCodeStepIsComplete;
  }

  get steps() {
    return [
      new NavigateToFileStep(this.navigateToFileStepIsComplete),
      new UncommentCodeStep(this.uncommentCodeStepIsComplete),
      new SubmitCodeStep(this.allStepsAreComplete),
    ];
  }

  get uncommentCodeStepIsComplete() {
    return this.uncommentCodeStepWasMarkedAsComplete || this.args.repository.stageIsComplete(this.args.courseStage);
  }

  @action
  handleStepCompletedManually(step: Step) {
    if (step.id === 'navigate-to-file') {
      this.navigateToFileStepWasMarkedAsComplete = true;
    }

    if (step.id === 'uncomment-code') {
      this.uncommentCodeStepWasMarkedAsComplete = true;
      this.navigateToFileStepWasMarkedAsComplete = true;
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
