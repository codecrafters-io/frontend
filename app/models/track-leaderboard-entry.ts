import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

import LanguageModel from 'codecrafters-frontend/models/language';
import UserModel from 'codecrafters-frontend/models/user';

export default class TrackLeaderboardEntryModel extends Model {
  @attr('number') declare completedStagesCount: number;

  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  get userId() {
    return this.user.id;
  }
}
