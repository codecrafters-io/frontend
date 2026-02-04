import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    completedSteps: number[];
    currentStep: number;
    onNavigationItemClick: (step: number) => void;
  };
}

export default class NavigationContainer extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::NavigationContainer': typeof NavigationContainer;
  }
}
