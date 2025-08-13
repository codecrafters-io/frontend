import Component from '@glimmer/component';
import { StepDefinition, StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: StepDefinition;
    stepList: StepListDefinition;
  };
}

export default class StepSwitcher extends Component<Signature> {
  get nextStep() {
    return this.args.stepList.nextVisibleStepFor(this.args.currentStep);
  }

  get previousStep() {
    return this.args.stepList.previousVisibleStepFor(this.args.currentStep);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepSwitcherContainer': typeof StepSwitcher;
  }
}
