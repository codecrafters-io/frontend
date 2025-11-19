import Model, { attr, belongsTo } from '@ember-data/model';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import SubmissionModel from 'codecrafters-frontend/models/submission';

export default class AutofixRequestModel extends Model {
  @belongsTo('submission', { async: false, inverse: 'autofixRequests' }) declare submission: SubmissionModel;
  @belongsTo('repository', { async: false, inverse: 'autofixRequests' }) declare repository: RepositoryModel;

  @attr('string') declare creatorType: 'user' | 'system' | 'staff';
  @attr() declare changedFiles: { diff: string; filename: string }[]; // free-form JSON
  @attr('date') declare createdAt: Date;
  @attr('string') declare explanationMarkdown: string;
  @attr('string') declare logstreamId: string; // For streaming logs when status is in_progress
  @attr('string') declare logsBase64: string; // Base64-encoded logs
  @attr('number') declare resultDelayInMilliseconds: number | null;
  @attr('string') declare status: string; // 'in_progress' | 'success' | 'failure' | 'error'
  @attr('string') declare summary: string;

  get creatorTypeIsStaff() {
    return this.creatorType === 'staff';
  }

  get logs(): string {
    return atob(this.logsBase64);
  }
}
