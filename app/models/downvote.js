import Model from '@ember-data/model';
import { belongsTo } from '@ember-data/model';

export default class DownvoteModel extends Model {
  @belongsTo('downvotable', { async: false, polymorphic: true }) downvotable;
  @belongsTo('user', { async: false }) user;
}
