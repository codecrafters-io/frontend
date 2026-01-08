import Component from '@glimmer/component';
import computeLeaderboardCTA from 'codecrafters-frontend/utils/compute-leaderboard-cta';
import fade from 'ember-animated/transitions/fade';
import move from 'ember-animated/motions/move';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LeaderboardEntriesCache from 'codecrafters-frontend/utils/leaderboard-entries-cache';
import type LeaderboardEntriesCacheRegistryService from 'codecrafters-frontend/services/leaderboard-entries-cache-registry';
import type LeaderboardModel from 'codecrafters-frontend/models/leaderboard';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type { LeaderboardEntryWithRank } from 'codecrafters-frontend/utils/leaderboard-entries-cache';
import { action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentCourseStage?: CourseStageModel;
    isCollapsed: boolean;
    leaderboard: LeaderboardModel;
    repository?: RepositoryModel;
  };
}

export default class TrackLeaderboard extends Component<Signature> {
  transition = fade;
  @service declare authenticator: AuthenticatorService;
  @service declare leaderboardEntriesCacheRegistry: LeaderboardEntriesCacheRegistryService;

  get ctaText(): string | null {
    if (!this.leaderboardEntriesCache.isLoaded || !this.leaderboardEntriesCache.userEntry || !this.leaderboardEntriesCache.userRankCalculation) {
      return null;
    }

    return computeLeaderboardCTA(
      this.leaderboardEntriesCache.userEntry,
      this.leaderboardEntriesCache.userRankCalculation,
      this.args.repository,
      this.args.currentCourseStage,
    );
  }

  get entriesForFirstSectionWithRanks(): LeaderboardEntryWithRank[] {
    if (!this.leaderboardEntriesCache.isLoaded) {
      return [];
    }

    // We have space for ~10 entries in total. Either 10 in the first section, or 5 in first, 5 in second.
    if (this.leaderboardEntriesCache.entriesForSecondSectionWithRanks.length > 0) {
      return this.leaderboardEntriesCache.entriesForFirstSectionWithRanks.slice(0, 5);
    } else {
      return this.leaderboardEntriesCache.entriesForFirstSectionWithRanks.slice(0, 10);
    }
  }

  get entriesForSecondSectionWithRanks(): LeaderboardEntryWithRank[] {
    return this.leaderboardEntriesCache.entriesForSecondSectionWithRanks;
  }

  get leaderboardEntriesCache(): LeaderboardEntriesCache {
    return this.leaderboardEntriesCacheRegistry.getOrCreate(this.args.leaderboard);
  }

  @action
  async handleDidInsert() {
    await this.leaderboardEntriesCache.loadOrRefresh();
  }

  // eslint-disable-next-line require-yield
  *listTransition({
    insertedSprites,
    keptSprites,
    removedSprites,
  }: {
    insertedSprites: unknown[];
    keptSprites: unknown[];
    removedSprites: unknown[];
  }) {
    for (const sprite of keptSprites) {
      move(sprite);
    }

    for (const sprite of insertedSprites) {
      fadeIn(sprite);
    }

    for (const sprite of removedSprites) {
      fadeOut(sprite);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TrackLeaderboard: typeof TrackLeaderboard;
  }
}
