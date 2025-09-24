import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    previousStepsAreComplete?: boolean;
    isCurrent?: boolean;
    isComplete?: boolean;
    name?: string;
  };
}

export default class NavigationContainerItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::NavigationContainerItem': typeof NavigationContainerItem;
  }
}
