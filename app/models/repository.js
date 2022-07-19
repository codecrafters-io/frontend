import Model from '@ember-data/model';
import { attr, belongsTo, hasMany } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @attr('string') cloneUrl;
  @belongsTo('course', { async: false }) course;
  @hasMany('course-stage-completion', { async: false }) courseStageCompletions;
  @attr('date') createdAt;
  @belongsTo('user', { async: false }) user;
  @belongsTo('language', { async: false }) language;
  @belongsTo('submission', { async: false, inverse: null }) lastSubmission;
  @attr('string') name;
  @attr('string') starterRepositoryUrl;
  @hasMany('submission', { async: false, inverse: 'repository' }) submissions;

  get cloneDirectory() {
    return `codecrafters-${this.course.slug}-${this.language.slug}`;
  }

  get completedStages() {
    if (this.highestCompletedStage) {
      return this.course.stages.filter((stage) => stage.position <= this.highestCompletedStage.position);
    } else {
      return [];
    }
  }

  get defaultStarterRepositoryUrl() {
    return `https://github.com/codecrafters-io/${this.course.slug}-starter-${this.course.supportedLanguages.firstObject.slug}`;
  }

  get firstSubmissionCreated() {
    return !!this.lastSubmission;
  }

  get isRecentlyCreated() {
    return new Date() - this.createdAt <= 1800 * 1000; // 30min
  }

  get activeStage() {
    if (!this.highestCompletedStage) {
      if (this.firstSubmissionCreated) {
        return this.course.get('stages').sortBy('position').firstObject;
      } else {
        return null;
      }
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
    if (!this.starterRepositoryUrl) {
      return null;
    }

    return `${this.starterRepositoryUrl}/blob/master/README.md`;
  }

  stageCompletedAt(courseStage) {
    const firstCompletion = this.courseStageCompletions.filterBy('courseStage', courseStage).sortBy('completedAt').firstObject;

    return firstCompletion ? firstCompletion.completedAt : null;
  }

  stageIsComplete(courseStage) {
    return this.highestCompletedStage && this.highestCompletedStage.position >= courseStage.position;
  }
}
