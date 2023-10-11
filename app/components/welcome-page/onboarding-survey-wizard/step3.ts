import Component from '@glimmer/component';

type Signature = {
  Args: {
    onContinueButtonClick: () => void;
  };

  Element: HTMLDivElement;
};

export default class Step3Component extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard::Step3': typeof Step3Component;
  }
}
