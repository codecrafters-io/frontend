import Controller from '@ember/controller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type LeaderboardModel from 'codecrafters-frontend/models/leaderboard';
import type Store from '@ember-data/store';
import type { ModelType } from 'codecrafters-frontend/routes/leaderboard';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type LeaderboardRankCalculationModel from 'codecrafters-frontend/models/leaderboard-rank-calculation';

export default class LeaderboardController extends Controller {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked surroundingEntries: LeaderboardEntryModel[] = [];
  @tracked topEntries: LeaderboardEntryModel[] = [];
  @tracked userRankCalculation: LeaderboardRankCalculationModel | null = null;

  declare model: ModelType;

  get allEntries(): LeaderboardEntryModel[] {
    return [...this.surroundingEntries, ...this.topEntries];
  }

  get isLoadingEntries(): boolean {
    return this.loadEntriesTask.isRunning;
  }

  get leaderboard(): LeaderboardModel {
    return this.model.language.leaderboard!;
  }

  get sortedLanguagesForDropdown(): LanguageModel[] {
    return this.store
      .peekAll('language')
      .sortBy('sortPositionForTrack')
      .filter((language) => language.liveOrBetaStagesCount > 0);
  }

  get userEntry(): LeaderboardEntryModel | undefined {
    return this.allEntries.find((entry) => entry.user.id === this.authenticator.currentUserId);
  }

  get userIsInTopLeaderboardEntries(): boolean {
    if (!this.authenticator.isAuthenticated) {
      return false;
    }

    return this.topEntries.some((entry) => entry.user.id === this.authenticator.currentUserId);
  }

  loadEntriesTask = task({ restartable: true }, async () => {
    this.topEntries = (await this.store.query('leaderboard-entry', {
      include: 'leaderboard,user',
      leaderboard_id: this.leaderboard.id,
      filter_type: 'top',
    })) as unknown as LeaderboardEntryModel[];

    if (!this.authenticator.isAuthenticated) {
      return;
    }

    this.surroundingEntries = (await this.store.query('leaderboard-entry', {
      include: 'leaderboard,user',
      leaderboard_id: this.leaderboard.id,
      user_id: this.authenticator.currentUserId, // Only used in tests since mirage doesn't have auth context
      filter_type: 'around_me',
    })) as unknown as LeaderboardEntryModel[];

    if (this.surroundingEntries.length === 0) {
      return;
    }

    const userRankCalculations = (await this.store.query('leaderboard-rank-calculation', {
      include: 'user',
      leaderboard_id: this.model.language.leaderboard!.id,
      user_id: this.authenticator.currentUserId, // Only used in tests since mirage doesn't have auth context
    })) as unknown as LeaderboardRankCalculationModel[];

    this.userRankCalculation = userRankCalculations[0] || null;

    // TODO: Also look at "outdated" user rank calculations?
    if (!this.userRankCalculation) {
      this.userRankCalculation = await this.store
        .createRecord('leaderboard-rank-calculation', {
          leaderboard: this.model.language.leaderboard!,
          user: this.authenticator.currentUser!,
        })
        .save();
    }
  });
}
