import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseStageCommentModel extends Model {
  @belongsTo('course-stage', { async: false }) courseStage;
  @belongsTo('language', { async: false }) language;
  @belongsTo('repository', { async: false }) repository;
  @belongsTo('user', { async: false }) user;

  @attr('string') bodyMarkdown;
  @attr('date') createdAt;
  @attr('date') updatedAt;
}
