import CourseExtensionActivation from 'codecrafters-frontend/models/course-extension-activation';
import CourseModel from 'codecrafters-frontend/models/course';
import CourseStageCompletionModel from 'codecrafters-frontend/models/course-stage-completion';
import GithubRepositorySyncConfiguration from 'codecrafters-frontend/models/github-repository-sync-configuration';
import LanguageModel from 'codecrafters-frontend/models/language';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import RepositoryStageListModel from 'codecrafters-frontend/models/repository-stage-list';
import SubmissionModel from 'codecrafters-frontend/models/submission';
import UserModel from 'codecrafters-frontend/models/user';
import { buildSectionList as buildPreChallengeAssessmentSectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';

//@ts-ignore
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

  @belongsTo('course', { async: false }) course!: CourseModel;
  @hasMany('course-extension-activation', { async: false }) courseExtensionActivations!: CourseExtensionActivation[];
  @hasMany('course-stage-completion', { async: false }) courseStageCompletions!: CourseStageCompletionModel[];
  @hasMany('course-stage-feedback-submission', { async: false }) courseStageFeedbackSubmissions!: CourseStageCompletionModel[];
  @hasMany('github-repository-sync-configuration', { async: false }) githubRepositorySyncConfigurations!: GithubRepositorySyncConfiguration[];
  @belongsTo('user', { async: false }) user!: UserModel;
  @belongsTo('language', { async: false }) language!: LanguageModel;
  @belongsTo('submission', { async: false, inverse: null }) lastSubmission!: SubmissionModel;
  @belongsTo('repository-stage-list', { async: false }) stageList!: RepositoryStageListModel;
  @hasMany('submission', { async: false, inverse: 'repository' }) submissions!: SubmissionModel[];

  @attr('string') cloneUrl!: string;
  @attr('date') createdAt!: Date;
  @attr('string') expectedActivityFrequency!: string;
  @attr('string') name!: string;
  @attr('string') languageProficiencyLevel!: string;
  @attr('string') progressBannerUrl!: string;
  @attr('boolean', { allowNull: true }) remindersAreEnabled!: boolean | null;
  @attr('number') submissionsCount!: number;

  get activatedCourseExtensions() {
    return this.courseExtensionActivations.map((activation) => activation.extension).uniq();
  }

  // TODO[Extensions]: Make sure start course, resume track, course progress bar, leaderboard etc. work with extensions
  get allStagesAreComplete() {
    return this.course.stages.every((stage) => this.stageIsComplete(stage));
  }

  get baseStagesAreComplete() {
    return this.course.stages.filter((stage) => stage.isBaseStage).every((stage) => this.stageIsComplete(stage));
  }

  get cloneDirectory() {
    if (!this.course || !this.language) {
      return 'codecrafters'; // This is triggered when the clone step is animating out for an old repo
    }

    return `codecrafters-${this.course.slug}-${this.language.slug}`;
  }

  get completedStages() {
    return this.courseStageCompletions.mapBy('courseStage').uniq();
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

  get expectedActivityFrequencyHumanized() {
    return RepositoryModel.expectedActivityFrequencyMappings[this.expectedActivityFrequency];
  }

  // TODO: Only to bypass TS checks - find out how to use RepositoryModel#expectedActivityFrequencyMappings directly in a .hbs templates
  get expectedActivityFrequencyMappings() {
    return RepositoryModel.expectedActivityFrequencyMappings;
  }

  get firstSubmissionCreated() {
    return !!this.lastSubmission;
  }

  get githubRepositorySyncConfiguration() {
    return this.githubRepositorySyncConfigurations.firstObject;
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

  get lastSubmissionHasFailureStatus() {
    return this.lastSubmission && this.lastSubmission.statusIsFailure;
  }

  get lastSubmissionIsEvaluating() {
    return this.lastSubmission && this.lastSubmission.statusIsEvaluating;
  }

  get lastSubmissionIsRecent() {
    return this.lastSubmission && this.lastSubmission.isRecent;
  }

  @cached
  get preChallengeAssessmentSectionList() {
    return buildPreChallengeAssessmentSectionList(this);
  }

  courseStageCompletionFor(courseStage) {
    return this.courseStageCompletions.filterBy('courseStage', courseStage).sortBy('completedAt')[0];
  }

  courseStageFeedbackSubmissionFor(courseStage) {
    return this.courseStageFeedbackSubmissions.findBy('courseStage', courseStage);
  }

  hasClosedCourseStageFeedbackSubmissionFor(courseStage) {
    return this.courseStageFeedbackSubmissions.filterBy('courseStage', courseStage).filterBy('status', 'closed').length > 0;
  }

  stageCompletedAt(courseStage) {
    if (!this.stageList) {
      return null;
    }

    const stageListItem = this.stageList.items.find((item) => item.stage === courseStage);

    return stageListItem ? stageListItem.completedAt : null;
  }

  stageIsComplete(courseStage) {
    return !!this.courseStageCompletionFor(courseStage);
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
