import Model, { attr, belongsTo } from '@ember-data/model';
import type SubmissionModel from './submission';
import * as Sentry from '@sentry/ember';
import { tracked } from '@glimmer/tracking';

export default class SubmissionEvaluationModel extends Model {
  @belongsTo('submission', { async: false, inverse: 'evaluations' }) declare submission: SubmissionModel;
  @attr('date') declare createdAt: Date;
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

      if (response.status === 200) {
        this.logsFileContents = (await response.text()) as string;
      } else {
        Sentry.captureMessage(`Failed to fetch logs file for submission evaluation`, {
          extra: { response_status: response.status, response_body: await response.text(), submission_evaluation_id: this.id },
        });
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}
