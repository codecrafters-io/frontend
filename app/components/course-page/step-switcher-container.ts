import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';
import { Step, StepList } from 'codecrafters-frontend/lib/course-page-step-list';
import { service } from '@ember/service';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    currentStep: Step;
    stepList: StepList;
  };
};

export default class StepSwitcherComponent extends Component<Signature> {
  @service router!: RouterService;

  get nextStep() {
    return this.args.stepList.nextVisibleStepFor(this.args.currentStep);
  }

  get nextStepRouteParams() {
    return this.nextStep?.contextualRouteParamsFor(this.router.currentRouteName);
  }

  get previousStep() {
    return this.args.stepList.previousVisibleStepFor(this.args.currentStep);
  }

  get previousStepRouteParams() {
    return this.previousStep?.contextualRouteParamsFor(this.router.currentRouteName);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepSwitcherContainer': typeof StepSwitcherComponent;
  }
}
