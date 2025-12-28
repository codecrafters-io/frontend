import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type LeaderboardRankCalculationModel from 'codecrafters-frontend/models/leaderboard-rank-calculation';
import type Store from '@ember-data/store';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isLoadingEntries: boolean;
    language: LanguageModel;
    surroundingEntries: LeaderboardEntryModel[];
    topEntries: LeaderboardEntryModel[];
    userRankCalculation: LeaderboardRankCalculationModel | null;
  };
}

export default class LeaderboardPageEntriesTable extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  get hasEntries() {
    return this.args.topEntries.length > 0;
  }

  get shouldShowSurroundingEntries(): boolean {
    return this.args.surroundingEntries.length > 0 && !this.surroundingEntriesOverlapsTopEntries;
  }

  get sortedSurroundingEntries() {
    return this.args.surroundingEntries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get sortedSurroundingEntriesWithRanks() {
    return this.sortedSurroundingEntries.map((entry, index) => ({
      entry: entry,
      rank: this.args.userRankCalculation!.rank + (index - this.userEntryIndexInSurroundingEntries),
    }));
  }

  get sortedTopEntries() {
    return this.args.topEntries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get surroundingEntriesOverlapsTopEntries(): boolean {
    return this.args.surroundingEntries.some((entry) => this.args.topEntries.map((e) => e.user.id).includes(entry.user.id));
  }

  get userEntryIndexInSurroundingEntries() {
    return this.sortedSurroundingEntries.findIndex((entry) => entry.user.id === this.authenticator.currentUserId);
  }

  get userIsInTopLeaderboardEntries(): boolean {
    if (!this.authenticator.isAuthenticated) {
      return false;
    }

    return this.args.topEntries.some((entry) => entry.user.id === this.authenticator.currentUserId);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable': typeof LeaderboardPageEntriesTable;
  }
}
