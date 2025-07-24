import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    actualPriceInDollars: number;
    isSelected: boolean;
  };
}

export default class PlanCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal::PlanCard': typeof PlanCard;
  }
}
