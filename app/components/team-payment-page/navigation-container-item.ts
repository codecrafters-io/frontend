import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isComplete?: boolean;
    isCurrent: boolean;
    name: string;
    previousStepsAreComplete: boolean;
  };
}

export default class NavigationContainerItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::NavigationContainerItem': typeof NavigationContainerItem;
  }
}
