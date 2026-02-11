import Component from '@glimmer/component';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

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
  transition = fade;

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
  handleNoticeClick() {
    this.modalWasDismissed = false;
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
    'CoursePage::CourseStageStep::TestsPassedOverlay': typeof TestsPassedOverlay;
  }
}
