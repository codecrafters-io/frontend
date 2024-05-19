import Model, { attr, belongsTo } from '@ember-data/model';
import type SubmissionModel from './submission';
import { tracked } from '@glimmer/tracking';
import { fetchFileContentsIfNeeded } from 'codecrafters-frontend/utils/fetch-file-contents-if-needed';

export default class SubmissionEvaluationModel extends Model {
  @belongsTo('submission', { async: false, inverse: 'evaluations' }) declare submission: SubmissionModel;
  @attr('date') declare createdAt: Date;
  @attr('string') declare logsFileUrl: string;

  @tracked logsFileContents: string | null = null;

  async fetchLogsFileContentsIfNeeded(): Promise<void> {
    return fetchFileContentsIfNeeded(this, 'logsFileUrl', 'logsFileContents');
  }
}
