import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import type CourseModel from './course';
import type LanguageModel from './language';
import type CommunitySolutionEvaluationModel from './community-solution-evaluation';
import type TrustedCommunitySolutionEvaluationModel from './trusted-community-solution-evaluation';

export default class CommunitySolutionEvaluatorModel extends Model {
  @belongsTo('course', { async: false, inverse: null }) declare course: CourseModel | null;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel | null;

  @hasMany('community-solution-evaluation', { async: false, inverse: 'evaluator' })
  declare evaluations: CommunitySolutionEvaluationModel[];

  @hasMany('trusted-community-solution-evaluation', { async: false, inverse: 'evaluator' })
  declare trustedEvaluations: TrustedCommunitySolutionEvaluationModel[];

  @attr('string') declare context: 'highlighted_lines' | 'highlighted_files';
  @attr('number') declare failedEvaluationsCount: number;
  @attr('number') declare passedEvaluationsCount: number;
  @attr('string') declare promptTemplate: string;
  @attr('string') declare slug: string;
  @attr('string') declare status: 'draft' | 'live';
  @attr('number') declare unsureEvaluationsCount: number;

  get isDraft() {
    return this.status === 'draft';
  }

  get isLive() {
    return this.status === 'live';
  }

  get totalEvaluationsCount() {
    return this.passedEvaluationsCount + this.failedEvaluationsCount + this.unsureEvaluationsCount;
  }

  declare deploy: (this: Model, payload: unknown) => Promise<void>;
  declare regenerateAllEvaluations: (this: Model, payload: unknown) => Promise<void>;
}

CommunitySolutionEvaluatorModel.prototype.deploy = memberAction({
  path: 'deploy',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});

CommunitySolutionEvaluatorModel.prototype.regenerateAllEvaluations = memberAction({
  path: 'regenerate_all_evaluations',
  type: 'post',
});
