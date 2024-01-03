import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    contest: ContestModel;
  };
};

export default class ContestPageLeaderboardCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::LeaderboardCard': typeof ContestPageLeaderboardCardComponent;
  }
}
