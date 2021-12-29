import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubmissionOutputModel extends Model {
  @belongsTo('submission', { async: false }) submission;
  @attr('date') createdAt;
  @attr('string') value;
}
