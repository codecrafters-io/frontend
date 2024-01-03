import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseStageCompletionModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: null }) courseStage;
  @belongsTo('repository', { async: false, inverse: 'courseStageCompletions' }) repository;
  @attr('date') completedAt;
}
