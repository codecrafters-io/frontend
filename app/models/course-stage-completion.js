import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseStageCompletionModel extends Model {
  @belongsTo('course-stage') courseStage;
  @belongsTo('repository') repository;
  @attr('date') completedAt;
}
