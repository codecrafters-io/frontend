import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class LeaderboardEntry extends Model {
  @attr('string') status;
  @belongsTo('course-stage', { async: false }) activeCourseStage;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false }) user;

  get statusIsCompleted() {
    return this.status === 'completed';
  }

  get statusIsEvaluating() {
    return this.status === 'evaluating';
  }

  get statusIsIdle() {
    return this.status === 'idle';
  }
}
