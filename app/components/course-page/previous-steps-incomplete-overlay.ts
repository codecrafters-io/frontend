import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import { Step } from 'codecrafters-frontend/utils/course-page-step-list';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: Step;
  };

  Blocks: {
    default: [];
  };
}

export default class PreviousStepsIncompleteOverlayComponent extends Component<Signature> {
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

    this.lastSeenStepId = this.args.currentStep.id;
    this.modalWasDismissed = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::PreviousStepsIncompleteOverlay': typeof PreviousStepsIncompleteOverlayComponent;
  }
}
