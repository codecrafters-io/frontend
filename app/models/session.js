import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class SessionModel extends Model {
  @attr('date') expiresAt;
  @belongsTo('user', { async: false }) user;
}
