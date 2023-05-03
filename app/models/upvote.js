import Model from '@ember-data/model';
import { belongsTo } from '@ember-data/model';

export default class UpvoteModel extends Model {
  @belongsTo('target', { async: false, polymorphic: true }) target;
  @belongsTo('user', { async: false }) user;
}
