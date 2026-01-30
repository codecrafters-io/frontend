import Model, { attr, belongsTo } from '@ember-data/model';
import type CommunityCourseStageSolutionModel from './community-course-stage-solution';
import { tracked } from '@glimmer/tracking';
import type CommunitySolutionEvaluatorModel from './community-solution-evaluator';
import { fetchFileContentsIfNeeded } from 'codecrafters-frontend/utils/fetch-file-contents-if-needed';
import type TrustedCommunitySolutionEvaluationModel from './trusted-community-solution-evaluation';
import { collectionAction, memberAction } from 'ember-api-actions';

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

  get oppositeResult(): 'pass' | 'fail' {
    switch (this.result) {
      case 'pass':
        return 'fail';
      case 'fail':
        return 'pass';
      default:
        throw new Error(`Invalid result: ${this.result}`);
    }
  }

  get trustedEvaluation(): TrustedCommunitySolutionEvaluationModel | null {
    return this.communitySolution.trustedEvaluations.find((item) => item.evaluator === this.evaluator) || null;
  }

  async fetchLogsFileContentsIfNeeded(): Promise<void> {
    return fetchFileContentsIfNeeded(this, 'logsFileUrl', 'logsFileContents');
  }

  async fetchPromptFileContentsIfNeeded(): Promise<void> {
    return fetchFileContentsIfNeeded(this, 'promptFileUrl', 'promptFileContents');
  }

  declare generate: (this: Model, payload: { evaluator_id: string; course_stage_id?: string; language_id?: string }) => Promise<void>;
  declare regenerate: (this: Model, payload: unknown) => Promise<void>;
}

CommunitySolutionEvaluationModel.prototype.generate = collectionAction({
  path: 'generate',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});

CommunitySolutionEvaluationModel.prototype.regenerate = memberAction({
  path: 'regenerate',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
