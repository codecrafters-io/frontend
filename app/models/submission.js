import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class SubmissionModel extends Model {
  @belongsTo('repository') repository;
  @belongsTo('courseStage') courseStage;
  @attr('date') createdAt;
}
