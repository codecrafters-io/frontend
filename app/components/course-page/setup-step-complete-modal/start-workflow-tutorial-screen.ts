import Component from '@glimmer/component';
import type SetupStep from 'codecrafters-frontend/utils/course-page-step-list/setup-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onNextButtonClick: () => void;
    onShowInstructionsAgainButtonClick: () => void;
    step: SetupStep;
  };
}

export default class StartWorkflowTutorialScreenComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStepCompleteModal::StartWorkflowTutorialScreen': typeof StartWorkflowTutorialScreenComponent;
  }
}
