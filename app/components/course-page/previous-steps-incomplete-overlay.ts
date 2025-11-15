import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: StepDefinition;
  };

  Blocks: {
    default: [];
  };
}

export default class PreviousStepsIncompleteOverlay extends Component<Signature> {
  transition = fade;

  @tracked modalWasDismissed = false;
  @tracked lastSeenStepId: string | null = null;

  @service declare coursePageState: CoursePageStateService;

  get shouldShowModal(): boolean {
    // This _shouldn't_ happen as long as we're always rendered in the course page, but let's be safe
    if (!this.coursePageState.activeStep) {
      return false;
    }

    return !this.modalWasDismissed && this.args.currentStep.status === 'locked';
  }

  @action
  handleModalDismissed() {
    this.modalWasDismissed = true;
  }

  @action
  handleStepIdUpdated() {
    if (this.args.currentStep.id === this.lastSeenStepId) {
      return;
    }

    // If the modal was dismissed and the step is no longer locked, let's reset state so it shows again on locked steps
    if (this.modalWasDismissed && this.args.currentStep.status !== 'locked') {
      this.modalWasDismissed = false;
    }

    this.lastSeenStepId = this.args.currentStep.id;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::PreviousStepsIncompleteOverlay': typeof PreviousStepsIncompleteOverlay;
  }
}
