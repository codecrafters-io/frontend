import Model, { attr, belongsTo } from '@ember-data/model';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import SubmissionModel from 'codecrafters-frontend/models/submission';
import config from 'codecrafters-frontend/config/environment';

export type AutofixHint = {
  description_markdown: string;
  slug: string;
  title_markdown: string;
};

export default class AutofixRequestModel extends Model {
  @belongsTo('submission', { async: false, inverse: 'autofixRequests' }) declare submission: SubmissionModel;
  @belongsTo('repository', { async: false, inverse: 'autofixRequests' }) declare repository: RepositoryModel;

  @attr('string') declare creatorType: 'user' | 'system' | 'staff' | 'internal';
  @attr() declare changedFiles: { diff: string; filename: string }[]; // free-form JSON
  @attr('date') declare createdAt: Date;
  @attr() declare hintsJson: AutofixHint[] | null; // free-form JSON
  @attr('string') declare logstreamId: string; // For streaming logs when status is in_progress
  @attr('string') declare logsBase64: string; // Base64-encoded logs
  @attr('number') declare resultDelayInMilliseconds: number | null;
  @attr('string') declare status: string; // 'in_progress' | 'success' | 'failure' | 'error'

  get adminUrl() {
    return `${config.x.backendUrl}/admin/autofix_requests/${this.id}`;
  }

  get creatorTypeIsStaffOrInternal() {
    return this.creatorType === 'staff' || this.creatorType === 'internal';
  }

  get logs(): string {
    return atob(this.logsBase64);
  }
}
