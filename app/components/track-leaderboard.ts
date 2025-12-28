import Component from '@glimmer/component';
import LeaderboardEntriesCache from 'codecrafters-frontend/utils/leaderboard-entries-cache';
import fade from 'ember-animated/transitions/fade';
import move from 'ember-animated/motions/move';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntriesCacheRegistryService from 'codecrafters-frontend/services/leaderboard-entries-cache-registry';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type { LeaderboardEntryWithRank } from 'codecrafters-frontend/utils/leaderboard-entries-cache';
import { action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
  };
}

export interface EntryWithRank {
  entry: LeaderboardEntryModel;
  rank: number;
}

export default class TrackLeaderboard extends Component<Signature> {
  transition = fade;

  @service declare authenticator: AuthenticatorService;
  @service declare leaderboardEntriesCacheRegistry: LeaderboardEntriesCacheRegistryService;

  get entriesCache(): LeaderboardEntriesCache {
    return this.leaderboardEntriesCacheRegistry.getOrCreate(this.leaderboard);
  }

  get leaderboard() {
    return this.args.language.leaderboard!;
  }

  // entriesCache stores 15 entries, we only have space for 10 in the UI
  get truncatedEntriesForFirstSectionWithRanks(): LeaderboardEntryWithRank[] {
    if (this.entriesCache.entriesForSecondSectionWithRanks.length > 0) {
      return this.entriesCache.entriesForFirstSectionWithRanks.slice(0, 5);
    } else {
      return this.entriesCache.entriesForFirstSectionWithRanks.slice(0, 10);
    }
  }

  @action
  async handleDidInsert() {
    if (!this.entriesCache) {
      return;
    }

    await this.entriesCache.loadOrRefresh();
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
