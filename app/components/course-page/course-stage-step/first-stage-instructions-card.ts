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

  constructor(isComplete: boolean) {
    this.isComplete = isComplete;
  }

  get title() {
    return 'Uncomment code';
  }
}

class SubmitCodeStep implements Step {
  id = 'submit-code';
  isComplete: boolean;

  constructor(isComplete: boolean) {
    this.isComplete = isComplete;
  }

  get title() {
    return 'Submit changes';
  }
}

export default class FirstStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  @tracked uncommentCodeStepWasMarkedAsComplete = false;

  get allStepsAreComplete() {
    return this.args.repository.stageIsComplete(this.args.courseStage);
  }

  get steps() {
    return [new UncommentCodeStep(this.uncommentCodeStepIsComplete), new SubmitCodeStep(this.allStepsAreComplete)];
  }

  get uncommentCodeStepIsComplete() {
    return this.uncommentCodeStepWasMarkedAsComplete || this.args.repository.stageIsComplete(this.args.courseStage);
  }

  @action
  handleUncommentCodeStepCompleted(stepList: { expandNextStep: () => void }) {
    this.uncommentCodeStepWasMarkedAsComplete = true;
    stepList.expandNextStep();
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
