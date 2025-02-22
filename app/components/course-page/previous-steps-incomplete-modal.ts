import Component from '@glimmer/component';
import type Step from 'codecrafters-frontend/utils/course-page-step-list/step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    activeStep: Step;
  };
}

export default class PreviousStepsIncompleteModalComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::PreviousStepsIncompleteModal': typeof PreviousStepsIncompleteModalComponent;
  }
}
