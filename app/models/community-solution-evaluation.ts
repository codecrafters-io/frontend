import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import type CommunityCourseStageSolutionModel from './community-course-stage-solution';
import { tracked } from '@glimmer/tracking';
import * as Sentry from '@sentry/ember';
import type CommunitySolutionEvaluatorModel from './community-solution-evaluator';

export default class CommunitySolutionEvaluationModel extends Model {
  @belongsTo('community-course-stage-solution', { async: false, inverse: 'evaluations' })
  declare communitySolution: CommunityCourseStageSolutionModel;

  @belongsTo('community-solution-evaluator', { async: false, inverse: 'evaluations' }) declare evaluator: CommunitySolutionEvaluatorModel;

  @attr('string') declare result: 'pass' | 'fail' | 'unsure';
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
        Sentry.captureMessage(`Failed to fetch logs file for code example evaluation`, {
          extra: { response_status: response.status, response_body: await response.text(), code_example_evaluation_id: this.id },
        });
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}
