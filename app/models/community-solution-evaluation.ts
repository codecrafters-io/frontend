import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import type CommunityCourseStageSolutionModel from './community-course-stage-solution';
import { tracked } from '@glimmer/tracking';
import type CommunitySolutionEvaluatorModel from './community-solution-evaluator';
import { fetchFileContentsIfNeeded } from 'codecrafters-frontend/utils/fetch-file-contents-if-needed';

export default class CommunitySolutionEvaluationModel extends Model {
  @belongsTo('community-course-stage-solution', { async: false, inverse: 'evaluations' })
  declare communitySolution: CommunityCourseStageSolutionModel;

  @belongsTo('community-solution-evaluator', { async: false, inverse: 'evaluations' }) declare evaluator: CommunitySolutionEvaluatorModel;

  @attr('date') declare createdAt: Date;
  @attr('string') declare result: 'pass' | 'fail' | 'unsure';
  @attr('string') declare logsFileUrl: string;
  @attr('string') declare promptFileUrl: string;

  @tracked logsFileContents: string | null = null;
  @tracked promptFileContents: string | null = null;

  async fetchLogsFileContentsIfNeeded(): Promise<void> {
    return fetchFileContentsIfNeeded(this, 'logsFileUrl', 'logsFileContents');
  }

  async fetchPromptFileContentsIfNeeded(): Promise<void> {
    return fetchFileContentsIfNeeded(this, 'promptFileUrl', 'promptFileContents');
  }
}
