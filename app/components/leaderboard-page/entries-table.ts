import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type Store from '@ember-data/store';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    entries: LeaderboardEntryModel[];
  };
}

export default class LeaderboardPageEntriesTable extends Component<Signature> {
  @service declare store: Store;

  get hasEntries() {
    return this.sortedEntries.length > 0;
  }

  get sortedEntries() {
    return this.args.entries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get sortedBottomHalfEntries() {
    return this.sortedEntries.slice(Math.floor(this.sortedEntries.length / 2));
  }

  get sortedTopHalfEntries() {
    return this.sortedEntries.slice(0, Math.floor(this.sortedEntries.length / 2));
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable': typeof LeaderboardPageEntriesTable;
  }
}
