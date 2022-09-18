import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseIdeaSupervoteGrantModel extends Model {
  @attr('date') createdAt;
  @attr('string') description;
  @attr('number') numberOfSupervotes;

  @belongsTo('user', { async: false }) user;
}
