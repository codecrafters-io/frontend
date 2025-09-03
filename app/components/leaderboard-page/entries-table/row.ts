import Component from '@glimmer/component';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';

interface Signature {
  Element: HTMLTableRowElement;

  Args: {
    entry: LeaderboardEntryModel;
    index: number;
  };
}

export default class LeaderboardPageEntriesTableRow extends Component<Signature> {
  get isCurrentUser(): boolean {
    return this.args.entry.user.username === 'ry';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable::Row': typeof LeaderboardPageEntriesTableRow;
  }
}
