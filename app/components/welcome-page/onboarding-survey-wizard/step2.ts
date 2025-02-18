import { action } from '@ember/object';
import Component from '@glimmer/component';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';

interface Signature {
  Args: {
    onboardingSurvey: OnboardingSurveyModel;
    onContinueButtonClick: () => void;
    onSurveyUpdated: () => void;
  };

  Element: HTMLDivElement;
}

export default class Step2Component extends Component<Signature> {
  options = [
    'YouTube',
    'Instagram',
    'LinkedIn',
    'Facebook',
    'Twitter',
    'Reddit',
    'Hacker News',
    'GitHub',
    'Friend/Colleague',
    'Google',
    'TikTok',
    "Don't remember",
    // 'Newsletter', // Not a lot of entries as of Jul 2024
  ];

  @action
  handleFreeFormInputBlur() {
    // We don't trigger the onSurveyUpdated action on every keystroke, only when the user leaves the input field.
    this.args.onSurveyUpdated();
  }

  @action
  handleFreeFormInputChange(freeFormInput: string) {
    this.args.onboardingSurvey.freeFormAnswerForReferralSource = freeFormInput;
  }

  @action
  handleSelectedOptionsChange(selectedOptions: string[]) {
    this.args.onboardingSurvey.selectedOptionsForReferralSource = selectedOptions;
    this.args.onSurveyUpdated();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard::Step2': typeof Step2Component;
  }
}
