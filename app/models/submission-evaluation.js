import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubmissionEvaluationModel extends Model {
  @belongsTo('submission', { async: false }) submission;
  @attr('date') createdAt;
  @attr('string') logs;

  get parsedLogs() {
    try {
      return atob(this.logs);
    } catch (DOMException) {
      return 'Malformed logs.';
    }
  }
}
