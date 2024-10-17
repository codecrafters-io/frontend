import Component from '@glimmer/component';
import type Step from 'codecrafters-frontend/utils/course-page-step-list/step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isBlurred: boolean;
    onClose: () => void;
    activeStep: Step;
  };

  Blocks: {
    default: [];
  };
}

export default class PreviousStepsIncompleteOverlayComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::PreviousStepsIncompleteOverlay': typeof PreviousStepsIncompleteOverlayComponent;
  }
}
