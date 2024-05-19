import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type UserModel from 'codecrafters-frontend/models/user';

export default class CourseLeaderboardEntry extends Model {
  @attr() declare completedStageSlugs: string[];
  @attr('date') declare lastAttemptAt: Date;
  @attr('string') declare status: 'evaluating' | 'completed' | 'idle';

  @belongsTo('course-stage', { async: false, inverse: null }) declare currentCourseStage: CourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  get completedStagesCount() {
    return this.completedStageSlugs.length;
  }

  get course() {
    return this.currentCourseStage.course;
  }

  get statusIsCompleted() {
    return this.status === 'completed';
  }

  get statusIsEvaluating() {
    return this.status === 'evaluating';
  }

  get statusIsIdle() {
    return this.status === 'idle';
  }

  get userId() {
    return this.user.id;
  }
}
