import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TrackLeaderboardEntryModel extends Model {
  @attr('number') completedStagesCount;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false, inverse: null }) user;

  get userId() {
    return this.user.id;
  }
}
