import Model from '@ember-data/model';
import { attr, belongsTo, hasMany } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @attr('string') cloneUrl;
  @belongsTo('course') course;
  @hasMany('course-stage-completion') courseStageCompletions;
  @belongsTo('user') user;
  @belongsTo('language') language;
  @attr('date') lastSubmissionAt;
  @attr('string') name;
  @hasMany('submission') submissions;

  get firstSubmissionCreated() {
    return !!this.lastSubmissionAt;
  }

  get highestCompletedStage() {
    if (this.courseStageCompletions.length === 0) {
      return null;
    }

    return this.courseStageCompletions.sortBy('courseStage.position').lastObject.courseStage;
  }
}
