import { action } from '@ember/object';
import Component from '@glimmer/component';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';

type Signature = {
  Args: {
    onboardingSurvey: OnboardingSurveyModel;
    onContinueButtonClick: () => void;
    onSurveyUpdated: () => void;
  };

  Element: HTMLDivElement;
};

export default class Step1Component extends Component<Signature> {
  options = ['Pick up a new language', 'Master a language', 'Build portfolio projects', 'Interview prep', 'Not sure yet'];

  @action
  handleFreeFormInputBlur() {
    // We don't trigger the onSurveyUpdated action on every keystroke, only when the user leaves the input field.
    this.args.onSurveyUpdated();
  }

  @action
  handleFreeFormInputChange(freeFormInput: string) {
    this.args.onboardingSurvey.freeFormAnswerForUsagePurpose = freeFormInput;
  }

  @action
  handleSelectedOptionsChange(selectedOptions: string[]) {
    this.args.onboardingSurvey.selectedOptionsForUsagePurpose = selectedOptions;
    this.args.onSurveyUpdated();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard::Step1': typeof Step1Component;
  }
}
