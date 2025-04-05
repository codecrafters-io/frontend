import Component from '@glimmer/component';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    currentStep: CourseStageStep;
  };
}

export default class TestsPassedModalComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked action: 'choose_action' | 'refactor_code' | 'mark_stage_as_complete' | 'submit_code' = 'choose_action';

  @action
  handleActionButtonClick(action: 'refactor_code' | 'mark_stage_as_complete' | 'choose_action') {
    if (action === 'mark_stage_as_complete') {
      if (this.args.currentStep.repository.lastSubmissionCanBeUsedForStageCompletion) {
        this.action = 'choose_action';
        this.createCourseStageCompletionTask.perform();
      } else {
        this.action = 'submit_code';
      }
    } else {
      this.action = action;
    }
  }

  createCourseStageCompletionTask = task(async () => {
    await this.store
      .createRecord('course-stage-completion', {
        courseStage: this.args.currentStep.courseStage,
        repository: this.args.currentStep.repository,
        submission: this.args.currentStep.repository.lastSubmission,
      })
      .save();

    await this.args.currentStep.repository.refreshStateFromServer();
    await this.authenticator.syncCurrentUser();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedModal': typeof TestsPassedModalComponent;
  }
}
