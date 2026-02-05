import Component from '@glimmer/component';
import type SetupStep from 'codecrafters-frontend/utils/course-page-step-list/setup-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onNextButtonClick: () => void;
    onStepSelect: (stepNumber: number) => void;
    step: SetupStep;
  };
}

export default class WorkflowTutorialStep2ScreenComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStepCompleteModal::WorkflowTutorialStep2Screen': typeof WorkflowTutorialStep2ScreenComponent;
  }
}
