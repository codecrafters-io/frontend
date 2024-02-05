import { action } from '@ember/object';
import Component from '@glimmer/component';

type Signature = {
  Args: {
    freeFormInput: string;
    onContinueButtonClick: () => void;
    onFreeFormInputChange: (value: string) => void;
    onSelectedOptionsChange: (selectedOptions: string[]) => void;
    options: string[];
    selectedOptions: string[];
    title: string;
  };

  Element: HTMLDivElement;
};

export default class StepComponent extends Component<Signature> {
  get isContinueButtonDisabled() {
    return this.args.selectedOptions.length === 0 && this.args.freeFormInput.trim() === '';
  }

  @action
  handleFreeFormInputChange(event: Event) {
    this.args.onFreeFormInputChange((event.target as HTMLTextAreaElement).value);
  }

  @action
  handleOptionClick(option: string) {
    if (this.args.selectedOptions.includes(option)) {
      this.args.onSelectedOptionsChange(this.args.selectedOptions.filter((selectedOption) => selectedOption !== option));
    } else {
      this.args.onSelectedOptionsChange([...this.args.selectedOptions, option]);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard::Step': typeof StepComponent;
  }
}
