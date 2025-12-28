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
  @service declare private store: Store;
  @service declare private authenticator: AuthenticatorService;

  @tracked declare private leaderboard: LeaderboardModel;
  @tracked isLoaded: boolean = false;
  @tracked private surroundingEntries: LeaderboardEntryModel[] = [];
  @tracked private topEntries: LeaderboardEntryModel[] = [];
  @tracked private userRankCalculation: LeaderboardRankCalculationModel | null = null;

  constructor(leaderboard: LeaderboardModel) {
    this.leaderboard = leaderboard;
  }

  private get entriesForFirstSection(): LeaderboardEntryModel[] {
    const entries = [...this.topEntries];

    if (this.surroundingEntriesOverlapsTopEntries) {
      entries.push(...this.surroundingEntries);
    }

    return entries;
  }

  get entriesForFirstSectionWithRanks(): LeaderboardEntryWithRank[] {
    return this.sortedEntriesForFirstSection.map((entry, index) => ({
      entry: entry,
      rank: index + 1,
    }));
  }

  get entriesForSecondSectionWithRanks(): LeaderboardEntryWithRank[] {
    return this.sortedEntriesForSecondSection.map((entry, index) => ({
      entry: entry,
      rank: this.userRankCalculation!.rank + (index - this.userEntryIndexInSecondSection),
    }));
  }

  get hasEntries(): boolean {
    return this.topEntries.length > 0;
  }

  private get sortedEntriesForFirstSection(): LeaderboardEntryModel[] {
    return this.entriesForFirstSection.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  private get sortedEntriesForSecondSection(): LeaderboardEntryModel[] {
    if (this.surroundingEntriesOverlapsTopEntries) {
      return [];
    }

    return this.surroundingEntries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  private get surroundingEntriesOverlapsTopEntries(): boolean {
    return this.surroundingEntries.some((entry) => this.topEntries.map((e) => e.user.id).includes(entry.user.id));
  }

  private get userEntryIndexInSecondSection(): number {
    return this.sortedEntriesForSecondSection.findIndex((entry) => entry.user.id === this.authenticator.currentUserId);
  }

  private get userIsInTopLeaderboardEntries(): boolean {
    if (!this.authenticator.isAuthenticated) {
      return false;
    }

    return this.topEntries.some((entry) => entry.user.id === this.authenticator.currentUserId);
  }

  @action
  async loadOrRefresh() {
    await this.loadEntriesTask.perform();
  }

  private loadEntriesTask = task({ restartable: true }, async () => {
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
