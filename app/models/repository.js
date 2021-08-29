import Model from '@ember-data/model';
import { belongsTo } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @belongsTo('course') course;
  @belongsTo('language') language;
}
