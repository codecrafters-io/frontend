import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseLeaderboardEntry extends Model {
  @attr('string') status;
  @belongsTo('course-stage', { async: false, inverse: null }) currentCourseStage;
  @belongsTo('language', { async: false, inverse: null }) language;
  @belongsTo('user', { async: false, inverse: null }) user;
  @attr('date') lastAttemptAt;

  get completedStagesCount() {
    if (this.statusIsCompleted) {
      return this.currentCourseStage.position;
    } else {
      return this.currentCourseStage.position - 1;
    }
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
