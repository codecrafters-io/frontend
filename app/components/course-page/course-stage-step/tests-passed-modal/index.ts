import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    currentStep: CourseStageStep;
  };
}

export default class TestsPassedModalComponent extends Component<Signature> {
  @tracked action: 'choose_action' | 'refactor_code' | 'mark_stage_as_complete' = 'choose_action';

  @action
  handleActionButtonClick(action: 'refactor_code' | 'mark_stage_as_complete' | 'choose_action') {
    this.action = action;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedModal': typeof TestsPassedModalComponent;
  }
}
