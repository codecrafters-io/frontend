import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    allContests: ContestModel[];
    contest: ContestModel;
  };
};

export default class ContestPagePrizeDetailsCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::PrizeDetailsCard': typeof ContestPagePrizeDetailsCardComponent;
  }
}
