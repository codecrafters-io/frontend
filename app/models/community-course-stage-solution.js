import { attr, belongsTo, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CommunityCourseStageSolutionModel extends Model {
  @belongsTo('course-stage', { async: false }) courseStage;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false }) user;

  @attr('') changedFiles; // free-form JSON
  @attr('date') submittedAt;
}
