import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Args: {
    onContinueButtonClick: () => void;
  };

  Element: HTMLDivElement;
};

export default class Step1Component extends Component<Signature> {
  @tracked freeFormInput = '';
  @tracked selectedOptions: string[] = [];

  options = ['Pick up a new language', 'Master a language', 'Build portfolio projects', 'Interview prep', 'Not sure yet'];

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
    'WelcomePage::OnboardingSurveyWizard::Step1': typeof Step1Component;
  }
}
