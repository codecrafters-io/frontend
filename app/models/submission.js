import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class SubmissionModel extends Model {
  @belongsTo('repository') repository;
  @attr('date') createdAt;
}
