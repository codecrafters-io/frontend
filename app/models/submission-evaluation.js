import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubmissionEvaluationModel extends Model {
  @belongsTo('submission', { async: false, inverse: 'evaluations' }) submission;
  @attr('date') createdAt;
  @attr('string') logsBase64;

  get parsedLogs() {
    try {
      return atob(this.logsBase64);
    } catch (DOMException) {
      return 'Hmm, we were unable to fetch logs for this submission.\n\n Trying again might help. Please contact us at hello@codecrafters.io if this error persists.';
    }
  }
}
