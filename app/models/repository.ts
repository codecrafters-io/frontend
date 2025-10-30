import CourseExtensionActivation from 'codecrafters-frontend/models/course-extension-activation';
import CourseModel from 'codecrafters-frontend/models/course';
import CourseStageCompletionModel from 'codecrafters-frontend/models/course-stage-completion';
import CourseStageFeedbackSubmissionModel from 'codecrafters-frontend/models/course-stage-feedback-submission';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import GithubRepositorySyncConfiguration from 'codecrafters-frontend/models/github-repository-sync-configuration';
import LanguageModel from 'codecrafters-frontend/models/language';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import RepositoryStageListModel from 'codecrafters-frontend/models/repository-stage-list';
import SubmissionModel from 'codecrafters-frontend/models/submission';
import UserModel from 'codecrafters-frontend/models/user';
import type AutofixRequestModel from './autofix-request';
import type BuildpackModel from './buildpack';
import type CourseExtensionModel from './course-extension';
import type CourseStageSolutionModel from './course-stage-solution';
import type Store from '@ember-data/store';
import { buildSectionList as buildPreChallengeAssessmentSectionList } from 'codecrafters-frontend/utils/pre-challenge-assessment-section-list';
import { cached } from '@glimmer/tracking';
import { memberAction } from 'ember-api-actions';
import { service } from '@ember/service';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import { compare } from '@ember/utils';
import uniqReducer from 'codecrafters-frontend/utils/uniq-reducer';

type ExpectedActivityFrequency = keyof typeof RepositoryModel.expectedActivityFrequencyMappings;
type LanguageProficiencyLevel = keyof typeof RepositoryModel.languageProficiencyLevelMappings;

export default class RepositoryModel extends Model {
  @service declare store: Store;

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

  @hasMany('autofix-request', { async: false, inverse: 'repository' }) declare autofixRequests: AutofixRequestModel[];
  @belongsTo('buildpack', { async: false, inverse: null }) declare buildpack: BuildpackModel;
  @belongsTo('course', { async: false, inverse: null }) declare course: CourseModel;
  @hasMany('course-extension-activation', { async: false, inverse: 'repository' }) declare extensionActivations: CourseExtensionActivation[];
  @hasMany('course-stage-completion', { async: false, inverse: 'repository' }) declare courseStageCompletions: CourseStageCompletionModel[];
  @hasMany('course-stage-feedback-submission', { async: false, inverse: 'repository' })
  declare courseStageFeedbackSubmissions: CourseStageFeedbackSubmissionModel[];

  @hasMany('github-repository-sync-configuration', { async: false, inverse: 'repository' })
  declare githubRepositorySyncConfigurations: GithubRepositorySyncConfiguration[];

  @belongsTo('user', { async: false, inverse: 'repositories' }) declare user: UserModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel | undefined;
  @belongsTo('submission', { async: false, inverse: null }) declare lastSubmission: SubmissionModel;
  @belongsTo('repository-stage-list', { async: false, inverse: 'repository' }) declare stageList: RepositoryStageListModel;
  @hasMany('submission', { async: false, inverse: 'repository' }) declare submissions: SubmissionModel[];

  @attr('string') declare cloneUrl: string;
  @attr('date') declare createdAt: Date;
  @attr('string') declare defaultBranchCommitSha: string;
  @attr('string') declare defaultBranchTreeSha: string;
  @attr('string') declare expectedActivityFrequency: ExpectedActivityFrequency;
  @attr('string') declare name: string;
  @attr('string') declare languageProficiencyLevel: LanguageProficiencyLevel;
  @attr('string') declare progressBannerUrl: string;
  @attr('boolean', { allowNull: true }) declare remindersAreEnabled: boolean | null;
  @attr('number') declare submissionsCount: number;

