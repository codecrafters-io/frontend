import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseIdeaSupervoteModel extends Model {
  @attr('date') createdAt;

  @belongsTo('course-idea') courseIdea;
  @belongsTo('user') user;
}
