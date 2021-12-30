import Model, { hasMany } from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class SubmissionModel extends Model {
  @belongsTo('courseStage', { async: false }) courseStage;
  @hasMany('submission-evaluation', { async: false }) evaluations;
  @belongsTo('repository', { async: false, inverse: 'submissions' }) repository;

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
