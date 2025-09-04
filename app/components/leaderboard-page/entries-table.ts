import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type LeaderboardRankCalculationModel from 'codecrafters-frontend/models/leaderboard-rank-calculation';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
    topEntries: LeaderboardEntryModel[];
  };
}

export default class LeaderboardPageEntriesTable extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked surroundingEntries: LeaderboardEntryModel[] = [];
  @tracked userRankCalculation: LeaderboardRankCalculationModel | null = null;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    if (this.authenticator.isAuthenticated) {
      this.loadUserSpecificResourcesTask.perform();
    }
  }

  get explanationMarkdownForScore() {
    return `
The highest possible score for this track is ${this.args.language.leaderboard!.highestPossibleScore}.

Harder stages have higher scores assigned to them.
`.trim();
  }

  get explanationMarkdownForStagesCompleted() {
    return `There are ${this.args.language.stagesCount} stages available in this track.`;
  }

  get hasEntries() {
    return this.args.topEntries.length > 0;
  }

  get shouldShowSurroundingEntries(): boolean {
    return !this.userIsInTopLeaderboardEntries && this.surroundingEntries.length > 0;
  }

  get sortedSurroundingEntries() {
    return this.surroundingEntries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get sortedSurroundingEntriesWithRanks() {
    return this.sortedSurroundingEntries.map((entry, index) => ({
      entry: entry,
      rank: this.userRankCalculation!.rank + (index - this.userEntryIndexInSurroundingEntries),
    }));
  }

  get sortedTopEntries() {
    return this.args.topEntries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
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

  loadUserSpecificResourcesTask = task({ keepLatest: true }, async (): Promise<void> => {
    if (!this.userIsInTopLeaderboardEntries) {
      this.surroundingEntries = (await this.store.query('leaderboard-entry', {
        include: 'leaderboard,user',
        leaderboard_id: this.args.language.leaderboard!.id,
        user_id: this.authenticator.currentUserId, // Only used in tests since mirage doesn't have auth context
        filter_type: 'around_me',
      })) as unknown as LeaderboardEntryModel[];

      const userRankCalculations = (await this.store.query('leaderboard-rank-calculation', {
        include: 'user',
        leaderboard_id: this.args.language.leaderboard!.id,
        user_id: this.authenticator.currentUserId, // Only used in tests since mirage doesn't have auth context
      })) as unknown as LeaderboardRankCalculationModel[];

      this.userRankCalculation = userRankCalculations[0] || null;

      // TODO: Also look at "outdated" user rank calculations?
      if (!this.userRankCalculation) {
        this.userRankCalculation = await this.store
          .createRecord('leaderboard-rank-calculation', {
            leaderboard: this.args.language.leaderboard!,
            user: this.authenticator.currentUser!,
          })
          .save();
      }

      console.log(this.userRankCalculation!.rank);
    }
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable': typeof LeaderboardPageEntriesTable;
  }
}
