import Component from '@glimmer/component';
import type CourseStageCompletionService from 'codecrafters-frontend/services/course-stage-completion';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    currentStep: CourseStageStep;
  };
}

export default class TestsPassedModalComponent extends Component<Signature> {
  @service declare courseStageCompletion: CourseStageCompletionService;

  @tracked action: 'choose_action' | 'refactor_code' | 'mark_stage_as_complete' | 'submit_code' = 'choose_action';

  @action
  @waitFor
  async handleActionButtonClick(action: 'refactor_code' | 'mark_stage_as_complete' | 'choose_action') {
    if (action === 'mark_stage_as_complete') {
      if (this.args.currentStep.repository.lastSubmissionCanBeUsedForStageCompletion) {
        this.action = 'choose_action';

        await this.courseStageCompletion.createTask.perform(this.args.currentStep.repository);
      } else {
        this.action = 'submit_code';
      }
    } else {
      this.action = action;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedModal': typeof TestsPassedModalComponent;
  }
}
