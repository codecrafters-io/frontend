import Component from '@glimmer/component';
import { Step, StepList } from 'codecrafters-frontend/utils/course-page-step-list';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    currentStep: Step;
    stepList: StepList;
  };
};

export default class StepSwitcherComponent extends Component<Signature> {
  get nextStep() {
    return this.args.stepList.nextVisibleStepFor(this.args.currentStep);
  }

  get previousStep() {
    return this.args.stepList.previousVisibleStepFor(this.args.currentStep);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepSwitcherContainer': typeof StepSwitcherComponent;
  }
}
