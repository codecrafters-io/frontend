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
    return 'Uncomment Code';
  }
}

class SubmitCodeStep implements Step {
  isComplete = false;
  id = 'submit-code';

  get title() {
    return 'Submit Code';
  }
}

export default class FirstStageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  @tracked uncommentCodeStepIsComplete = false;

  get steps() {
    return [new UncommentCodeStep(this.uncommentCodeStepIsComplete), new SubmitCodeStep()];
  }

  @action
  handleUncommentCodeStepCompleted(stepList: { expandNextStep: () => void }) {
    this.uncommentCodeStepIsComplete = true;
    stepList.expandNextStep();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageInstructionsCard': typeof FirstStageInstructionsCardComponent;
  }
}
