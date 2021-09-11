import Model from '@ember-data/model';
import { attr, belongsTo, hasMany } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @attr('string') cloneUrl;
  @belongsTo('course') course;
  @hasMany('course-stage-completion') courseStageCompletions;
  @belongsTo('user') user;
  @belongsTo('language') language;
  @belongsTo('submission') lastSubmission;
  @attr('string') name;

  get firstSubmissionCreated() {
    return !!this.lastSubmission.get('id');
  }

  get highestCompletedStage() {
    if (this.courseStageCompletions.length === 0) {
      return null;
    }

    return this.courseStageCompletions.sortBy('courseStage.position').lastObject.courseStage;
  }

  get lastSubmissionAt() {
    return this.lastSubmission.get('createdAt');
  }
}
