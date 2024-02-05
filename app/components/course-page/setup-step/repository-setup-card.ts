import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import { action } from '@ember/object';
import type ConfettiService from 'codecrafters-frontend/services/confetti';
import { tracked } from 'tracked-built-ins';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
};

export default class RepositorySetupCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare confetti: ConfettiService;

  @tracked isCompleteOriginallyWas: boolean | undefined;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.isCompleteOriginallyWas = this.isComplete;
  }

  get isComplete() {
    return this.coursePageState.currentStep.status === 'complete';
  }

  @action
  handleDidInsertStepCompletedMessage(_element: HTMLParagraphElement) {
    if (this.isComplete && !this.isCompleteOriginallyWas) {
      this.confetti.fire({
        particleCount: 200,
        spread: 100,
      });
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard': typeof RepositorySetupCardComponent;
  }
}
