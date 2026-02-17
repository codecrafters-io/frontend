import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
    isCreatingCourseStageCompletion: boolean;
    onActionButtonClick: (action: 'refactor_code' | 'mark_stage_as_complete') => void;
  };
};

export default class ChooseActionStep extends Component<Signature> {
  @tracked action: 'refactor_code' | 'mark_stage_as_complete' = 'refactor_code';
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedModal::ChooseActionStep': typeof ChooseActionStep;
  }
}
