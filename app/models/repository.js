import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { buildSectionList as buildPreChallengeAssessmentSectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';
import { cached } from '@glimmer/tracking';
import { memberAction } from 'ember-api-actions';

export default class RepositoryModel extends Model {
  static expectedActivityFrequencyMappings = {
    every_day: 'Every day',
    few_times_a_week: 'Few times a week',
    once_a_week: 'Once a week',
    few_times_a_month: 'Few times a month',
    once_a_month: 'Once a month',
  };

  static languageProficiencyLevelMappings = {
    never_tried: 'Never tried',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  @belongsTo('course', { async: false }) course;
  @hasMany('course-extension-activation', { async: false }) courseExtensionActivations;
  @hasMany('course-stage-completion', { async: false }) courseStageCompletions;
  @hasMany('course-stage-feedback-submission', { async: false }) courseStageFeedbackSubmissions;
  @hasMany('github-repository-sync-configuration', { async: false }) githubRepositorySyncConfigurations;
  @belongsTo('user', { async: false }) user;
  @belongsTo('language', { async: false }) language;
  @belongsTo('submission', { async: false, inverse: null }) lastSubmission;
  @belongsTo('repository-stage-list', { async: false }) stageList;
  @hasMany('submission', { async: false, inverse: 'repository' }) submissions;

  @attr('string') cloneUrl;
  @attr('date') createdAt;
  @attr('string') expectedActivityFrequency;
  @attr('string') name;
  @attr('string') languageProficiencyLevel;
  @attr('string') progressBannerUrl;
  @attr('boolean', { allowNull: true }) remindersAreEnabled;

  get activatedCourseExtensions() {
    return this.courseExtensionActivations.map((activation) => activation.extension).uniq();
  }

  get currentStage() {
    if (!this.firstSubmissionCreated) {
      return null;
    }

    if (this.stageList) {
      return this.stageList.items.find((item) => item.isCurrent).stage;
    } else {
      return null; // We haven't loaded the stage list yet
    }
  }

  get allStagesAreComplete() {
    return this.highestCompletedStage && this.highestCompletedStage.position === this.course.stages.sortBy('position').lastObject.position;
  }

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

  // TODO: Only to bypass TS checks - find out how to use RepositoryModel#expectedActivityFrequencyMappings directly in a .hbs templates
  get expectedActivityFrequencyMappings() {
    return RepositoryModel.expectedActivityFrequencyMappings;
  }

  get expectedActivityFrequencyHumanized() {
    return RepositoryModel.expectedActivityFrequencyMappings[this.expectedActivityFrequency];
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

  get highestCompletedStage() {
    if (this.courseStageCompletions.length === 0) {
      return null;
    }

    return this.courseStageCompletions.sortBy('courseStage.position').lastObject.courseStage;
  }

  get isRecentlyCreated() {
    return new Date() - this.createdAt <= 1800 * 1000; // 30min
  }

  get languageProficiencyLevelHumanized() {
    return RepositoryModel.languageProficiencyLevelMappings[this.languageProficiencyLevel];
  }

  // TODO: Only to bypass TS checks - find out how to use RepositoryModel#languageProficiencyLevelMappings directly in a .hbs template
  get languageProficiencyLevelMappings() {
    return RepositoryModel.languageProficiencyLevelMappings;
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

  @cached
  get preChallengeAssessmentSectionList() {
    return buildPreChallengeAssessmentSectionList(this);
  }

  stageCompletedAt(courseStage) {
    const firstCompletion = this.courseStageCompletions.filterBy('courseStage', courseStage).sortBy('completedAt').firstObject;

    return firstCompletion ? firstCompletion.completedAt : null;
  }

  stageIsComplete(courseStage) {
    return this.highestCompletedStage && this.highestCompletedStage.position >= courseStage.position;
  }
}

RepositoryModel.prototype.updateTesterVersion = memberAction({
  path: 'update-tester-version',
  type: 'post',
});

RepositoryModel.prototype.fork = memberAction({
  path: 'fork',
  type: 'post',
});
