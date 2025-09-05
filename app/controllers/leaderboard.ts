import Controller from '@ember/controller';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type Store from '@ember-data/store';
import type { ModelType } from 'codecrafters-frontend/routes/leaderboard';
import { inject as service } from '@ember/service';

export default class LeaderboardController extends Controller {
  @service declare store: Store;

  declare model: ModelType;

  get sortedLanguagesForDropdown(): LanguageModel[] {
    return this.store
      .peekAll('language')
      .sortBy('sortPositionForTrack')
      .filter((language) => language.liveOrBetaStagesCount > 0);
  }
}
