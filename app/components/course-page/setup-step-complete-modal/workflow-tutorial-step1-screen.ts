import Component from '@glimmer/component';
import type SetupStep from 'codecrafters-frontend/utils/course-page-step-list/setup-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onNextButtonClick: () => void;
    step: SetupStep;
  };
}

export default class WorkflowTutorialStep1ScreenComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStepCompleteModal::WorkflowTutorialStep1Screen': typeof WorkflowTutorialStep1ScreenComponent;
  }
}
