import Component from '@glimmer/component';
import type SetupStep from 'codecrafters-frontend/utils/course-page-step-list/setup-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    step: SetupStep;
    onNextButtonClick: () => void;
    onBackToReviewClick: () => void;
  };
}

export default class WorkflowTutorialCompletedScreenComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStepCompleteModal::WorkflowTutorialCompletedScreen': typeof WorkflowTutorialCompletedScreenComponent;
  }
}
