import Component from '@glimmer/component';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';

type Signature = {
  Element: HTMLAnchorElement;

  Args: {
    entry: LeaderboardEntryModel;
  };
};

export default class ContestPageLeaderboardEntryComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::LeaderboardEntry': typeof ContestPageLeaderboardEntryComponent;
  }
}
