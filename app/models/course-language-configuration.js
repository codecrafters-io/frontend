import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class CourseLanguageConfigurationModel extends Model {
  @attr('string') starterRepositoryUrl;
  @attr('') alphaTesterUsernames;
  @attr('string') releaseStatus;

  @belongsTo('course', { async: false }) course;
  @belongsTo('language', { async: false }) language;
}
