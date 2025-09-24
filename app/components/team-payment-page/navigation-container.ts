import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep?: number;
    completedSteps?: number[];
    onNavigationItemClick: (step: number) => void;
  };
}

export default class NavigationContainer extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::NavigationContainer': typeof NavigationContainer;
  }
}
