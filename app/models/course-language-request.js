import Model from '@ember-data/model';
import { belongsTo } from '@ember-data/model';

export default class CourseLanguageRequestModel extends Model {
  @belongsTo('course', { async: false }) course;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false, inverse: 'courseLanguageRequests' }) user;
}
