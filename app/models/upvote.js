import Model from '@ember-data/model';
import { belongsTo } from '@ember-data/model';

export default class UpvoteModel extends Model {
  @belongsTo('upvotable', { async: false, polymorphic: true }) upvotable;
  @belongsTo('user', { async: false }) user;
}
