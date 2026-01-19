import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    isSelected: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class SelectableItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard::SelectableItem': typeof SelectableItem;
  }
}
