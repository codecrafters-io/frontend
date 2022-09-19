import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseIdeaVoteModel extends Model {
  @attr('date') createdAt;

  @belongsTo('course-idea', { async: false }) courseIdea;
  @belongsTo('user', { async: false }) user;
}
