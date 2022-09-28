import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseExtensionIdeaVoteModel extends Model {
  @attr('date') createdAt;

  @belongsTo('course-idea', { async: false }) courseExtensionIdea;
  @belongsTo('user', { async: false }) user;
}