  get activatedCourseExtensions() {
    return this.extensionActivations
      .toSorted(fieldComparator('activatedAt'))
      .map((activation) => activation.extension)
      .reduce(uniqReducer(), []);
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

  get completedStageSlugs() {
    return this.completedStages.map((item) => item.slug);
  }

  get completedStages() {
    return this.courseStageCompletions.map((item) => item.courseStage).reduce(uniqReducer(), []);
  }

  get completedStagesCount() {
    return this.completedStages.length;
  }

  get currentStage() {
    if (!this.firstSubmissionCreated) {
      return null;
    }

    if (this.stageList) {
      return this.stageList.items.find((item) => item.isCurrent)?.stage;
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

  get firstStageSolution(): CourseStageSolutionModel | null {
    if (!this.course.firstStage) {
      return null;
    }

    return this.course.firstStage.solutions.find((solution) => solution.language === this.language) || null;
  }

  get firstSubmissionCreated() {
    return !!this.lastSubmission;
  }

  get githubRepositorySyncConfiguration() {
    return this.githubRepositorySyncConfigurations[0];
  }

  get highestCompletedStage() {
    if (this.courseStageCompletions.length === 0) {
      return null;
    }

    return this.courseStageCompletions.toSorted((a, b) => compare(a.courseStage.position, b.courseStage.position)).at(-1)?.courseStage;
  }

  get isRecentlyCreated() {
    const now = new Date().getTime();
    const createdAt = this.createdAt.getTime();

    return now - createdAt <= 1800 * 1000; // 30min
  }

  get languageProficiencyLevelHumanized() {
    return RepositoryModel.languageProficiencyLevelMappings[this.languageProficiencyLevel];
  }

  // TODO: Only to bypass TS checks - find out how to use RepositoryModel#languageProficiencyLevelMappings directly in a .hbs template
  get languageProficiencyLevelMappings() {
    return RepositoryModel.languageProficiencyLevelMappings;
  }

  get lastActivityAt() {
    return this.lastSubmissionAt || this.createdAt;
  }

  get lastSubmissionAt() {
    return this.lastSubmission && this.lastSubmission.createdAt;
  }

  get lastSubmissionCanBeUsedForStageCompletion() {
    // The tree_sha comparison here ensures that a user can "complete" stage
    // even if they run tests via the CLI after submitting a solution.
    return (
      this.lastSubmission &&
      this.lastSubmission.statusIsSuccess &&
      this.lastSubmission.treeSha === this.defaultBranchTreeSha &&
      this.lastSubmission.courseStage === this.currentStage
    );
  }

  get lastSubmissionHasFailureStatus() {
    return this.lastSubmission && this.lastSubmission.statusIsFailure;
  }

  get lastSubmissionHasSuccessStatus() {
    return this.lastSubmission && this.lastSubmission.statusIsSuccess;
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

  get secondStageSolution(): CourseStageSolutionModel | null {
    if (!this.course.secondStage) {
      return null;
    }

    return this.course.secondStage.solutions.find((solution) => solution.language === this.language) || null;
  }

  courseStageCompletionFor(courseStage: CourseStageModel) {
    return this.courseStageCompletions.filter((item) => item.courseStage === courseStage).sort(fieldComparator('completedAt'))[0];
  }

  courseStageFeedbackSubmissionFor(courseStage: CourseStageModel) {
    return this.courseStageFeedbackSubmissions.find((item) => item.courseStage === courseStage);
  }

  extensionStagesAreComplete(extension: CourseExtensionModel) {
    return extension.stages.every((stage) => this.stageIsComplete(stage));
  }

  hasClosedCourseStageFeedbackSubmissionFor(courseStage: CourseStageModel) {
    return (
      this.courseStageFeedbackSubmissions.filter((item) => item.courseStage === courseStage).filter((item) => item.status === 'closed').length > 0
    );
  }

  async refreshStateFromServer() {
    return await this.store.query('repository', {
      course_id: this.course.id,
      include: RepositoryPoller.defaultIncludedResources,
    });
  }

  stageCompletedAt(courseStage: CourseStageModel) {
    if (!this.stageList) {
      return null;
    }

    const stageListItem = this.stageList.items.find((item) => item.stage === courseStage);

    return stageListItem ? stageListItem.completedAt : null;
  }

  stageIsComplete(courseStage: CourseStageModel) {
    const courseStageCompletion = this.courseStageCompletionFor(courseStage);

    return !!(courseStageCompletion && !courseStageCompletion.isNew);
  }

  declare fork: (this: Model, payload: unknown) => Promise<{ data: { id: string } }>;
  declare updateBuildpack: (this: Model, payload: unknown) => Promise<void>;
  declare updateTesterVersion: (this: Model, payload: unknown) => Promise<void>;
}

RepositoryModel.prototype.updateBuildpack = memberAction({
  path: 'update-buildpack',
  type: 'post',
});

RepositoryModel.prototype.updateTesterVersion = memberAction({
  path: 'update-tester-version',
  type: 'post',
});

RepositoryModel.prototype.fork = memberAction({
  path: 'fork',
  type: 'post',
});
