import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type LeaderboardModel from 'codecrafters-frontend/models/leaderboard';
import type LeaderboardRankCalculationModel from 'codecrafters-frontend/models/leaderboard-rank-calculation';
import type Store from '@ember-data/store';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LeaderboardEntriesCache {
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;

  @tracked declare leaderboard: LeaderboardModel;
  @tracked isLoaded: boolean = false;
  @tracked surroundingEntries: LeaderboardEntryModel[] = [];
  @tracked topEntries: LeaderboardEntryModel[] = [];
  @tracked userRankCalculation: LeaderboardRankCalculationModel | null = null;

  constructor(leaderboard: LeaderboardModel) {
    this.leaderboard = leaderboard;
  }

  get userIsInTopLeaderboardEntries(): boolean {
    if (!this.authenticator.isAuthenticated) {
      return false;
    }

    return this.topEntries.some((entry) => entry.user.id === this.authenticator.currentUserId);
  }

  @action
  async loadOrRefresh() {
    await this.loadEntriesTask.perform();
  }

  loadEntriesTask = task({ restartable: true }, async () => {
    this.topEntries = (await this.store.query('leaderboard-entry', {
      include: 'affiliate-link,affiliate-link.user,leaderboard,user',
      leaderboard_id: this.leaderboard.id,
      filter_type: 'top',
    })) as unknown as LeaderboardEntryModel[];

    if (this.authenticator.isAuthenticated || !this.userIsInTopLeaderboardEntries) {
      this.surroundingEntries = (await this.store.query('leaderboard-entry', {
        include: 'affiliate-link,affiliate-link.user,leaderboard,user',
        leaderboard_id: this.leaderboard.id,
        user_id: this.authenticator.currentUserId, // Only used in tests since mirage doesn't have auth context
        filter_type: 'around_me',
      })) as unknown as LeaderboardEntryModel[];
    }

    if (this.surroundingEntries.length > 0) {
      const userRankCalculations = (await this.store.query('leaderboard-rank-calculation', {
        include: 'user',
        leaderboard_id: this.leaderboard!.id,
        user_id: this.authenticator.currentUserId, // Only used in tests since mirage doesn't have auth context
      })) as unknown as LeaderboardRankCalculationModel[];

      this.userRankCalculation = userRankCalculations[0] || null;

      // TODO: Also look at "outdated" user rank calculations?
      if (!this.userRankCalculation) {
        this.userRankCalculation = await this.store
          .createRecord('leaderboard-rank-calculation', {
            leaderboard: this.leaderboard!,
            user: this.authenticator.currentUser!,
          })
          .save();
      }
    }

    this.isLoaded = true;
  });
}
