import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

type Signature = {
  // Args: {};

  Element: HTMLDivElement;
};

export default class OnboardingSurveyWizardComponent extends Component<Signature> {
  fade = fade;
  @tracked currentStep = 1;

  @action
  handleContinueButtonClick() {
    this.currentStep++;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard': typeof OnboardingSurveyWizardComponent;
  }
}
