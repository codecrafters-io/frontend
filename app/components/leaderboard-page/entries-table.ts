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

  get entriesForFirstSection() {
    const entries = [...this.args.topEntries];

    if (this.surroundingEntriesOverlapsTopEntries) {
      entries.push(...this.args.surroundingEntries);
    }

    return entries;
  }

  get hasEntries() {
    return this.args.topEntries.length > 0;
  }

  get sortedEntriesForFirstSection() {
    return this.entriesForFirstSection.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get sortedEntriesForSecondSection() {
    if (this.surroundingEntriesOverlapsTopEntries) {
      return [];
    }

    return this.args.surroundingEntries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get sortedEntriesForSecondSectionWithRanks() {
    return this.sortedEntriesForSecondSection.map((entry, index) => ({
      entry: entry,
      rank: this.args.userRankCalculation!.rank + (index - this.userEntryIndexInSecondSection),
    }));
  }

  get surroundingEntriesOverlapsTopEntries(): boolean {
    return this.args.surroundingEntries.some((entry) => this.args.topEntries.map((e) => e.user.id).includes(entry.user.id));
  }

  get userEntryIndexInSecondSection() {
    return this.sortedEntriesForSecondSection.findIndex((entry) => entry.user.id === this.authenticator.currentUserId);
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
