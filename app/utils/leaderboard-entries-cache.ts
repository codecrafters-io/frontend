import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type LeaderboardModel from 'codecrafters-frontend/models/leaderboard';
import type LeaderboardRankCalculationModel from 'codecrafters-frontend/models/leaderboard-rank-calculation';
import type Store from '@ember-data/store';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export interface LeaderboardEntryWithRank {
  entry: LeaderboardEntryModel;
  rank: number;
}

export default class LeaderboardEntriesCache {
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;

  @tracked declare leaderboard: LeaderboardModel;
  @tracked declare isLoaded: boolean;

  @tracked _surroundingEntries: LeaderboardEntryModel[] = [];
  @tracked _topEntries: LeaderboardEntryModel[] = [];
  @tracked _userRankCalculation: LeaderboardRankCalculationModel | null = null;

  constructor(leaderboard: LeaderboardModel) {
    this.leaderboard = leaderboard;
    this.isLoaded = false;
  }

  get _entriesForFirstSection(): LeaderboardEntryModel[] {
    const entries = [...this._topEntries];

    if (this._surroundingEntriesOverlapsTopEntries) {
      entries.push(...this._surroundingEntries);
    }

    return entries;
  }

  get _sortedEntriesForFirstSection(): LeaderboardEntryModel[] {
    return this._entriesForFirstSection.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get _sortedEntriesForSecondSection(): LeaderboardEntryModel[] {
    if (this._surroundingEntriesOverlapsTopEntries) {
      return [];
    }

    return this._surroundingEntries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get _surroundingEntriesOverlapsTopEntries(): boolean {
    return this._surroundingEntries.some((entry) => this._topEntries.map((e) => e.user.id).includes(entry.user.id));
  }

  get _userEntryIndexInSecondSection(): number {
    return this._sortedEntriesForSecondSection.findIndex((entry) => entry.user.id === this.authenticator.currentUserId);
  }

  get _userIsInTopLeaderboardEntries(): boolean {
    if (!this.authenticator.isAuthenticated) {
      return false;
    }

    return this._topEntries.some((entry) => entry.user.id === this.authenticator.currentUserId);
  }

  get entriesForFirstSectionWithRanks(): LeaderboardEntryWithRank[] {
    return this._sortedEntriesForFirstSection.map((entry, index) => ({
      entry: entry,
      rank: index + 1,
    }));
  }

  get entriesForSecondSectionWithRanks(): LeaderboardEntryWithRank[] {
    return this._sortedEntriesForSecondSection.map((entry, index) => ({
      entry: entry,
      rank: this._userRankCalculation!.rank + (index - this._userEntryIndexInSecondSection),
    }));
  }

  get hasEntries(): boolean {
    return this.entriesForFirstSectionWithRanks.length > 0;
  }

  @action
  async loadOrRefresh() {
    await this._loadEntriesTask.perform();
  }

  _loadEntriesTask = task({ restartable: true }, async () => {
    this._topEntries = (await this.store.query('leaderboard-entry', {
      include: 'affiliate-link,affiliate-link.user,leaderboard,user',
      leaderboard_id: this.leaderboard.id,
      filter_type: 'top',
    })) as unknown as LeaderboardEntryModel[];

    if (this.authenticator.isAuthenticated && !this._userIsInTopLeaderboardEntries) {
      this._surroundingEntries = (await this.store.query('leaderboard-entry', {
        include: 'affiliate-link,affiliate-link.user,leaderboard,user',
        leaderboard_id: this.leaderboard.id,
        user_id: this.authenticator.currentUserId, // Only used in tests since mirage doesn't have auth context
        filter_type: 'around_me',
      })) as unknown as LeaderboardEntryModel[];
    }

    if (this._surroundingEntries.length > 0) {
      const userRankCalculations = (await this.store.query('leaderboard-rank-calculation', {
        include: 'user',
        leaderboard_id: this.leaderboard!.id,
        user_id: this.authenticator.currentUserId, // Only used in tests since mirage doesn't have auth context
      })) as unknown as LeaderboardRankCalculationModel[];

      this._userRankCalculation = userRankCalculations[0] || null;

      // TODO: Also look at "outdated" user rank calculations?
      if (!this._userRankCalculation) {
        this._userRankCalculation = await this.store
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
