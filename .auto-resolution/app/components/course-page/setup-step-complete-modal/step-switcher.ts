import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: number;
    onStepSelect: (stepNumber: number) => void;
    totalSteps: number;
  };
}

export default class StepSwitcherComponent extends Component<Signature> {
  get steps() {
    return Array.from({ length: this.args.totalSteps }, (_, i) => i + 1);
  }

  @action
  handleStepClick(stepNumber: number) {
    this.args.onStepSelect(stepNumber);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStepCompleteModal::StepSwitcher': typeof StepSwitcherComponent;
  }
}
