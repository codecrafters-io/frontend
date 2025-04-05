import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isCreatingCourseStageCompletion: boolean;
    onActionButtonClick: (action: 'refactor_code' | 'mark_stage_as_complete') => void;
    onViewInstructionsLinkClick: () => void;
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
