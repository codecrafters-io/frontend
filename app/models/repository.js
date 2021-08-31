import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @attr('string') cloneUrl;
  @belongsTo('course') course;
  @belongsTo('language') language;
}
