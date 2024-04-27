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

export default class StepProgressIndicatorComponent extends Component<Signature> {
  get textColorClasses() {
    return {
      gray: 'text-gray-600 dark:text-gray-400',
      green: 'text-green-500 font-medium',
      yellow: 'text-yellow-500 font-medium',
      red: 'text-red-600 dark:text-red-500 font-medium',
    }[this.args.step.progressIndicator?.textColor ?? 'gray'];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepProgressIndicator': typeof StepProgressIndicatorComponent;
  }
}
