import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @belongsTo('course', { async: false }) course;
  @hasMany('course-stage-completion', { async: false }) courseStageCompletions;
  @hasMany('course-stage-feedback-submission', { async: false }) courseStageFeedbackSubmissions;
  @hasMany('github-repository-sync-configuration', { async: false }) githubRepositorySyncConfigurations;
  @belongsTo('user', { async: false }) user;
  @belongsTo('language', { async: false }) language;
  @belongsTo('submission', { async: false, inverse: null }) lastSubmission;
  @hasMany('submission', { async: false, inverse: 'repository' }) submissions;

  @attr('string') cloneUrl;
  @attr('date') createdAt;
  @attr('string') name;
  @attr('string') progressBannerUrl;
  @attr('string') readmeUrl;

  get cloneDirectory() {
    if (!this.course || !this.language) {
      return 'codecrafters'; // This is triggered when the clone step is animating out for an old repo
    }

    return `codecrafters-${this.course.slug}-${this.language.slug}`;
  }

  get completedStages() {
    if (this.highestCompletedStage) {
      return this.course.stages.filter((stage) => stage.position <= this.highestCompletedStage.position);
    } else {
      return [];
    }
  }

  courseStageFeedbackSubmissionFor(courseStage) {
    return this.courseStageFeedbackSubmissions.findBy('courseStage', courseStage);
  }

  get firstSubmissionCreated() {
    return !!this.lastSubmission;
  }

  get githubRepositorySyncConfiguration() {
    return this.githubRepositorySyncConfigurations.firstObject;
  }

  hasClosedCourseStageFeedbackSubmissionFor(courseStage) {
    return this.courseStageFeedbackSubmissions.filterBy('courseStage', courseStage).filterBy('status', 'closed').length > 0;
  }

  get isRecentlyCreated() {
    return new Date() - this.createdAt <= 1800 * 1000; // 30min
  }

  get activeStage() {
    if (!this.highestCompletedStage) {
      if (this.firstSubmissionCreated) {
        return this.course.firstStage;
      } else {
        return null;
      }
    }

    let lastStagePosition = this.course.stages.sortBy('position').lastObject.position;

    if (this.highestCompletedStage.get('position') === lastStagePosition) {
      return this.course.get('stages').findBy('position', lastStagePosition);
    } else {
      return this.course.get('stages').findBy('position', this.highestCompletedStage.get('position') + 1);
    }
  }

  get allStagesAreComplete() {
    return this.highestCompletedStage && this.highestCompletedStage.position === this.course.stages.sortBy('position').lastObject.position;
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

  stageCompletedAt(courseStage) {
    const firstCompletion = this.courseStageCompletions.filterBy('courseStage', courseStage).sortBy('completedAt').firstObject;

    return firstCompletion ? firstCompletion.completedAt : null;
  }

  stageIsComplete(courseStage) {
    return this.highestCompletedStage && this.highestCompletedStage.position >= courseStage.position;
  }
}
