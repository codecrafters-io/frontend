import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import move from 'ember-animated/motions/move';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { Sprite } from 'ember-animated';
import { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import { action } from '@ember/object';
import { easeOut, easeIn } from 'ember-animated/easings/cosine';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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
  fade = fade;

  @tracked modalWasDismissed = false;
  @tracked lastSeenStepStatus: string | null = null;

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
  handleStepStatusUpdated() {
    if (this.args.currentStep.status === this.lastSeenStepStatus) {
      return;
    }

    this.lastSeenStepStatus = this.args.currentStep.status;
    this.modalWasDismissed = false;
  }

  // eslint-disable-next-line require-yield
  *transition({ insertedSprites, keptSprites, removedSprites }: { insertedSprites: Sprite[]; keptSprites: Sprite[]; removedSprites: Sprite[] }) {
    insertedSprites.forEach((sprite) => {
      fadeIn(sprite);
      sprite.startTranslatedBy(0, -50);
      sprite.applyStyles({ 'z-index': '1' });
      move(sprite, { easing: easeOut });
    });

    keptSprites.forEach((sprite) => {
      move(sprite);
    });

    removedSprites.forEach((sprite) => {
      fadeOut(sprite);
      sprite.applyStyles({ 'z-index': '1' });
      sprite.endTranslatedBy(0, -50);
      move(sprite, { easing: easeIn });
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::PreviousStepsIncompleteOverlay': typeof PreviousStepsIncompleteOverlay;
  }
}
