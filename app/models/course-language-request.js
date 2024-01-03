import Model from '@ember-data/model';
import { belongsTo } from '@ember-data/model';

export default class CourseLanguageRequestModel extends Model {
  @belongsTo('course', { async: false, inverse: null }) course;
  @belongsTo('language', { async: false, inverse: null }) language;
  @belongsTo('user', { async: false, inverse: 'courseLanguageRequests' }) user;
}
