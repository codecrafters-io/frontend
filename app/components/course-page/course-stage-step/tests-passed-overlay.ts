import Component from '@glimmer/component';
import move from 'ember-animated/motions/move';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type { Sprite } from 'ember-animated';
import { action } from '@ember/object';
import { easeOut, easeIn } from 'ember-animated/easings/cosine';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
  };

  Blocks: {
    default: [];
  };
}

export default class TestsPassedOverlay extends Component<Signature> {
  @tracked lastSeenStepId: string | null = null;
  @tracked modalWasDismissed = false;

  get shouldShowModal(): boolean {
    return !this.modalWasDismissed && this.args.currentStep.status === 'in_progress' && this.args.currentStep.testsStatus === 'passed';
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

  // eslint-disable-next-line require-yield
  *transition({ insertedSprites, keptSprites, removedSprites }: { insertedSprites: Sprite[]; keptSprites: Sprite[]; removedSprites: Sprite[] }) {
    insertedSprites.forEach((sprite) => {
      fadeIn(sprite);
      sprite.startTranslatedBy(0, -50);
      sprite.applyStyles({ 'z-index': '1' });
      move(sprite, { easing: easeOut });
    });

    keptSprites.forEach(move);

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
    'CoursePage::CourseStageStep::TestsPassedOverlay': typeof TestsPassedOverlay;
  }
}
