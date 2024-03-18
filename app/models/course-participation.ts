import Model, { attr, belongsTo } from '@ember-data/model';
import type CourseModel from './course';
import type UserModel from './user';
import type LanguageModel from './language';

export default class CourseParticipationModel extends Model {
  @belongsTo('course', { async: false, inverse: null }) declare course: CourseModel;
  @belongsTo('user', { async: false, inverse: 'courseParticipations' }) declare user: UserModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;

  @attr('date') declare completedAt: Date | null;
  @attr('date') declare lastSubmissionAt: Date;
  @attr('string') declare completedStageSlugs: string[] | null;

  get isCompleted(): boolean {
    return !!this.completedAt;
  }
}
