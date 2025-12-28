import Controller from '@ember/controller';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntriesCache from 'codecrafters-frontend/utils/leaderboard-entries-cache';
import type LeaderboardEntriesCacheRegistryService from 'codecrafters-frontend/services/leaderboard-entries-cache-registry';
import type LeaderboardModel from 'codecrafters-frontend/models/leaderboard';
import type Store from '@ember-data/store';
import type { ModelType } from 'codecrafters-frontend/routes/leaderboard';
import { service } from '@ember/service';

export default class LeaderboardController extends Controller {
  @service declare authenticator: AuthenticatorService;
  @service declare leaderboardEntriesCacheRegistry: LeaderboardEntriesCacheRegistryService;
  @service declare store: Store;

  declare model: ModelType;

  get leaderboard(): LeaderboardModel {
    return this.model.language.leaderboard!;
  }

  get leaderboardEntriesCache(): LeaderboardEntriesCache {
    return this.leaderboardEntriesCacheRegistry.getOrCreate(this.leaderboard);
  }

  get sortedLanguagesForDropdown(): LanguageModel[] {
    return (this.store.peekAll('language') as unknown as LanguageModel[])
      .toSorted(fieldComparator('sortPositionForTrack'))
      .filter((language) => language.liveOrBetaStagesCount > 0);
  }
}
