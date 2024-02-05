import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Args: {
    onContinueButtonClick: () => void;
  };

  Element: HTMLDivElement;
};

export default class Step2Component extends Component<Signature> {
  @tracked freeFormInput = '';
  @tracked selectedOptions: string[] = [];

  options = ['Friend/Colleague', 'YouTube', 'Reddit', 'Hacker News', 'Twitter', 'GitHub', 'Google', 'Conference', "Don't remember"];

  @action
  handleFreeFormInputChange(freeFormInput: string) {
    this.freeFormInput = freeFormInput;
  }

  @action
  handleSelectedOptionsChange(selectedOptions: string[]) {
    this.selectedOptions = selectedOptions;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard::Step2': typeof Step2Component;
  }
}
