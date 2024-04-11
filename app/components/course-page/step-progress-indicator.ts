import Component from '@glimmer/component';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';

// Signature
interface Signature {
  Element: HTMLDivElement;

  Args: {
    shouldHideExplanationTooltip?: boolean;
    step: Step;
    size?: 'base' | 'large';
  };
}

export default class StepProgressIndicatorComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepProgressIndicator': typeof StepProgressIndicatorComponent;
  }
}
