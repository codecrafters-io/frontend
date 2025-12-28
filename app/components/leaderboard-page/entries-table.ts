import Component from '@glimmer/component';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntriesCache from 'codecrafters-frontend/utils/leaderboard-entries-cache';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    entriesCache: LeaderboardEntriesCache;
    language: LanguageModel;
  };
}

export default class LeaderboardPageEntriesTable extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable': typeof LeaderboardPageEntriesTable;
  }
}
