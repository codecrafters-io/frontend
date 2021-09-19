import Model from '@ember-data/model';
import { attr, belongsTo, hasMany } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @attr('string') cloneUrl;
  @belongsTo('course', { async: false }) course;
  @hasMany('course-stage-completion', { async: false }) courseStageCompletions;
  @belongsTo('user', { async: false }) user;
  @belongsTo('language', { async: false }) language;
  @belongsTo('submission', { async: false }) lastSubmission;
  @attr('string') name;
  @attr('string') starterRepositoryUrl;

  get firstSubmissionCreated() {
    return !!this.lastSubmission;
  }

  get activeStage() {
    if (!this.highestCompletedStage) {
      return this.course.get('stages').sortBy('position').firstObject;
    }

    let lastStagePosition = this.course.get('stages').mapBy('position').sort().lastObject;

    if (this.highestCompletedStage.get('position') === lastStagePosition) {
      return this.course.get('stages').findBy('position', lastStagePosition);
    } else {
      return this.course.get('stages').findBy('position', this.highestCompletedStage.get('position') + 1);
    }
  }

  get allStagesAreComplete() {
    return this.highestCompletedStage && this.highestCompletedStage.position === this.course.stages.mapBy('position').sort().lastObject;
  }

  get highestCompletedStage() {
    if (this.courseStageCompletions.length === 0) {
      return null;
    }

    return this.courseStageCompletions.sortBy('courseStage.position').lastObject.courseStage;
  }

  get lastSubmissionAt() {
    return this.lastSubmission && this.lastSubmission.createdAt;
  }

  get lastSubmissionIsEvaluating() {
    return this.lastSubmission && this.lastSubmission.statusIsEvaluating;
  }

  get lastSubmissionIsRecent() {
    return this.lastSubmission && this.lastSubmission.isRecent;
  }

  get lastSubmissionHasFailureStatus() {
    return this.lastSubmission && this.lastSubmission.statusIsFailure;
  }

  get defaultReadmeUrl() {
    return `https://github.com/codecrafters-io/${this.course.slug}-starter-${this.course.supportedLanguages.firstObject.slug}`;
  }

  get readmeUrl() {
    if (this.isNew) {
      return null;
    }

    return `${this.starterRepositoryUrl}/blob/master/README.md`;
  }
}
