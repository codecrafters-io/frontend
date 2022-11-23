import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseStageCommentModel extends Model {
  @belongsTo('course-stage', { async: false }) courseStage;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false }) user;

  @attr('boolean') isApprovedByModerator;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('string') bodyMarkdown;
}
