import Model, { attr, belongsTo } from '@ember-data/model';
import type SubmissionModel from './submission';
import * as Sentry from '@sentry/ember';
import { tracked } from '@glimmer/tracking';

export default class SubmissionEvaluationModel extends Model {
  @belongsTo('submission', { async: false, inverse: 'evaluations' }) declare submission: SubmissionModel;
  @attr('date') declare createdAt: Date;
  @attr('string') declare logsBase64: string; // TODO: Remove, replaced by logsFileUrl
  @attr('string') declare logsFileUrl: string;

  @tracked logsFileContents: string | null = null;

  async fetchLogsFileContentsIfNeeded(): Promise<void> {
    if (this.logsFileContents) {
      return;
    }

    if (!this.logsFileUrl) {
      return;
    }

    try {
      const response = await fetch(this.logsFileUrl);
      this.logsFileContents = (await response.text()) as string;
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}
