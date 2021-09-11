import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class SubmissionModel extends Model {
  @belongsTo('repository', { async: false }) repository;
  @belongsTo('courseStage', { async: false }) courseStage;
  @attr('date') createdAt;
  @attr('string') status;

  get isRecent() {
    return this.createdAt - new Date() <= 300 * 1000; // in last 5 minutes
  }

  get statusIsEvaluating() {
    return this.status === 'evaluating';
  }

  get statusIsSuccess() {
    return this.status === 'success';
  }

  get statusIsFailure() {
    return this.status === 'failure';
  }

  get statusIsInternalError() {
    return this.status === 'internal_error';
  }
}
