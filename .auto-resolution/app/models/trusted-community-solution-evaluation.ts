import Model, { attr, belongsTo } from '@ember-data/model';
import type CommunityCourseStageSolutionModel from './community-course-stage-solution';
import type CommunitySolutionEvaluatorModel from './community-solution-evaluator';
import type UserModel from './user';

export default class TrustedCommunitySolutionEvaluationModel extends Model {
  @belongsTo('community-course-stage-solution', { async: false, inverse: 'trustedEvaluations' })
  declare communitySolution: CommunityCourseStageSolutionModel;

  @belongsTo('community-solution-evaluator', { async: false, inverse: 'trustedEvaluations' }) declare evaluator: CommunitySolutionEvaluatorModel;

  @belongsTo('user', { async: false, inverse: null }) declare creator: UserModel;

  @attr('date') declare createdAt: Date;
  @attr('string') declare result: 'pass' | 'fail';
}
