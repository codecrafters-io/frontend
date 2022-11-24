import Model from '@ember-data/model';
import { belongsTo } from '@ember-data/model';

export default class CourseStageCommentUpvoteModel extends Model {
  @belongsTo('course-stage-comment', { async: false }) courseStageComment;
  @belongsTo('user', { async: false }) user;
}
