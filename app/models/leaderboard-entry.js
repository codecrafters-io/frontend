import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class LeaderboardEntry extends Model {
  @attr('boolean') hasActiveSubmission;
  @belongsTo('course-stage', { async: false }) highestCompletedCourseStage;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false }) user;
}
