import Model from '@ember-data/model';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import SubmissionModel from 'codecrafters-frontend/models/submission';
import { attr, belongsTo } from '@ember-data/model';

export default class AutofixRequestModel extends Model {
  @belongsTo('submission', { async: false, inverese: 'autofixRequests' }) declare submission: SubmissionModel;
  @belongsTo('repository', { async: false, inverse: 'autofixRequests' }) declare repository: RepositoryModel;

  @attr() declare changedFiles: { diff: string; filename: string }[]; // free-form JSON
  @attr('date') declare createdAt: Date;
  @attr('string') declare explanationMarkdown: string;
  @attr('string') declare logstreamKey: string; // For streaming logs when status is in_progress
  @attr('string') declare status: string; // 'in_progress' | 'success' | 'failure' | 'internal_error'
}
