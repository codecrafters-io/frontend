import Model, { attr, belongsTo } from '@ember-data/model';
import type CourseStageModel from './course-stage';
import type UserModel from './user';
import type LanguageModel from './language';
import type RepositoryModel from './repository';

export default class CourseStageParticipationModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: 'participations' }) declare stage: CourseStageModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('repository', { async: false, inverse: null }) declare repository: RepositoryModel;

  @attr('number') declare attemptsCount: number;
  @attr('date') declare completedAt: Date | null;
  @attr('date') declare firstAttemptAt: Date;
  @attr('date') declare lastAttemptAt: Date;
  @attr('string') declare status: 'complete' | 'dropped_off' | 'active';
}
