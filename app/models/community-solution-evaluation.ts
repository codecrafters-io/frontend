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
  @tracked logsFileContentsSource: string | null = null; // The url used to fetch the logs file contents
  @tracked promptFileContents: string | null = null;
  @tracked promptFileContentsSource: string | null = null; // The url used to fetch the prompt file contents

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
    return fetchFileContentsIfNeeded(this, this.logsFileUrl, 'logsFileContents', 'logsFileContentsSource');
  }

  async fetchPromptFileContentsIfNeeded(): Promise<void> {
    return fetchFileContentsIfNeeded(this, this.promptFileUrl, 'promptFileContents', 'promptFileContentsSource');
  }

  declare generateForEvaluator: (this: Model, payload: { evaluator_id: string; course_stage_id?: string; language_id?: string }) => Promise<void>;
  declare generateForSolutions: (this: Model, payload: { solution_ids: string[] }) => Promise<void>;
  declare regenerate: (this: Model, payload: unknown) => Promise<void>;
}

CommunitySolutionEvaluationModel.prototype.generateForEvaluator = collectionAction({
  path: 'generate_for_evaluator',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});

CommunitySolutionEvaluationModel.prototype.generateForSolutions = collectionAction({
  path: 'generate_for_solutions',
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
