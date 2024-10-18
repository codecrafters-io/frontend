import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    step: Step;
    repository: RepositoryModel;
  };

  Blocks: {
    default: [];
  };
}

export default class StepContentComponent extends Component<Signature> {
  @tracked previousStepsIncompleteModalWasDismissed = false;
  @tracked lastSeenStepId: string | null = null;

  @service declare coursePageState: CoursePageStateService;

  get shouldHideCompletionNotice(): boolean {
    return this.args.step.type === 'IntroductionStep' || this.args.step.type === 'SetupStep' || this.args.step.type === 'CourseStageStep';
  }

  get shouldShowPreviousStepsIncompleteModal(): boolean {
    return !this.previousStepsIncompleteModalWasDismissed && this.args.step.status === 'locked';
  }

  @action
  handlePreviousStepsIncompleteModalDismissed() {
    this.previousStepsIncompleteModalWasDismissed = true;
  }

  @action
  handleStepIdUpdated() {
    if (this.args.step.id === this.lastSeenStepId) {
      return;
    }

    this.lastSeenStepId = this.args.step.id;
    this.previousStepsIncompleteModalWasDismissed = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepContent': typeof StepContentComponent;
  }
}
