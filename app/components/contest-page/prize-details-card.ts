import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    allContests: ContestModel[];
    contest: ContestModel;
  };
}

export default class ContestPagePrizeDetailsCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::PrizeDetailsCard': typeof ContestPagePrizeDetailsCard;
  }
}
