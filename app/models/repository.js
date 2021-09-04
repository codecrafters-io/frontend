import Model from '@ember-data/model';
import { attr, belongsTo, hasMany } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @attr('string') cloneUrl;
  @belongsTo('course') course;
  @belongsTo('language') language;
  @attr('date') lastSubmissionAt;
  @hasMany('submission') submissions;

  get firstSubmissionCreated() {
    return !!this.lastSubmissionAt;
  }
}
