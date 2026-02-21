import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import coursePageOverlayTransition from 'codecrafters-frontend/utils/course-page-overlay-transition';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: StepDefinition;
  };

  Blocks: {
    default: [];
  };
}

export default class CurrentStepCompleteOverlay extends Component<Signature> {
  @tracked modalWasDismissed = false;
  @tracked lastSeenStepStatus: string | null = null;

  @service declare coursePageState: CoursePageStateService;
  transition = coursePageOverlayTransition;

  get shouldShowModal(): boolean {
    if (!this.coursePageState.nextStep) {
      return false;
    }

    return !this.modalWasDismissed && this.args.currentStep.status === 'complete';
  }

  @action
  handleModalDismissed() {
    this.modalWasDismissed = true;
  }

  @action
  handleStepStatusUpdated() {
    if (this.args.currentStep.status === this.lastSeenStepStatus) {
      return;
    }

    this.lastSeenStepStatus = this.args.currentStep.status;
    this.modalWasDismissed = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CurrentStepCompleteOverlay': typeof CurrentStepCompleteOverlay;
  }
}
