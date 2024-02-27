import Model, { attr, belongsTo } from '@ember-data/model';
import type CourseModel from './course';
import type CourseStageModel from './course-stage';
import type UserModel from './user';
import type LanguageModel from './language';

export default class CourseParticipationModel extends Model {
  @belongsTo('course', { async: false, inverse: null }) declare course: CourseModel;
  @belongsTo('course-stage', { async: false, inverse: null }) declare currentStage: CourseStageModel;
  @belongsTo('user', { async: false, inverse: 'courseParticipations' }) declare user: UserModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;

  @attr('date') declare completedAt: Date;
  @attr('date') declare lastActivityAt: Date;
  @attr('date') declare startedAt: Date;
  @attr('date') declare lastSubmissionAt: Date;

  get isCompleted(): boolean {
    return !!this.completedAt;
  }
}
