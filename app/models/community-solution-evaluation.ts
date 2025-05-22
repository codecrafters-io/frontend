import Model, { attr, belongsTo } from '@ember-data/model';
import type CommunityCourseStageSolutionModel from './community-course-stage-solution';
import { tracked } from '@glimmer/tracking';
import type CommunitySolutionEvaluatorModel from './community-solution-evaluator';
import { fetchFileContentsIfNeeded } from 'codecrafters-frontend/utils/fetch-file-contents-if-needed';
import type TrustedCommunitySolutionEvaluationModel from './trusted-community-solution-evaluation';
import { memberAction } from 'ember-api-actions';

export default class CommunitySolutionEvaluationModel extends Model {
  @belongsTo('community-course-stage-solution', { async: false, inverse: 'evaluations' })
  declare communitySolution: CommunityCourseStageSolutionModel;

  @belongsTo('community-solution-evaluator', { async: false, inverse: 'evaluations' }) declare evaluator: CommunitySolutionEvaluatorModel;

  @attr('date') declare createdAt: Date;
  @attr('string') declare result: 'pass' | 'fail' | 'unsure';
  @attr('string') declare logsFileUrl: string;
  @attr('string') declare promptFileUrl: string;
  @attr('boolean') declare requiresRegeneration: boolean;
  @attr('date') declare updatedAt: Date;

  @tracked logsFileContents: string | null = null;
  @tracked promptFileContents: string | null = null;

  get trustedEvaluation(): TrustedCommunitySolutionEvaluationModel | null {
    // Since the evaluator relationship isn't being properly loaded in trusted evaluations,
    // we need to use a different approach

    // First try through the evaluator's trustedEvaluations
    const evaluatorId = this.evaluator.id;
    const evaluator = this.store.peekRecord('community-solution-evaluator', evaluatorId);

    if (evaluator) {
      // Look through the evaluator's trusted evaluations for one matching this solution
      const fromEvaluator = evaluator.trustedEvaluations.find((te) => te.communitySolution?.id === this.communitySolution.id);

      if (fromEvaluator) {
        return fromEvaluator;
      }
    }

    // Last resort: Compare by raw ID if we know which trusted evaluation we're looking for
    // This only works if there's only one trusted evaluation for this solution
    if (this.communitySolution.trustedEvaluations.length === 1) {
      // If there's only one trusted evaluation for this solution, it's likely the one we want
      const onlyTrustedEval = this.communitySolution.trustedEvaluations.toArray()[0];

      // Get the raw record to access _internalModel if needed
      const rawRecord = this.store.peekRecord('trusted-community-solution-evaluation', onlyTrustedEval.id);

      if (rawRecord) {
        return rawRecord;
      }
    }

    return null;
  }

  async fetchLogsFileContentsIfNeeded(): Promise<void> {
    return fetchFileContentsIfNeeded(this, 'logsFileUrl', 'logsFileContents');
  }

  async fetchPromptFileContentsIfNeeded(): Promise<void> {
    return fetchFileContentsIfNeeded(this, 'promptFileUrl', 'promptFileContents');
  }

  declare regenerate: (this: Model, payload: unknown) => Promise<void>;
}

CommunitySolutionEvaluationModel.prototype.regenerate = memberAction({
  path: 'regenerate',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
