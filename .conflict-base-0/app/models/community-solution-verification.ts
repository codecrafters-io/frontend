import Model, { attr, belongsTo } from '@ember-data/model';
import type CommunityCourseStageSolutionModel from './community-course-stage-solution';
import type CourseTesterVersionModel from './course-tester-version';

export default class CommunitySolutionVerificationModel extends Model {
  @belongsTo('community-course-stage-solution', { async: false, inverse: 'verifications' })
  declare communitySolution: CommunityCourseStageSolutionModel;

  @belongsTo('course-tester-version', { async: false, inverse: null })
  declare courseTesterVersion: CourseTesterVersionModel | null;

  @attr('date') declare createdAt: Date;
  @attr('string') declare status: 'error' | 'failure' | 'in_progress' | 'success';
}
